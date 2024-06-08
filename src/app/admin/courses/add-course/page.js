'use client';
import {useDispatch} from 'react-redux';
import {useFormik} from 'formik';
import {unwrapResult} from '@reduxjs/toolkit';
import * as yup from 'yup';
import {message} from 'antd';
import {
  createCourse,
  updateCourseImage,
  uploadImageCourse,
} from '@/features/Courses/courseSlice';
import React, {useState} from 'react';
import {PlusOutlined} from '@ant-design/icons';
import CustomButton from '@/components/comman/CustomBtn';
import {isAdmin} from '@/middleware';
import 'react-quill/dist/quill.snow.css';
import {dataFileInit} from '../common';
import ModalContent from './modalContent';

const CourseSchema = yup.object({
  title: yup
    .string()
    .required('Input the title')
    .trim('Title must not start or end with whitespace'),
  name: yup
    .string()
    .required('Input the organizer')
    .trim('Name must not start or end with whitespace'),
});

export default function AddCourse(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [logoOrg, setLogoOrg] = useState(null);
  const [fileRule, setFileRule] = useState(null);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    initialValues: {
      title: '',
      name: '',
      nameCenter: '',
      isPublic: true,
      rules: '',
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      values.title = values.title.trim();
      setIsLoading(true);

      dispatch(createCourse(values))
        .then(unwrapResult)
        .then((res) => {
          messageApi.success('Thêm khoá học thành công.');
          const courseId = res.metadata?._id;
          const dataInit = dataFileInit({
            bannerFile: file,
            logoFile: logoOrg,
            ruleFile: fileRule,
          });

          if (dataInit.length) {
            dispatch(
              uploadImageCourse({courseId: courseId, dataPackage: dataInit})
            )
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  const imageUrl = res.metadata?.findCourse?.image_url;
                  dispatch(updateCourseImage({courseId, imageUrl}));
                  setFile(null);
                  setIsLoading(false);
                  setIsModalOpen(false);
                  messageApi.success('Hình ảnh khoá học đã được cập nhật.');
                  formik.resetForm();
                }
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
              });
          }
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      {isAdmin() && (
        <CustomButton
          type='primary'
          title={
            <div className='flex items-center justify-center'>
              <PlusOutlined />
              <span className='ml-1'>Thêm cuộc thi</span>
            </div>
          }
          onClick={showModal}
          className={`py-2 px-3 bg-blue-900 hover:bg-blue-400 text-white text-center inline-block text-sm my-1 mx-1 rounded-lg cursor-pointer border-none`}
        ></CustomButton>
      )}
      {isModalOpen && (
        <ModalContent
          formik={formik}
          isModalOpen={isModalOpen}
          file={file}
          isLoading={isLoading}
          logoOrg={logoOrg}
          fileRule={fileRule}
          setFile={setFile}
          setIsModalOpen={setIsModalOpen}
          setLogoOrg={setLogoOrg}
          setFileRule={setFileRule}
        />
      )}
    </React.Fragment>
  );
}
