"use client";
import CustomInput from "@/components/comman/CustomInput";
import {
  getAUser,
  updateUser,
  updateUserProfile,
  uploadImageUser,
} from "@/features/User/userSlice";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Avatar, Button, Card, Input, Upload, message } from "antd";
import { Content } from "antd/es/layout/layout";
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import "../../users/edit-user-form/page.css";

const Userchema = yup.object({
  lastName: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
  firstName: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
  email: yup.string().email().required("email is required"),
});
export default function EditUserForm() {
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);

  const propsUdateImage = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue("filename", ""); // reset filename when file is removed
    },
    beforeUpload: (file) => {
      setFile(file);
      formik.setFieldValue("filename", file.name); // set filename when a new file is uploaded
      return false;
    },
    fileList: file ? [file] : [],
  };

  const id = localStorage.getItem("x-client-id");

  const handleOk = () => {
    formik.submitForm();
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
      firstName: data?.firstName,
    },
    onSubmit: (values) => {
      values.lastName = values.lastName.trim();
      dispatch(updateUser({ id: id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            return dispatch(uploadImageUser({ userId: id, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  setImageUrl(res.metadata.image_url);
                  dispatch(updateUserProfile(res.metadata));
                  messageApi.open({
                    type: "Thành công",
                    content: "Đang thực hiện...",
                    duration: 2.5,
                  });
                }
                return res;
              });
          }
          return res;
        })
        // .then(() => {
        //   refresh();
        // })
        .catch((error) => {
          console.log(error);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });
  return (
    <div className="flex flex-col w-full overflow-x-hidden grid-container bg-gray-100">
      {contextHolder}
      <main className="flex-grow p-6">
        <h2 className="text-lg font-semibold text-gray-700 dark:text-gray-950">
          Thông tin của bạn
        </h2>
        <Card className="mt-6">
          <Content>
            <form className="grid gap-4">
              <label className="text-base" htmlFor="name">
                Ảnh đại diện
              </label>
              <Avatar
                size={{
                  xs: 24,
                  sm: 32,
                  md: 40,
                  lg: 64,
                  xl: 80,
                  xxl: 100,
                }}
                icon={<AntDesignOutlined />}
                src={imageUrl || data?.image_url}
                className="mr-1"
              />
              <Upload {...propsUdateImage}>
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
              <div className="grid gap-2">
                <label className="text-base" htmlFor="name">
                  Họ của bạn
                </label>
                <CustomInput
                  className="mb-3"
                  onChange={formik.handleChange("lastName")}
                  onBlur={formik.handleBlur("lastName")}
                  placeholder="Nhập tên..."
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
              <div className="grid gap-2">
                <label className="text-base" htmlFor="name">
                  Tên của bạn
                </label>
                <CustomInput
                  className="mb-3"
                  onChange={formik.handleChange("firstName")}
                  onBlur={formik.handleBlur("firstName")}
                  placeholder="Nhập tên..."
                  value={formik.values.firstName}
                  error={
                    formik.submitCount > 0 &&
                    formik.touched.firstName &&
                    formik.errors.firstName
                      ? formik.errors.firstName
                      : null
                  }
                />
              </div>
              <div className="grid gap-2">
                <label className="text-base" htmlFor="email">
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
              <div className="grid gap-2"></div>
            </form>
          </Content>
          <Button onClick={handleOk} className="ml-auto">
            Save
          </Button>
        </Card>
      </main>
    </div>
  );
}
