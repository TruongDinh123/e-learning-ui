"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import React from "react";
import { createCategory } from "@/features/categories/categorySlice";

const CategorySchema = yup.object({
  name: yup.string().required("Yêu cầu nhập tên danh mục"),
});

export default function CreateCategory(props) {
  const { refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setIsLoading] = useState(false);

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
    validationSchema: CategorySchema,
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      setIsLoading(true);
      dispatch(createCategory(values))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
            })
            .then(() => {
              refresh();
              setIsLoading(false);
            });
        })
        .catch((error) => {
          setIsLoading(false);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button onClick={showModal} type="primary" className="me-3 custom-button">
        Tạo
      </Button>
      <Modal
        title="Create Role"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <React.Fragment>
            <Button
              key="submit"
              type="primary"
              onClick={handleOk}
              className="custom-button"
              loading={loading}
            >
              Lưu
            </Button>
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>
          </React.Fragment>
        }
      >
        <div>
          <label htmlFor="role" className="fs-6 fw-bold">
            Tên danh mục
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
