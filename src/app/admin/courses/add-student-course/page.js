"use client";
import { addStudentToCourse, getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAllUser } from "@/features/User/userSlice";

const EmailSchema = yup.object({
  email: yup.string().email().required("email is required"),
});

export default function AddStudentToCourse(props) {
  const { courseId, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setuser] = useState([]);
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

  useEffect(() => {
    getAUserData();
  }, []);

  const getAUserData = () => {
    dispatch(
      getAllUser({ page: pagination.current, limit: pagination.pageSize })
    )
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setuser(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
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
    validationSchema: EmailSchema,
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      dispatch(addStudentToCourse({ courseId: courseId, values }))
        .then(unwrapResult)
        .then((res) => {
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
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button type="primary" onClick={showModal} className="me-3 custom-button">
        Thêm học viên
      </Button>
      <Modal
        title="Thêm email"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="custom-button"
          >
            OK
          </Button>
        }
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Email:
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
            placeholder="Email"
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
