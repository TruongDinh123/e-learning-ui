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
    setIsModalOpen(false);
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
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => {
              refresh();
            });
        })
        .catch((error) => {
          
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
        style={{width: '100%'}}
      >
        Cập nhật
      </Button>
      <Modal
        title="Cập nhật thông tin"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <React.Fragment>
            <Button key="cancle" type="default" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key="ok"
              type="primary"
              onClick={handleOk}
              className="custom-button"
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
