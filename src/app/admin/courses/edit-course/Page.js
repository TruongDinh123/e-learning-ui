'use client';
import {editCourse, uploadImageCourse} from '@/features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {message} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {Button} from 'antd';
import {useFormik} from 'formik';
import * as yup from 'yup';
import 'react-quill/dist/quill.snow.css';
import {dataFileInit} from '../common';
import ModalContent from './modalContent';

const CourseSchema = yup.object({
  title: yup.string().min(2).required('Input the title'),
  name: yup.string().min(2).required('Input the organizer'),
});

export default function EditCourses(props) {
  const {id, course} = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [logoOrg, setLogoOrg] = useState(null);
  const [fileRule, setFileRule] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const categories = useSelector(
    (state) => state.category?.categories?.metadata
  );

  useEffect(() => {
    setData(course);
  }, [course, categories]);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    enableReinitialize: true,
    initialValues: {
      title: data?.title,
      name: data?.name,
      rules: data?.rules,
      nameCenter: data?.nameCenter,
      isPublic: data?.showCourse,
      rulesFileName: data?.rulesFileName,
    },
    onSubmit: (values) => {
      setIsLoading(true);
      dispatch(editCourse({id: props?.id, values}))
        .then(unwrapResult)
        .then((res) => {
          messageApi.success('Thông tin khoá học đã được cập nhật.');
          const dataInit = dataFileInit({
            bannerFile: file,
            logoFile: logoOrg,
            ruleFile: fileRule,
          });

          if (dataInit.length) {
            return dispatch(
              uploadImageCourse({courseId: id, dataPackage: dataInit})
            )
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  setLogoOrg(null);
                  setFileRule(null);
                  setIsLoading(false);
                  messageApi.success('Hình ảnh khoá học đã được cập nhật.');
                }
                setIsLoading(false);
                window.location.reload();
                return res;
              });
          }
          setIsLoading(false);
          return res;
        })
        .catch((error) => {
          setIsLoading(false);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type='primary'
        onClick={showModal}
        className='me-3 custom-button'
        style={{width: '100%'}}
        loading={isLoading}
      >
        Update content
      </Button>
      {isModalOpen && (
        <ModalContent
          formik={formik}
          logoOrg={logoOrg}
          file={file}
          fileRule={fileRule}
          data={data}
          isModalOpen={isModalOpen}
          setLogoOrg={setLogoOrg}
          setFileRule={setFileRule}
          setFile={setFile}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </React.Fragment>
  );
}
