import CustomInput from '@/components/comman/CustomInput';
import {Button, Modal, Upload} from 'antd';
import React from 'react';
import {UploadOutlined} from '@ant-design/icons';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import ImageBlock from './imageBlock';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {ssr: false}
);

const ModalContent = ({
  formik,
  isModalOpen,
  file,
  isLoading,
  logoOrg,
  fileRule,
  setFile,
  setIsModalOpen,
  setLogoOrg,
  setFileRule,
}) => {
  const handleOk = () => {
    formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOrganizerUpload = {
    onRemove: () => {
      setLogoOrg(null);
      formik.setFieldValue('filename', ''); // reset filename when file is removed
    },
    beforeUpload: (logo) => {
      setLogoOrg(logo);
      formik.setFieldValue('filename', logo.name); // set filename when a new file is uploaded
      return false;
    },
    fileList: logoOrg ? [logoOrg] : [],
  };

  const handleRulesUpload = {
    onRemove: () => {
      setFileRule(null);
      formik.setFieldValue('rulesFileName', ''); // reset rulesFileName when file is removed
    },
    beforeUpload: (rulesFileName) => {
      setFileRule(rulesFileName);
      formik.setFieldValue('rulesFileName', rulesFileName.name); // set rulesFileName when a new file is uploaded
      return false;
    },
    fileList: fileRule ? [fileRule] : [],
  };

  const handleBannerUpload = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue('banner-contest', '');
    },
    beforeUpload: (banner) => {
      setFile(banner);
      formik.setFieldValue('banner-contest', banner.name);
      return false;
    },
    fileList: file ? [file] : [],
  };

  return (
    <Modal
      title={<h1 className='text-2xl font-bold text-blue-500'>Tạo cuộc thi</h1>}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      width={1000}
      footer={
        <div>
          <Button key='cancel' onClick={handleCancel}>
            Cancel
          </Button>
          <Button
            key='save'
            type='primary'
            className='custom-button'
            onClick={handleOk}
            loading={isLoading}
          >
            Lưu
          </Button>
        </div>
      }
    >
      <div className='mt-10'>
        <label htmlFor='course' className='text-lg font-medium'>
          Tên cuộc thi:
        </label>
        <CustomInput
          id='course'
          placeholder='Input the title'
          onChange={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          value={formik.values.name}
          error={
            formik.submitCount > 0 && formik.touched.name && formik.errors.name
              ? formik.errors.name
              : null
          }
        />

        <label htmlFor='nameCenter' className='text-lg font-medium'>
          Tên tổ chức:
        </label>
        <CustomInput
          id='nameCenter'
          placeholder='Input the organizer'
          onChange={formik.handleChange('nameCenter')}
          onBlur={formik.handleBlur('nameCenter')}
          value={formik.values.nameCenter}
        />
        <div>
          <ImageBlock
            handleBannerUpload={handleBannerUpload}
            handleOrganizerUpload={handleOrganizerUpload}
          />
        </div>

        <label htmlFor='courseDescription' className='text-lg font-medium mt-3'>
          Mô tả và thể lệ cuộc thi
        </label>
        <ReactQuill
          theme='snow'
          value={formik.values.title}
          onChange={(content) => formik.setFieldValue('title', content)}
          onBlur={() => formik.setFieldTouched('title', true, true)}
          placeholder='Add description and regulation'
          className='bg-white'
          modules={{
            toolbar: [
              [{header: [1, 2, false]}],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],

              [{list: 'ordered'}, {list: 'bullet'}],
              [{script: 'sub'}, {script: 'super'}],
              [{indent: '-1'}, {indent: '+1'}],
              [{direction: 'rtl'}],

              [
                {
                  size: ['small', false, 'large', 'huge'],
                },
              ],
              [{header: [1, 2, 3, 4, 5, 6, false]}],

              [{color: []}, {background: []}],
              [{font: []}],
              [{align: []}],

              ['clean'],
            ],
          }}
        />

        <label htmlFor='courseDescription' className='text-lg font-medium mt-3'>
          Thể lệ:
        </label>
        <ReactQuill
          theme='snow'
          value={formik.values.rules}
          onChange={(content) => formik.setFieldValue('rules', content)}
          onBlur={() => formik.setFieldTouched('rules', true, true)}
          placeholder='Thêm mô tả'
          className='bg-white'
          modules={{
            toolbar: [
              [{header: [1, 2, false]}],
              ['bold', 'italic', 'underline', 'strike'],
              ['blockquote', 'code-block'],

              [{list: 'ordered'}, {list: 'bullet'}],
              [{script: 'sub'}, {script: 'super'}],
              [{indent: '-1'}, {indent: '+1'}],
              [{direction: 'rtl'}],

              [
                {
                  size: ['small', false, 'large', 'huge'],
                },
              ],
              [{header: [1, 2, 3, 4, 5, 6, false]}],

              [{color: []}, {background: []}],
              [{font: []}],
              [{align: []}],

              ['clean'],
            ],
          }}
        />
        <label htmlFor='courseDescription' className='text-lg font-medium mt-3'>
          Thể lệ upload file:
        </label>
        <Upload {...handleRulesUpload}>
          <Button className='mt-3' icon={<UploadOutlined />}>
            Choose logo
          </Button>
        </Upload>

        {formik.submitCount > 0 && formik.touched.title && formik.errors.title
          ? formik.errors.title
          : null}
      </div>
    </Modal>
  );
};

export default ModalContent;
