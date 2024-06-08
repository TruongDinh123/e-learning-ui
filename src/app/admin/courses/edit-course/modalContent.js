import {Modal, Upload} from 'antd';
import React from 'react';
import {Button} from 'antd';
import CustomInput from '@/components/comman/CustomInput';
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
  logoOrg,
  file,
  fileRule,
  data,
  isModalOpen,
  setLogoOrg,
  setFileRule,
  setFile,
  setIsModalOpen,
}) => {
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

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  return (
    <Modal
      title={
        <h1 className='text-3xl font-bold text-blue-500'>Update the contest</h1>
      }
      width={1000}
      open={isModalOpen}
      onCancel={handleCancel}
      onOk={handleOk}
      footer={[
        <Button key='cancel' onClick={handleCancel} style={{marginRight: 8}}>
          Cancel
        </Button>,
        <Button
          key='ok'
          type='primary'
          onClick={handleOk}
          className='custom-button'
        >
          Save
        </Button>,
      ]}
    >
      <div className='mt-10'>
        <label htmlFor='course' className='fs-6 font-medium'>
          Contest title:
        </label>
        <CustomInput
          onChange={formik.handleChange('name')}
          onBlur={formik.handleBlur('name')}
          value={formik.values.name}
          error={formik.touched.name && formik.errors.name}
        />

        <label htmlFor='nameCenter' className='fs-6 font-medium'>
          Organizer:
        </label>
        <CustomInput
          onChange={formik.handleChange('nameCenter')}
          onBlur={formik.handleBlur('nameCenter')}
          value={formik.values.nameCenter}
        />

        <div>
          <ImageBlock
            data={data}
            file={file}
            logoOrg={logoOrg}
            handleBannerUpload={handleBannerUpload}
            handleOrganizerUpload={handleOrganizerUpload}
          />
        </div>

        <label htmlFor='courseDescription' className='text-lg font-medium mt-3'>
          Description and Regulation:
        </label>
        <ReactQuill
          theme='snow'
          value={formik.values.title}
          onChange={(content) => formik.setFieldValue('title', content)}
          onBlur={() => formik.setFieldTouched('title', true, true)}
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
        {data && !fileRule && (
          <a href={data.rule_file_url} download>
            {data.rulesFileName}
          </a>
        )}
      </div>
    </Modal>
  );
};

export default ModalContent;
