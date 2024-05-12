'use client';
import CustomButton from '@/components/comman/CustomBtn';
import CustomInput from '@/components/comman/CustomInput';
import Link from 'next/link';
import {AiOutlineMail} from 'react-icons/ai';
import {RiLockPasswordLine} from 'react-icons/ri';
import {MdOutlinePhone} from 'react-icons/md';
import {RiHome4Line} from 'react-icons/ri';
import {MdOutlinePermIdentity} from 'react-icons/md';
import {TbUserSearch} from 'react-icons/tb';
import {TbUserShield} from 'react-icons/tb';

import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {registerUser} from '@/features/User/userSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import * as yup from 'yup';
import {message} from 'antd';
import {useRouter} from 'next/navigation';
import {BsEye, BsEyeSlash} from 'react-icons/bs';
import {useEffect, useState} from 'react';
import {options} from './utils';
import backgroundImage from '/public/images/backgroundInit.jpg';
import Image from 'next/image';
import './signup.css';

const registerSchema = yup.object({
  email: yup
    .string()
    .email('Email không hợp lệ')
    .required('Yêu cầu nhập email'),
  password: yup
    .string()
    .min(6, 'Password phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập mật khẩu'),

  phone: yup
    .string()
    .min(6, 'Số điện thoại phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập SĐT'),

  cmnd: yup
    .string()
    .min(6, 'CMND phải có ít nhất 6 kí tự'),

  address: yup
    .string()
    .min(6, 'Địa chỉ phải có ít nhất 6 kí tự')
    .required('Yêu cầu nhập địa chỉ'),
});

