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
import { updateRole } from "@/features/User/userSlice";
import React from "react";

const RoleSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(6, "Name must be at least 6 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
});

export default function EditRole(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = async () => {
    await formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
  };

  const formik = useFormik({
    validationSchema: RoleSchema,
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      values.name = values.name.trim();

      dispatch(updateRole({ id: id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "success",
                content: "Action in progress...",
              })
              .then(() => {
                refresh();
              });
          } else {
            message.error(res.message, 3.5);
          }
        })
        .catch((error) => {
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
        footer={
          <React.Fragment>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
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
          </React.Fragment>
        }
      >
        <div>
          <label htmlFor="role" className="fs-6 fw-bold">
            Name Role
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
        </div>
      </Modal>
    </React.Fragment>
  );
}
