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
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedCap, setSelectedCap] = useState('');
  const [selectedDonVi, setSelectedDonVi] = useState('');
  const [donViCon, setDonViCon] = useState('');

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

  const id = localStorage.getItem('x-client-id');

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
              {formik.submitCount > 0 &&
              formik.touched.dob &&
              formik.errors.dob ? (
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

            <District
              selectedCap={selectedCap}
              selectedDonVi={selectedDonVi}
              donViCon={donViCon}
              setSelectedCap={setSelectedCap}
              setSelectedDonVi={setSelectedDonVi}
              setDonViCon={setDonViCon}
            />
          </form>
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
