'use client';
import React from 'react';
import {Avatar, Button, DatePicker, Upload} from 'antd';
import {AntDesignOutlined, UploadOutlined} from '@ant-design/icons';
import CustomInput from '@/components/comman/CustomInput';
import moment from 'moment';
import {MdOutlinePermIdentity} from 'react-icons/md';
import {RiHome4Line} from 'react-icons/ri';

const FormBlock = ({formik, user, imageUrl, file, setFile}) => {
  const propsUdateImage = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue('filename', ''); // reset filename when file is removed
    },
    beforeUpload: (file) => {
      setFile(file);
      formik.setFieldValue('filename', file.name); // set filename when a new file is uploaded
      return false;
    },
    fileList: file ? [file] : [],
  };

  return (
    <form>
      <div className='col-span-2 my-2'>
        <label className='text-base' htmlFor='name'>
          Ảnh đại diện
        </label>
        <div className='flex items-center mb-2'>
          <Avatar
            size={{
              xs: 80,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            icon={<AntDesignOutlined />}
            src={imageUrl || user?.image_url}
            className='mr-1'
          />
        </div>
        <Upload {...propsUdateImage}>
          <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
        </Upload>
      </div>
      <div className='grid grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <label className='text-base' htmlFor='name'>
            Họ của bạn
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('lastName')}
            onBlur={formik.handleBlur('lastName')}
            placeholder='Nhập tên...'
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
        <div className='space-y-2'>
          <label className='text-base' htmlFor='name'>
            Tên của bạn
          </label>
          <CustomInput
            className='mb-3'
            onChange={formik.handleChange('firstName')}
            onBlur={formik.handleBlur('firstName')}
            placeholder='Nhập tên...'
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
      </div>

      <div className='space-y-2'>
        <label className='text-base' htmlFor='email'>
          Email
        </label>
        <CustomInput
          className='mb-3'
          onChange={formik.handleChange('email')}
          onBlur={formik.handleBlur('email')}
          value={formik.values.email}
          disabled
          error={
            formik.submitCount > 0 &&
            formik.touched.email &&
            formik.errors.email
              ? formik.errors.email
              : null
          }
        />
      </div>
      <div className='space-y-2'>
        <label className='text-base' htmlFor='dob'>
          Ngày sinh
        </label>
        <DatePicker
          size='large'
          className='mb-3 w-full'
          onChange={(date, dateString) =>
            formik.setFieldValue('dob', dateString)
          }
          onBlur={formik.handleBlur('dob')}
          value={formik.values.dob ? moment(formik.values.dob) : null}
        />
        {formik.submitCount > 0 && formik.touched.dob && formik.errors.dob ? (
          <div>{formik.errors.dob}</div>
        ) : null}
      </div>
      <div className='space-y-2'>
        <label className='text-base' htmlFor='phoneNumber'>
          Số điện thoại
        </label>
        <CustomInput
          className='mb-3'
          onChange={formik.handleChange('phoneNumber')}
          onBlur={formik.handleBlur('phoneNumber')}
          value={formik.values.phoneNumber}
          error={
            formik.submitCount > 0 &&
            formik.touched.phoneNumber &&
            formik.errors.phoneNumber
              ? formik.errors.phoneNumber
              : null
          }
        />
      </div>

      <div className='space-y-2'>
        <label className='text-base' htmlFor='address'>
          Địa chỉ
        </label>
        <CustomInput
          prefix={<RiHome4Line />}
          placeholder='Địa chỉ cụ thể'
          onChange={formik.handleChange('address')}
          onBlur={formik.handleBlur('address')}
          value={formik.values.address}
          error={formik.touched.address && formik.errors.address}
          className='mb-3'
          required
        />
      </div>

      <div className='space-y-2'>
        <label className='text-base' htmlFor='gender'>
          Giới tính:
        </label>
        <select
          className='mb-3'
          onChange={formik.handleChange('gender')}
          onBlur={formik.handleBlur('gender')}
          value={formik.values.gender}
        >
          <option value='Nam'>Nam</option>
          <option value='Nữ'>Nữ</option>
          <option value='Khác'>Khác</option>
        </select>
        {formik.submitCount > 0 &&
        formik.touched.gender &&
        formik.errors.gender ? (
          <div>{formik.errors.gender}</div>
        ) : null}
      </div>

      <div className='space-y-2'>
        <label className='text-base' htmlFor='cmnd'>
          CMND/CCCD
        </label>
        <CustomInput
          prefix={<MdOutlinePermIdentity />}
          placeholder='Nhập số CMND/CCCD'
          onChange={formik.handleChange('cmnd')}
          onBlur={formik.handleBlur('cmnd')}
          value={formik.values.cmnd}
          error={formik.touched.cmnd && formik.errors.cmnd}
          className='mb-3'
        />
      </div>

      <div className='space-y-2 mb-20'>
        <label className='text-base' htmlFor='cap'>
          <span className='text-sm font-medium'>Đơn vị công tác</span>
        </label>

        <CustomInput
          prefix={<MdOutlinePermIdentity />}
          placeholder='Đơn vị công tác'
          onChange={formik.handleChange('cap')}
          onBlur={formik.handleBlur('cap')}
          value={formik.values.cap}
          error={formik.touched.cap && formik.errors.cap}
        />
      </div>
    </form>
  );
};

export default FormBlock;
