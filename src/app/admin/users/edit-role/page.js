'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {Modal, message} from 'antd';
import {useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button} from 'antd';
import CustomInput from '@/components/comman/CustomInput';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {updateRole} from '@/features/User/userSlice';
import React from 'react';

const RoleSchema = yup.object({
  name: yup
    .string()
    .required('Name is required')
    .oneOf(
      ['Admin-Super', 'Admin', 'Mentor', 'Trainee', 'test'],
      'Tên vai trò không hợp lệ'
    )
    .trim('Name must not start or end with whitespace')
    .matches(/^\S*$/, 'Name must not contain whitespace'),
});

export default function EditRole(props) {
  const {id, roleName} = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    await formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
  };

  const formik = useFormik({
    validationSchema: RoleSchema,
    enableReinitialize: true,
    initialValues: {
      name: roleName,
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      messageApi.info('Đang thực hiện...');

      dispatch(updateRole({id: id, values}))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi.success('Cập nhật vai trò thành công!');
          }else {
            message.error(res.message, 3.5);
          }
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
        });
      setIsModalOpen(false);
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
        title='Cập nhật vai trò'
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <React.Fragment>
            <Button key='back' onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key='back'
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
            Tên vai trò
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('name')}
            onBlur={formik.handleBlur('name')}
            value={formik.values.name}
            error={
              formik.submitCount > 0 &&
              formik.touched.name &&
              formik.errors.name
                ? formik.errors.name
                : null
            }
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
