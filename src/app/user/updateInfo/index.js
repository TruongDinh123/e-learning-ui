'use client';
import React, {useEffect, useState} from 'react';
import {useFormik} from 'formik';
import * as yup from 'yup';
import {Button, Card, message} from 'antd';
import {getAUser, updateUser, uploadImageUser} from '@/features/User/userSlice';
import {useDispatch} from 'react-redux';
import {unwrapResult} from '@reduxjs/toolkit';
import {Content} from 'antd/es/layout/layout';
import moment from 'moment';
import './index.css';
import FormBlock from './formBlock';

const Userchema = yup.object().shape({
  lastName: yup.string(),
  firstName: yup.string(),
  email: yup.string().email(),
  dob: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string(),
  cmnd: yup.string(),
  address: yup.string(),
  cap: yup.string(),
});

const UpdateInfo = () => {
  const id = localStorage.getItem('x-client-id');
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

  const handleOk = () => {
    setLoading(true);
    formik.submitForm();
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      loginName: user?.loginName,
      lastName: user?.lastName,
      firstName: user?.firstName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      dob: user && user.dob ? moment(user.dob) : null,
      gender: user?.gender,
      cmnd: user?.cmnd || '',
      address: user?.address || '',
      cap: user?.cap || '',
    },
    onSubmit: (values) => {
      values.lastName = values.lastName.trim();
      dispatch(updateUser({id: id, values}))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            return dispatch(uploadImageUser({userId: id, filename: file}))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  setImageUrl(res.metadata.image_url);
                  setLoading(false);
                  messageApi.success({
                    content: 'Cập nhật thành công',
                    duration: 2.5,
                  });
                }
                return res;
              });
          }
          messageApi.success({
            content: 'Cập nhật thành công',
            duration: 2.5,
          });
          return res;
        })
        .then(() => {
          setLoading(false);
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      });
  };

  return (
    <div className='block-update-info mx-auto max-w-md space-y-6 overflow-x-hidden grid-container'>
      {contextHolder}
      <div className='space-y-2 text-center'>
        <h1 className='text-3xl font-bold'>Thông tin của bạn</h1>
        <p className='text-gray-500 dark:text-gray-400'>
          Vui lòng cập nhật thông tin của bạn bên dưới
        </p>
      </div>
      <Card className='space-y-4'>
        <Content>
          <FormBlock
            user={user}
            formik={formik}
            imageUrl={imageUrl}
            file={file}
            setFile={setFile}
         
          />
        </Content>
        <Button
          onClick={handleOk}
          loading={loading}
          className='ml-auto w-full custom-button'
          type='primary'
        >
          Lưu
        </Button>
        <div className='pb-2'></div>
        <Button href='/' type='default' className='ml-auto w-full'>
          Hủy
        </Button>
      </Card>
    </div>
  );
};

export default UpdateInfo;
