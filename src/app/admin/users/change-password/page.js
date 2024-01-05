"use client";
import { Button, Spin, message } from "antd";
import * as yup from "yup";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import { changePassword, logOut, resetState } from "@/features/User/userSlice";
import { useRouter } from "next/navigation";
import CustomInput from "@/components/comman/CustomInput";
import Cookies from "js-cookie";
import { useState } from "react";
import "../../users/change-password/page.css";
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

export default function ChangePassword() {
  const [messageApi, contextHolder] = message.useMessage();
  const [passwordValue, setPasswordValue] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const dispatch = useDispatch();

  const handleOk = async () => {
    setLoading(true);
    await formik.submitForm();
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
                      setLoading(false);
                      message.error(res.message, 2.5);
                    }
                  })
                  .catch((error) => {
                    setLoading(false);
                    console.log(error);
                  })
                  .finally(() => {
                    setLoading(false);
                  });
              });
          } else {
            setLoading(false);
            message.error(res.message, 3.5);
          }
        })
        .catch((error) => {
          setLoading(false);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });
  return (
    <div class="bg-gray-100 flex items-center justify-center h-screen grid-container">
      {contextHolder}
      {loading ? (
        <Spin size="large" />
      ) : (
        <div class="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
          <div class="flex items-center space-x-2 mb-6">
            <img
              src="https://unsplash.it/40/40?image=883"
              alt="Lock Icon"
              class="rounded-full"
            />
            <h1 class="text-xl font-semibold">Đổi mật khẩu</h1>
          </div>
          <p class="text-sm text-gray-600 mb-6">
            Cập nhật mật khẩu để tăng cường bảo mật tài khoản.
          </p>
          <form id="changePasswordForm" class="space-y-6">
            <div>
              <label
                for="currentPassword"
                class="text-sm font-medium text-gray-700 block mb-2"
              >
                Mật khẩu hiện tại <span className="text-danger">*</span>
              </label>
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
            <div>
              <label
                for="newPassword"
                class="text-sm font-medium text-gray-700 block mb-2"
              >
                Mật khẩu mới <span className="text-danger">*</span>
              </label>
              <CustomInput
                className="mb-3"
                placeholder="Nhập mật khẩu mới.."
                onBlur={formik.handleBlur("newPassword")}
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
                  formik.handleChange("newPassword")(e);
                  setPasswordValue(e.target.value);
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
            <div class="flex justify-between">
              {/* <button
              type="button"
              onclick="discardChanges()"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring focus:border-blue-300"
            >
              Discard
            </button> */}
              <Button
                onClick={handleOk}
                className="px-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:border-blue-300"
              >
                Lưu
              </Button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
