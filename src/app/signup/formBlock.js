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

import {BsEye, BsEyeSlash} from 'react-icons/bs';
import {useState} from 'react';

const FormBlock = ({formik}) => {
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState('');

  return (
    <form
      action='signup'
      onSubmit={formik.handleSubmit}
      className='p-4  rounded'
    >
      <div className='flex flex-col space-y-4 mb-6'>
        <label className='flex flex-col' htmlFor='fistName'>
          <span className='text-sm font-medium'>Họ và tên</span>
          <div className='flex justify-content-around gap-12'>
            <div>
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
            </div>
            <div>
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
          </div>
        </label>

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

        <div className='space-y-2'>
          <label className='text-base' htmlFor='cap'>
            <span className='text-sm font-medium'>Đơn vị công tác</span>

            <CustomInput
              prefix={<MdOutlinePermIdentity />}
              placeholder='Đơn vị công tác'
              onChange={formik.handleChange('cap')}
              onBlur={formik.handleBlur('cap')}
              value={formik.values.cap}
              error={formik.touched.cap && formik.errors.cap}
            />
          </label>
        </div>
      </div>

      <CustomButton
        title='Đăng ký'
        type='primary'
        className='py-1 px-8 bg-blue-900 hover:bg-blue-400 mt-2
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
  );
};

export default FormBlock;
