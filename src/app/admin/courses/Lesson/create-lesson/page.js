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
  content: yup.string().min(6).required("Content is required"),
  name: yup.string().min(6).required("Name is required"),
});

export default function CreateLesson(props) {
  const { courseId, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
    formik.resetForm();
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: CreateLessonSchema,
    enableReinitialize: true,
    initialValues: {
      content: "",
      name: "",
    },
    onSubmit: (values) => {
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
      <Button type="primary" onClick={showModal} className="me-3">
        Create Lesson
      </Button>
      <Modal
        title="Edit Course"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
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
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor="course" className="fs-6 fw-bold">
            Content
          </label>
          <CustomInput
            onChange={formik.handleChange("content")}
            onBlur={formik.handleBlur("content")}
            value={formik.values.content}
            error={formik.touched.content && formik.errors.content}
          />
        </div>
      </Modal>
    </>
  );
}
