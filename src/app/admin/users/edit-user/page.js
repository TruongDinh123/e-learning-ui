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
import { updateRole, updateUser } from "@/features/User/userSlice";

const Userchema = yup.object({
  lastName: yup.string().min(6).required("name is required"),
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
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: data?.lastName,
      email: data?.email,
    },
    onSubmit: (values) => {
      dispatch(updateUser({ id: id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setData(res.metadata);
          } else {
            messageApi.error(res.message);
          }
          refresh();
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
        title="Edit Role"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <div>
          <label htmlFor="role" className="fs-6 fw-bold">
            Last Name
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("lastName")}
            onBlur={formik.handleBlur("lastName")}
            value={formik.values.lastName}
            error={formik.touched.lastName && formik.errors.lastName}
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
            error={formik.touched.email && formik.errors.email}
          />
        </div>
      </Modal>
    </>
  );
}