export default function SignUp() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  const [selectedCap, setSelectedCap] = useState('');
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [donViOptions, setDonViOptions] = useState([]);
  const [subUnits, setSubUnits] = useState([]);
  const [donViCon, setDonViCon] = useState('');

  useEffect(() => {
    if (selectedCap === 'Cấp tỉnh') {
      setDonViOptions(options['Cấp tỉnh']);
      formik.handleChange('cap');
    } else if (selectedCap === 'Cấp huyện') {
      setDonViOptions(Object.keys(options['Cấp huyện']));
    } else {
      setDonViOptions(options['Cấp xã']);
    }
    setSelectedDonVi('');
    setSubUnits([]);
  }, [selectedCap]);

  useEffect(() => {
    if (selectedCap === 'Cấp huyện') {
      setSubUnits(options['Cấp huyện'][selectedDonVi] || []);
    } else {
      setSubUnits([]);
    }
  }, [selectedDonVi, selectedCap]);

  const formik = useFormik({
    validationSchema: registerSchema,
    initialValues: {
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

      if (values.password && values.email) {
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
        <Image src={backgroundImage} alt='background-image' />
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
          <form
            action='signup'
            onSubmit={formik.handleSubmit}
            className='p-4  rounded'
          >
            <div className='flex flex-col space-y-4 mb-6'>
              <label className='flex flex-col' htmlFor='email'>
                <span className='text-sm font-medium'>Email</span>
                <CustomInput
                  prefix={<AiOutlineMail />}
                  placeholder='Địa chỉ email'
                  onChange={formik.handleChange('email')}
                  onBlur={formik.handleBlur('email')}
                  value={formik.values.email}
                  error={formik.touched.email && formik.errors.email}
                />
              </label>

              <label className='flex flex-col' htmlFor='password'>
                <span className='text-sm font-medium'>Mật khẩu</span>
                <CustomInput
                  prefix={<RiLockPasswordLine />}
                  suffix={
                    showPassword ? (
                      <BsEyeSlash
                        onClick={() => setShowPassword(false)}
                        style={{cursor: 'pointer'}}
                      />
                    ) : (
                      <BsEye
                        onClick={() => setShowPassword(true)}
                        style={{cursor: 'pointer'}}
                      />
                    )
                  }
                  placeholder='Mật khẩu'
                  onBlur={formik.handleBlur('password')}
                  onChange={(e) => {
                    formik.handleChange('password')(e);
                    setPasswordValue(e.target.value);
                  }}
                  value={passwordValue}
                  error={formik.touched.password && formik.errors.password}
                  type={showPassword ? 'text' : 'password'}
                />
              </label>

              <label className='flex flex-col' htmlFor='fistName'>
                <span className='text-sm font-medium'>Họ và tên</span>
                <div className='flex justify-content-around'>
                  <CustomInput
                    prefix={<TbUserSearch />}
                    placeholder='Nhập họ'
                    onChange={formik.handleChange('lastName')}
                    onBlur={formik.handleBlur('lastName')}
                    value={formik.values.lastName}
                    error={formik.touched.lastName && formik.errors.lastName}
                    required
                    className='mr-1'
                  />
                  <CustomInput
                    prefix={<TbUserShield />}
                    placeholder='Nhập tên'
                    onChange={formik.handleChange('firstName')}
                    onBlur={formik.handleBlur('firstName')}
                    value={formik.values.firstName}
                    error={formik.touched.firstName && formik.errors.firstName}
                    required
                  />
                </div>
              </label>

              <label className='flex flex-col' htmlFor='phone'>
                <span className='text-sm font-medium'>Số Điện Thoại</span>
                <CustomInput
                  prefix={<MdOutlinePhone />}
                  placeholder='Nhập số điện thoại'
                  onChange={formik.handleChange('phone')}
                  onBlur={formik.handleBlur('phone')}
                  value={formik.values.phone}
                  error={formik.touched.phone && formik.errors.phone}
                  required
                />
              </label>

              <label className='flex flex-col' htmlFor='cmnd'>
                <span className='text-sm font-medium'>CMND/CCCD</span>
                <CustomInput
                  prefix={<MdOutlinePermIdentity />}
                  placeholder='Nhập số CMND/CCCD'
                  onChange={formik.handleChange('cmnd')}
                  onBlur={formik.handleBlur('cmnd')}
                  value={formik.values.cmnd}
                  error={formik.touched.cmnd && formik.errors.cmnd}
                />
              </label>

              <label className='flex flex-col' htmlFor='adress'>
                <span className='text-sm font-medium'>Địa chỉ</span>
                <CustomInput
                  prefix={<RiHome4Line />}
                  placeholder='Địa chỉ cụ thể'
                  onChange={formik.handleChange('address')}
                  onBlur={formik.handleBlur('address')}
                  value={formik.values.address}
                  error={formik.touched.address && formik.errors.address}
                  required
                />
              </label>

              <span className='text-sm font-medium'>Đơn vị công tác</span>

              <label className='flex flex-col' htmlFor='cap'>
                <select
                  value={selectedCap}
                  onChange={(e) => setSelectedCap(e.target.value)}
                >
                  <option value=''>Chọn Cấp</option>
                  <option value='Cấp tỉnh'>Cấp tỉnh</option>cd
                  <option value='Cấp huyện'>Cấp huyện</option>
                  <option value='Cấp xã'>Cấp xã</option>
                </select>
              </label>
              <label className='flex flex-col' htmlFor='donvi'>
                {selectedCap && (
                  <select
                    className='mt-2'
                    value={selectedDonVi}
                    onChange={(e) => setSelectedDonVi(e.target.value)}
                    disabled={!selectedCap}
                  >
                    <option value=''>Chọn đơn vị</option>
                    {donViOptions.map((unit) => (
                      <option key={unit} value={unit}>
                        {unit.replace(/^-+/, '')}
                      </option>
                    ))}
                  </select>
                )}
              </label>
              <label className='flex flex-col' htmlFor='donvicon'>
                {selectedDonVi && subUnits.length !== 0 && (
                  <select
                    className='mt-2'
                    disabled={!selectedDonVi || subUnits.length === 0}
                    onChange={(e) => setDonViCon(e.target.value)}
                  >
                    <option value=''>Chọn đơn vị con</option>
                    {subUnits.map((subUnit) => (
                      <option key={subUnit} value={subUnit}>
                        {subUnit.replace(/^-+/, '')}
                      </option>
                    ))}
                  </select>
                )}
              </label>
            </div>

            <CustomButton
              title='Đăng ký'
              type='primary'
              className='py-1 px-8 bg-blue-900 hover:bg-blue-400 mt-5
                text-white text-center inline-block text-lg
                my-1 mx-1 rounded-lg cursor-pointer border-none w-full signup-block'
            />

            <div className='mt-2 mb-2'>
              <Link href='/login'>
                <span className='text-xs text-blue-800  hover:text-blue-800'>
                  Bạn đã có tài khoản? <b>Đăng nhập</b>
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
