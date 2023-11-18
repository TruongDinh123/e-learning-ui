"use client";
import { editCourse, getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";

const CourseSchema = yup.object({
  title: yup.string().min(6).required("Title is required"),
  name: yup.string().min(6).required("name is required"),
});

export default function EditCourses(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);

  useEffect(() => {
    getACourseData();
  }, []);

  const getACourseData = () => {
    dispatch(getACourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
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
      title: data?.title,
      name: data?.name,
    },
    onSubmit: (values) => {
      dispatch(editCourse({ id: props?.id, values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => {
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
        style={{ width: "100%", color: "#fff", backgroundColor: "#1890ff" }}
      >
        Edit
      </Button>
      <Modal
        title="Edit Course"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            style={{ backgroundColor: "#1890ff", color: "white" }}
          >
            OK
          </Button>,
        ]}
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Course Title
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            value={formik.values.title}
            error={formik.touched.title && formik.errors.title}
          />

          <label htmlFor="course" className="fs-6 fw-bold">
            Course Name
          </label>
          <CustomInput
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />
        </div>
      </Modal>
    </>
  );
}
