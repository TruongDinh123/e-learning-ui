"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { createLesson } from "@/features/Lesson/lessonSlice";

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

      dispatch(createLesson({ courseId: courseId, values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => {
              message.success(res.message, 1.5);
              refresh();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{
          color: "#fff",
          backgroundColor: "#1890ff",
        }}
      >
        Create
      </Button>
      <Modal
        title="Edit Course"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <Button
            key="back"
            type="primary"
            onClick={handleOk}
            style={{
              color: "#fff",
              backgroundColor: "#1890ff",
            }}
          >
            Save
          </Button>
        }
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Lesson Name
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={
              formik.submitCount > 0 &&
              formik.touched.name &&
              formik.errors.name
                ? formik.errors.name
                : null
            }
          />

          <label htmlFor="course" className="fs-6 fw-bold">
            Content
          </label>
          <CustomInput
            onChange={formik.handleChange("content")}
            onBlur={formik.handleBlur("content")}
            value={formik.values.content}
            error={
              formik.submitCount > 0 &&
              formik.touched.content &&
              formik.errors.content
                ? formik.errors.content
                : null
            }
          />
        </div>
      </Modal>
    </>
  );
}
