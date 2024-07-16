'use client';
import Link from 'next/link';

import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {registerUser} from '@/features/User/userSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import * as yup from 'yup';
import {message} from 'antd';
import {useRouter} from 'next/navigation';
import {useState} from 'react';
import backgroundImage from '/public/images/backgroundInit.jpg';
import Image from 'next/image';
import './signup.css';
import FormBlock from './formBlock';

const registerSchema = yup.object({
  email: yup.string().email('Email không hợp lệ'),

  password: yup
    .string()
    .min(6, 'Password phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập mật khẩu'),
  lastName: yup.string().required('Yêu cầu nhập tên'),
  firstName: yup.string().required('Yêu cầu nhập họ'),
  loginName: yup
    .string()
    .min(4, 'Tên đăng nhập phải có ít nhất 4 kí tự')
    .required('Yêu cầu nhập tên đăng nhập'),

  phone: yup
    .string()
    .min(6, 'Số điện thoại phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập SĐT'),

  cmnd: yup.string().min(6, 'CMND phải có ít nhất 6 kí tự'),

  address: yup
    .string()
    .min(6, 'Địa chỉ phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập địa chỉ'),
});

export default function SignUp() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();

  const [selectedCap, setSelectedCap] = useState('');
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [donViCon, setDonViCon] = useState('');

  const formik = useFormik({
    validationSchema: registerSchema,
    initialValues: {
      loginName: '',
      email: '',
      password: '',
      address: '',
      cmnd: '',
      phone: '',
      cap: '',
      donvi: '',
      donvicon: '',
      lastName: '',
      firstName: '',
    },
    onSubmit: (values) => {
      values.cap = selectedCap;
      values.donvi = selectedDonVi;
      values.donvicon = donViCon;

      if (values.password && values.loginName) {
        dispatch(registerUser(values))
          .then(unwrapResult)
          .then((res) => {
            if (res.user) {
              messageApi
                .open({
                  type: 'Thành công',
                  content: 'Đăng ký thành công',
                  duration: 1,
                })
                .then(() => message.info('Di chuyển qua trang đăng nhập', 1))
                .then(() => {
                  router.push('/login');
                });
            } else {
              messageApi.open({
                type: 'Thất bại',
                content: res.message ?? 'Có lỗi xảy ra',
                duration: 2,
              });
            }
          });
      }
    },
  });

  return (
    <div
      className='relative bg-no-repeat bg-cover bg-center
      flex items-center justify-center'
    >
      <div className='image-block'>
        <Image
          className='image-block_image'
          src={backgroundImage}
          alt='background-image'
        />
      </div>
      {contextHolder}
      <div className='feature-block flex flex-col md:flex-row items-center justify-center w-full max-w-5xl rounded-lg'>
        <div className='md:w-1/2 text-center md:text-left p-8'>
          <h1 className='text-4xl font-bold mb-4'>
            <Link href='/'>
              <p className='hover:no-underline hover:text-[#007bff]'>
                EXAM-ONE
              </p>
            </Link>
          </h1>
        </div>

        <div className='bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md'>
          <h1 className='text-3xl font-bold p-2'>Đăng ký tài khoản</h1>
          <FormBlock
            formik={formik}
            selectedCap={selectedCap}
            selectedDonVi={selectedDonVi}
            setSelectedCap={setSelectedCap}
            setSelectedDonVi={setSelectedDonVi}
            setDonViCon={setDonViCon}
          />
        </div>
      </div>
    </div>
  );
}
