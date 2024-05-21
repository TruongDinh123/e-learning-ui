'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {Modal, Select, message} from 'antd';
import {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'antd';
import CustomInput from '@/components/comman/CustomInput';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {
  getAUser,
  getAllRole,
  updateUser,
  updateUserRoles,
} from '@/features/User/userSlice';
import React from 'react';

const Userchema = yup.object({
  lastName: yup.string(),

  firstName: yup.string(),

  email: yup.string().email().required('Yêu cầu nhập email'),
});

export default function EditUser(props) {
  const {id, refresh} = props;

  const allUsersStore = useSelector((state) => state?.user?.allUsers);
  const allRolesStore = useSelector((state) => state?.user?.allRoles);

  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [selectedRoleId, setSelectedRoleId] = useState('');

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
    setIsModalOpen(false);
  };

  const handleRoleChange = (value) => {
    setSelectedRoleId(value);
  };

  useEffect(() => {
    if (allUsersStore && allUsersStore.length) {
      const userCurrent = allUsersStore.find((user) => user._id === id);
      
      if (userCurrent) {
        setData(userCurrent);
        setSelectedRoleId(userCurrent.roles[0]._id);
      }
    }
  }, [allUsersStore, id]);

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: data?.lastName,
      firstName: data?.firstName,
      email: data?.email,
      roles: data?.roles.map((role) => role.name),
    },
    onSubmit: (values) => {
      messageApi
      .open({
        type: 'info',
        content: 'Đang thực hiện...',
      })
      
      dispatch(updateUser({id: id, values}))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi.success(
              'Thông tin người dùng đã được cập nhật.'
            );

            const checkRoleExist =
              res.metadata.roles.includes(selectedRoleId);
              
            !checkRoleExist &&
              dispatch(updateUserRoles({userId: id, roleId: selectedRoleId}))
                .then(unwrapResult)
                .then((roleRes) => {
                  if (roleRes.status) {
                    messageApi.success(
                      'Vai trò người dùng đã được cập nhật.'
                    );
                    setIsModalOpen(false);
                    refresh();
                  } else {
                    messageApi.error(roleRes.message);
                  }
                });
          } else {
            messageApi.error(res.message);
          }

         
        })
        .catch(() => {
          messageApi.error('Có lỗi xảy ra khi cập nhật thông tin người dùng.');
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type='primary'
        onClick={showModal}
        className='me-3 custom-button'
        style={{width: '100%'}}
      >
        Cập nhật
      </Button>
      <Modal
        title='Cập nhật thông tin'
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <React.Fragment>
            <Button key='cancle' type='default' onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key='ok'
              type='primary'
              onClick={handleOk}
              className='custom-button'
            >
              Lưu
            </Button>
          </React.Fragment>
        }
      >
        <div>
          <label htmlFor='role' className='fs-6 fw-bold'>
            Họ
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('lastName')}
            onBlur={formik.handleBlur('lastName')}
            value={formik.values.lastName}
            error={
              formik.submitCount > 0 &&
              formik.touched.lastName &&
              formik.errors.lastName
                ? formik.errors.lastName
                : null
            }
          />
        </div>
        <div>
          <label htmlFor='role' className='fs-6 fw-bold'>
            Tên
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('firstName')}
            onBlur={formik.handleBlur('firstName')}
            value={formik.values.firstName}
            error={
              formik.submitCount > 0 &&
              formik.touched.firstName &&
              formik.errors.firstName
                ? formik.errors.firstName
                : null
            }
          />
        </div>
        <div>
          <label htmlFor='role' className='fs-6 fw-bold'>
            Email
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('email')}
            onBlur={formik.handleBlur('email')}
            value={formik.values.email}
            error={
              formik.submitCount > 0 &&
              formik.touched.email &&
              formik.errors.email
                ? formik.errors.email
                : null
            }
          />
        </div>

        <div>
          <label htmlFor='role' className='fs-6 fw-bold'>
            Danh sách vai trò:
          </label>
          <Select
            id='role'
            value={selectedRoleId}
            onChange={handleRoleChange}
            style={{width: '100%'}} // Adjust width as needed
          >
            {allRolesStore?.map((role) => (
              <Select.Option key={role._id} value={role._id}>
                {role.name}
              </Select.Option>
            ))}
          </Select>
        </div>
      </Modal>
    </React.Fragment>
  );
}
