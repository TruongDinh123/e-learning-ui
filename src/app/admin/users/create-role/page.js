"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { createRole } from "@/features/User/userSlice";

const RoleSchema = yup.object({
  name: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(6, "Name must be at least 6 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
});

export default function CreateRole(props) {
  const { refresh } = props;
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
      dispatch(createRole({ values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
            })
            .then(() => {
              refresh();
            });
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
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
        style={{ color: "#fff", backgroundColor: "#1890ff" }}
      >
        Create
      </Button>
      <Modal
        title="Create Role"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <>
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
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </>
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
    </>
  );
}
