'use client';
import CustomInput from '@/components/comman/CustomInput';
import {getAUser, updateUser, uploadImageUser} from '@/features/User/userSlice';
import {AntDesignOutlined, UploadOutlined} from '@ant-design/icons';
import {unwrapResult} from '@reduxjs/toolkit';
import {Avatar, Button, Card, DatePicker, Upload, message} from 'antd';
import {Content} from 'antd/es/layout/layout';
import {useFormik} from 'formik';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import * as yup from 'yup';
import '../../users/edit-user-form/page.css';
import moment from 'moment/moment';
import {RiHome4Line} from 'react-icons/ri';
import District from './district';
import {MdOutlinePermIdentity} from 'react-icons/md';
import FormBlock from './formBlock';

const Userchema = yup.object({
  lastName: yup.string(),
  firstName: yup.string(),
  email: yup.string().email(),
  dob: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string(),
  cmnd: yup.string(),
  address: yup.string(),
  cap: yup.string(),
  donvi: yup.string(),
  donvicon: yup.string(),
});
export default function EditUserForm() {
  const id = localStorage.getItem('x-client-id');
  const [messageApi, contextHolder] = message.useMessage();
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCap, setSelectedCap] = useState('');
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [donViCon, setDonViCon] = useState('');

  const handleOk = () => {
    setLoading(true);
    formik.submitForm();
  };

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setSelectedCap(res.metadata['cap']);
          setSelectedDonVi(res.metadata['donvi']);
          setDonViCon(res.metadata['donvicon']);
          setData(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: data?.lastName,
      firstName: data?.firstName,
      loginName: data?.loginName,
      email: data?.email,
      phoneNumber: data?.phoneNumber,
      dob: data?.dob,
      gender: data?.gender,
      cmnd: data?.cmnd || '',
      address: data?.address || '',
      cap: data?.cap || '',
      donvi: data?.donvi || '',
      donvicon: data?.donvicon || '',
    },
    onSubmit: (values) => {
      values.cap = selectedCap;
      values.donvi = selectedDonVi;
      values.donvicon = donViCon;
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
          window.location.reload();
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

  return (
    <div className='mx-auto max-w-md space-y-6 overflow-x-hidden grid-container pt-3'>
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
            formik={formik}
            imageUrl={imageUrl}
            file={file}
            data={data}
            setFile={setFile}
            selectedCap={selectedCap}
            selectedDonVi={selectedDonVi}
            donViCon={donViCon}
            setSelectedCap={setSelectedCap}
            setSelectedDonVi={setSelectedDonVi}
            setDonViCon={setDonViCon}
          />
        </Content>
        <Button
          onClick={handleOk}
          loading={loading}
          type='primary'
          className='ml-auto w-full custom-button'
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
}
