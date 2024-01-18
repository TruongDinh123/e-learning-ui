"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Avatar, Button, Card, DatePicker, Upload, message } from "antd";
import {
  getAUser,
  updateUser,
  updateUserProfile,
  uploadImageUser,
} from "@/features/User/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Content } from "antd/es/layout/layout";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import CustomInput from "@/components/comman/CustomInput";
import moment from "moment";
import "../user/page.css";

const Userchema = yup.object().shape({
  lastName: yup.string(),
  firstName: yup.string(),
  email: yup.string().email(),
  dob: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string(),
});

export default function UpdateInfoUser() {
  const id = localStorage.getItem("x-client-id");
  const [user, setUser] = useState(null);
  const [file, setFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);

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

  const handleOk = () => {
    setLoading(true);
    formik.submitForm();
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: user?.lastName,
      firstName: user?.firstName,
      email: user?.email,
      phoneNumber: user?.phoneNumber,
      dob: user?.dob,
      gender: user?.gender,
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
                  setLoading(false);
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
        .then(() => {
          window.location.reload();
          setLoading(false);
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
          setLoading(false);
        })
        .finally(() => {
          setLoading(false);
        });
    },
  });

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="mx-auto max-w-md space-y-6 overflow-x-hidden grid-container">
      {contextHolder}
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold">Thông tin của bạn</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Vui lòng cập nhật thông tin của bạn bên dưới
        </p>
      </div>
      <Card className="space-y-4">
        <Content>
          <form>
            <div className="col-span-2 my-2">
              <label className="text-base" htmlFor="name">
                Ảnh đại diện
              </label>
              <div className="flex items-center mb-2">
                <Avatar
                  size={{
                    xs: 80,
                    sm: 32,
                    md: 40,
                    lg: 64,
                    xl: 80,
                    xxl: 100,
                  }}
                  icon={<AntDesignOutlined />}
                  src={imageUrl || user?.image_url}
                  className="mr-1"
                />
              </div>
              <Upload {...propsUdateImage}>
                <Button icon={<UploadOutlined />}>Chọn hình ảnh</Button>
              </Upload>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
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
              <div className="space-y-2">
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
            </div>
            <div className="space-y-2">
              <label className="text-base" htmlFor="email">
                Email
              </label>
              <CustomInput
                className="mb-3"
                onChange={formik.handleChange("email")}
                onBlur={formik.handleBlur("email")}
                value={formik.values.email}
                disabled
                error={
                  formik.submitCount > 0 &&
                  formik.touched.email &&
                  formik.errors.email
                    ? formik.errors.email
                    : null
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-base" htmlFor="dob">
                Ngày sinh
              </label>
              <DatePicker
                size="large"
                className="mb-3 w-full"
                onChange={(date, dateString) =>
                  formik.setFieldValue("dob", dateString)
                }
                onBlur={formik.handleBlur("dob")}
                value={formik.values.dob ? moment(formik.values.dob) : null}
              />
              {formik.submitCount > 0 &&
              formik.touched.dob &&
              formik.errors.dob ? (
                <div>{formik.errors.dob}</div>
              ) : null}
            </div>
            <div className="space-y-2">
              <label className="text-base" htmlFor="phoneNumber">
                Phone Number
              </label>
              <CustomInput
                className="mb-3"
                onChange={formik.handleChange("phoneNumber")}
                onBlur={formik.handleBlur("phoneNumber")}
                value={formik.values.phoneNumber}
                error={
                  formik.submitCount > 0 &&
                  formik.touched.phoneNumber &&
                  formik.errors.phoneNumber
                    ? formik.errors.phoneNumber
                    : null
                }
              />
            </div>
            <div className="space-y-2">
              <label className="text-base" htmlFor="gender">
                Gender:
              </label>
              <select
                className="mb-3"
                onChange={formik.handleChange("gender")}
                onBlur={formik.handleBlur("gender")}
                value={formik.values.gender}
              >
                <option value="Nam">Nam</option>
                <option value="Nữ">Nữ</option>
                <option value="Khác">Khác</option>
              </select>
              {formik.submitCount > 0 &&
              formik.touched.gender &&
              formik.errors.gender ? (
                <div>{formik.errors.gender}</div>
              ) : null}
            </div>
          </form>
        </Content>
        <Button
          onClick={handleOk}
          loading={loading}
          className="ml-auto w-full custom-button"
          type="primary"
        >
          Lưu
        </Button>
      </Card>
    </div>
  );
}
