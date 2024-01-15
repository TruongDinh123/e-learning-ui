"use client";
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
import { updateCategory } from "@/features/categories/categorySlice";

const CategorySchema = yup.object({
  name: yup.string().required("Yêu cầu nhập tên"),
});

export default function EditCategory(props) {
  const { id, refresh, categoryName } = props;
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
    validationSchema: CategorySchema,
    enableReinitialize: true,
    initialValues: {
      name: categoryName,
    },
    onSubmit: (values) => {
      dispatch(updateCategory({ categoryId: id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "Thành công",
                content: "Đang thực hiện...",
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
        className="me-3 custom-button"
        style={{ width: "100%" }}
      >
        Cập nhật
      </Button>
      <Modal
        title="Cập nhật danh mục"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <React.Fragment>
            <Button key="back" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key="back"
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
