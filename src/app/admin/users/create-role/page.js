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
  name: yup.string().required("name is required"),
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

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: RoleSchema,
    enableReinitialize: true,
    initialValues: {
      name: "",
    },
    onSubmit: (values) => {
      dispatch(createRole({ values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
            })
            .then(() => {
              message.success(res.message);
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
        Create
      </Button>
      <Modal
        title="Create Role"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
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
            error={formik.touched.name && formik.errors.name}
          />
        </div>
      </Modal>
    </>
  );
}
