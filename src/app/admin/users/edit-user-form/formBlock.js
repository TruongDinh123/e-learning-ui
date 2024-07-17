'use client';
import CustomInput from '@/components/comman/CustomInput';
import {AntDesignOutlined, UploadOutlined} from '@ant-design/icons';
import {Avatar, Button, DatePicker, Upload} from 'antd';
import '../../users/edit-user-form/page.css';
import moment from 'moment/moment';
import {RiHome4Line} from 'react-icons/ri';
import District from './district';
import {MdOutlinePermIdentity} from 'react-icons/md';

const FormBlock = ({
  formik,
  imageUrl,
  file,
  data,
  setFile,
  selectedCap,
  selectedDonVi,
  donViCon,
  setSelectedCap,
  setSelectedDonVi,
  setDonViCon,
}) => {
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
        <div className='flex items-center'>
          <Avatar
            size={{
              xs: 24,
              sm: 32,
              md: 40,
              lg: 64,
              xl: 80,
              xxl: 100,
            }}
            icon={<AntDesignOutlined />}
            src={imageUrl || data?.image_url}
            className='mr-1'
          />
          <Upload {...propsUdateImage}>
            <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
          </Upload>
        </div>
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
        <label className='text-base' htmlFor='loginName'>
          Tên đăng nhập
        </label>
        <CustomInput
          className='mb-3'
          onChange={formik.handleChange('loginName')}
          onBlur={formik.handleBlur('loginName')}
          value={formik.values.loginName}
          disabled
          error={
            formik.submitCount > 0 &&
            formik.touched.loginName &&
            formik.errors.loginName
              ? formik.errors.loginName
              : null
          }
        />
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


      <District
        selectedCap={selectedCap}
        selectedDonVi={selectedDonVi}
        donViCon={donViCon}
        setSelectedCap={setSelectedCap}
        setSelectedDonVi={setSelectedDonVi}
        setDonViCon={setDonViCon}
      />
    </form>
  );
};

export default FormBlock;
