"use client";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  editCourse,
  getACourse,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Radio, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import {
  createVdLesson,
  updatelesson,
  viewALesson,
} from "@/features/Lesson/lessonSlice";

const CourseSchema = yup.object({
  content: yup
    .string()
    .required("content is required")
    .trim("content must not start or end with whitespace")
    .min(6, "content must be at least 6 characters long"),
  name: yup
    .string()
    .required("name is required")
    .trim("name must not start or end with whitespace")
    .min(6, "name must be at least 6 characters long"),
});

export default function EditLesson(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    getALesson();
  }, []);

  const propsUdateImage = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue("filename", "");
    },
    beforeUpload: (file) => {
      setFile(file);
      formik.setFieldValue("filename", file.name);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const getALesson = () => {
    dispatch(viewALesson({ lessonId: id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    enableReinitialize: true,
    initialValues: {
      name: data?.name,
      content: data?.content,
    },
    onSubmit: (values) => {
      setLoading(true);
      dispatch(updatelesson({ lessonId: id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            return dispatch(createVdLesson({ lessonId: id, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  messageApi.open({
                    type: "Thành công",
                    content: "Đang thực hiện...",
                    duration: 2.5,
                  });
                }
                setLoading(false);
                return res;
              });
          }
          return res;
        })
        .then(() => {
          setLoading(false);

          refresh();
        })
        .catch((error) => {
          
          setLoading(false);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3 custom-button"
        loading={loading}
        style={{width: '100%'}}
      >
        Cập nhật
      </Button>
      <Modal
        title={
          <h1 className="text-3xl font-bold text-blue-500">
            Cập nhật khóa học
          </h1>
        }
        width={1000}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ marginRight: 8 }}
          >
            Hủy
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="custom-button"
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="mt-10">
          <label htmlFor="course" className="fs-6 fw-bold">
            Tên bài học:
          </label>
          <CustomInput
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor="course" className="fs-6 fw-bold mt-2">
            Nội dung bài học:
          </label>
          <textarea
            id="course"
            placeholder="Thêm nội dung"
            onChange={formik.handleChange("content")}
            onBlur={formik.handleBlur("content")}
            value={formik.values.content}
            error={formik.touched.content && formik.errors.content}
            className="form-control"
          />
        </div>

        <Upload {...propsUdateImage}>
          <Button className="mt-3" icon={<UploadOutlined />}>
            Chọn video
          </Button>
        </Upload>
      </Modal>
    </React.Fragment>
  );
}
