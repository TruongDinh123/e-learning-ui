"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Upload, message } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { createLesson, createVdLesson } from "@/features/Lesson/lessonSlice";
import { UploadOutlined } from "@ant-design/icons";

const CreateLessonSchema = yup.object({
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

export default function CreateLesson(props) {
  const { courseId, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
  };

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

  const formik = useFormik({
    validationSchema: CreateLessonSchema,
    enableReinitialize: true,
    initialValues: {
      content: "",
      name: "",
    },
    onSubmit: (values) => {
      values.content = values.content.trim();
      values.name = values.name.trim();
      setIsLoading(true);
      dispatch(createLesson({ courseId: courseId, values }))
        .then(unwrapResult)
        .then((res) => {
          const lessonId = res.metadata.lesson._id;
          if (file) {
            return dispatch(
              createVdLesson({ lessonId: lessonId, filename: file })
            )
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  messageApi.open({
                    type: "Thành công",
                    content: "Đang thực hiện...",
                    duration: 2.5,
                  });
                  refresh();
                }
                return res;
              });
          }
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => {
              message.success(res.message, 1.5);
              refresh();
            });
        })
        .catch((error) => {});
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3 mt-2 custom-button"
      >
        Tạo bài học
      </Button>
      <Modal
        title={
          <h1 className="text-2xl font-bold text-blue-500">Tạo bài học</h1>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1000}
        footer={
          <Button
            key="back"
            type="primary"
            onClick={handleOk}
            loading={isLoading}
            className="custom-button"
          >
            Lưu
          </Button>
        }
      >
        <div className="mt-10">
          <label htmlFor="course" className="fs-6 font-medium">
            Tên bài học:
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            placeholder="Tên bài học"
            error={
              formik.submitCount > 0 &&
              formik.touched.name &&
              formik.errors.name
                ? formik.errors.name
                : null
            }
          />

          <label htmlFor="course" className="fs-6 font-medium">
            Nội dung:
          </label>
          <textarea
            onChange={formik.handleChange("content")}
            onBlur={formik.handleBlur("content")}
            value={formik.values.content}
            placeholder="Thêm nội dung"
            className="form-control"
            error={
              formik.submitCount > 0 &&
              formik.touched.content &&
              formik.errors.content
                ? formik.errors.content
                : null
            }
          />
          {formik.touched.content && formik.errors.content ? (
            <div className="text-red-600">{formik.errors.content}</div>
          ) : null}
        </div>

        <div>
          <label htmlFor="course" className="fs-6 font-medium mr-2">
            Video bài học:
          </label>
          <Upload {...propsUdateImage}>
            <Button className="mt-3" icon={<UploadOutlined />}>
              Chọn video
            </Button>
          </Upload>
        </div>
      </Modal>
    </React.Fragment>
  );
}
