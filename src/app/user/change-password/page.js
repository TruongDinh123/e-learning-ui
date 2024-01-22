"use client";
import React, { Fragment, useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Button, Spin, message } from "antd";
import {
  changePassword,
  getAUser,
  logOut,
  resetState,
  updateUser,
} from "@/features/User/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import CustomInput from "@/components/comman/CustomInput";
import { useRouter } from "next/navigation";
import { RiLockPasswordLine } from "react-icons/ri";
import { BsEye, BsEyeSlash } from "react-icons/bs";

const passwordSchema = yup.object({
  oldPassword: yup
    .string()
    .required("Yêu cầu nhập mật khẩu.")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Mật khẩu phải có cả chữ và số"
    ),

  newPassword: yup
    .string()
    .required("Yêu cầu nhập mật khẩu.")
    .min(8, "Mật khẩu phải có ít nhất 8 kí tự.")
    .matches(
      /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/,
      "Mật khẩu phải có cả chữ và số"
    ),
});
export default function ChangePasswordForm() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [loading, setLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const router = useRouter();

  const handleOk = () => {
    try {
      setLoading(true);
      formik.submitForm();
    } finally {
      setLoading(false);
    }
  };

  const formik = useFormik({
    validationSchema: passwordSchema,
    enableReinitialize: true,
    initialValues: {
      oldPassword: "",
      newPassword: "",
    },
    onSubmit: (values) => {
      values.oldPassword = values.oldPassword.trim();
      values.newPassword = values.newPassword.trim();

      dispatch(changePassword(values))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "Thành công",
                content: "Đang thực hiện...",
              })
              .then(() => {
                dispatch(logOut())
                  .then(unwrapResult)
                  .then((res) => {
                    if (res.status) {
                      localStorage.clear();
                      Cookies.remove("Bearer");
                      dispatch(resetState());
                      router.push("/login");
                    } else {
                      message.error(res.message, 2.5);
                    }
                  })
                  .catch((error) => {
                    message.error(
                      error.response?.data?.message || "Có lỗi xảy ra",
                      3.5
                    );
                  })
                  .finally(() => {
                    setLoading(false);
                  });
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
    <Fragment>
      {contextHolder}
      <div className="row p-5">
        <div className="col-lg-12 pb-28">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Cập nhật mật khẩu</h4>
            </div>
            <div className="card-body">
              <div className="form-validation">
                <form className="form-valide" action="#" method="post">
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="form-group mb-3 row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="val-username"
                        >
                          Mật khẩu hiện tại:
                          <span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-6">
                          <CustomInput
                            className="mb-3"
                            placeholder="Nhập mật khẩu hiện tại.."
                            onBlur={formik.handleBlur("oldPassword")}
                            prefix={<RiLockPasswordLine />}
                            suffix={
                              showPassword ? (
                                <BsEyeSlash
                                  onClick={() => setShowPassword(false)}
                                  style={{ cursor: "pointer" }}
                                />
                              ) : (
                                <BsEye
                                  onClick={() => setShowPassword(true)}
                                  style={{ cursor: "pointer" }}
                                />
                              )
                            }
                            onChange={(e) => {
                              formik.handleChange("oldPassword")(e);
                              setPasswordValue(e.target.value);
                            }}
                            value={formik.values.oldPassword}
                            type={showPassword ? "text" : "password"}
                            error={
                              formik.submitCount > 0 &&
                              formik.touched.oldPassword &&
                              formik.errors.oldPassword
                                ? formik.errors.oldPassword
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="val-email"
                        >
                          Mật khẩu mới:<span className="text-danger">*</span>
                        </label>
                        <div className="col-lg-6">
                          <CustomInput
                            className="mb-3"
                            placeholder="Nhập mật khẩu mới.."
                            onBlur={formik.handleBlur("newPassword")}
                            prefix={<RiLockPasswordLine />}
                            suffix={
                              showNewPassword ? (
                                <BsEyeSlash
                                  onClick={() => setShowNewPassword(false)}
                                  style={{ cursor: "pointer" }}
                                />
                              ) : (
                                <BsEye
                                  onClick={() => setShowNewPassword(true)}
                                  style={{ cursor: "pointer" }}
                                />
                              )
                            }
                            onChange={(e) => {
                              formik.handleChange("newPassword")(e);
                              setShowNewPassword(e.target.value);
                            }}
                            value={formik.values.newPassword}
                            type={showPassword ? "text" : "password"}
                            error={
                              formik.submitCount > 0 &&
                              formik.touched.newPassword &&
                              formik.errors.newPassword
                                ? formik.errors.newPassword
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 row">
                        <div className="col-lg-8 ms-auto">
                          <Button
                            type="primary"
                            onClick={handleOk}
                            loading={loading}
                            className="custom-button"
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
