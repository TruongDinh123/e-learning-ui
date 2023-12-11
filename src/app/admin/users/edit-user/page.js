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
import { getAUser, updateRole, updateUser } from "@/features/User/userSlice";
import React from "react";

const Userchema = yup.object({
  lastName: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
  email: yup.string().email().required("email is required"),
});

export default function EditUser(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);

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

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.data.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: data?.lastName,
      email: data?.email,
    },
    onSubmit: (values) => {
      values.lastName = values.lastName.trim();
      dispatch(updateUser({ id: id, values }))
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
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{ width: "100%", color: "#fff", backgroundColor: "#1890ff" }}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Chỉnh sửa vài trò"
        open={isModalOpen}
        footer={
          <React.Fragment>
            <Button key="cancle" type="default" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleOk}
              style={{ backgroundColor: "#1890ff", color: "white" }}
            >
              Lưu
            </Button>
          </React.Fragment>
        }
      >
        <div>
          <label htmlFor="role" className="fs-6 fw-bold">
            Tên
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("lastName")}
            onBlur={formik.handleBlur("lastName")}
            value={formik.values.lastName}
            error={
              formik.submitCount > 0 &&
              formik.touched.lastName &&
              formik.errors.lastName
                ? formik.errors.lastName
                : null
            }
          />
        </div>
        <div>
          <label htmlFor="role" className="fs-6 fw-bold">
            Email
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            error={
              formik.submitCount > 0 &&
              formik.touched.email &&
              formik.errors.email
                ? formik.errors.email
                : null
            }
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
