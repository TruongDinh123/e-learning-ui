"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { login } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { Spin, message } from "antd";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { useState } from "react";

const loginSchema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Yêu cầu nhập email"),
  password: yup
    .string()
    .min(6, "Password phải có ít nhất 6 kí tự")
    .required("Yêu cầu nhập mật khẩu"),
});

export default function Login() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");
  const formik = useFormik({
    validationSchema: loginSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      setIsLoading(true);
      dispatch(login(values))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "Thành công",
                icon: <Spin />,
              })
              .then(() =>
                message.info(
                  `Redirecting to ${
                    res.metadata.account.roles.includes("Trainee")
                      ? "Home"
                      : "Dashboard"
                  } `,
                  0.5
                )
              )
              .then(() => {
                Cookies.set("Bearer", res?.metadata.tokens.accessToken);

                localStorage.setItem(
                  "user",
                  JSON.stringify(res.metadata.account)
                );
                localStorage.setItem(
                  "userName",
                  JSON.stringify(res.metadata.account.lastName)
                );

                // localStorage.setItem(
                //   "authorization",
                //   res.metadata.tokens.accessToken
                // );

                localStorage.setItem("x-client-id", res.metadata.account._id);
                if (
                  res.metadata.account.roles.includes("Admin") ||
                  res.metadata.account.roles.includes("Mentor")
                ) {
                  router.push("/admin/courses");
                } else {
                  router.push("/");
                }
              });
          } else {
            message.error(res.message, 2.5);
          }
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
        })
        .finally(() => {
          setIsLoading(false);
        });
    },
  });

  return (
    <div
      className="bg-no-repeat bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg)",
      }}
    >
      <div className="absolute bg-gradient-to-b from-slate-500 opacity-30 inset-0 z-0"></div>
      {contextHolder}
      <div
        style={{ minHeight: "100vh" }}
        className="sm:flex sm:flex-row mx-0 justify-center"
      >
        <div className="flex flex-col lg:flex-row justify-center items-center p-10 self-center z-20 relative w-full sm:w-full min-h-screen sm:min-h-0">
          <div className="flex flex-col text-white self-center p-5 sm:max-w-5xl xl:max-w-2xl z-10">
            <h1 className="mb-3 font-bold text-5xl sm:text-3xl text-black">
              Chào mừng bạn tới với 247learn.vn{" "}
            </h1>
          </div>
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="p-12 bg-white mx-auto rounded-2xl lg:w-2/4 sm:w-full z-20 relative"
          >
            <div className="mb-2">
              <h3 className="font-semibold text-2xl text-gray-800">Đăng nhập </h3>
              <p className="text-gray-500">Xin hãy đăng nhập tài khoản của bạn.</p>
            </div>
            <div className="space-y-5">
              <CustomInput
                prefix={<AiOutlineMail />}
                placeholder="Địa chỉ email"
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
              <CustomInput
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
                placeholder="Mật khẩu"
                className="mt-3"
                onChange={(e) => {
                  formik.handleChange("password")(e);
                  setPasswordValue(e.target.value);
                }}
                onBlur={formik.handleBlur("password")}
                value={passwordValue}
                error={
                  formik.submitCount > 0 &&
                  formik.touched.password &&
                  formik.errors.password
                    ? formik.errors.password
                    : null
                }
                type={showPassword ? "text" : "password"}
              />
              <div>
                <CustomButton
                  title={isLoading ? <Spin /> : "Đăng nhập"}
                  type="primary"
                  disabled={isLoading}
                  onClick={() => formik.handleSubmit()}
                  className="py-1 px-8 bg-blue-900 hover:bg-blue-400 text-white text-center inline-block text-lg my-1 mx-1 rounded-lg cursor-pointer border-none"
                />
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
