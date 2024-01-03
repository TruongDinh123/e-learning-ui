"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import Link from "next/link";
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
    .email("Email should be Valid")
    .required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
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

                localStorage.setItem("user", JSON.stringify(res));
                localStorage.setItem(
                  "userName",
                  JSON.stringify(res.metadata.account.lastName)
                );

                localStorage.setItem(
                  "authorization",
                  res.metadata.tokens.accessToken
                );

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
          "url(https://images.unsplash.com/photo-1552581234-26160f608093?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D;auto=format&amp;fit=crop&amp;w=1951&amp;q=80)",
      }}
    >
      <div class="absolute bg-gradient-to-b from-yellow-50 opacity-80 inset-0 z-0"></div>
      {contextHolder}
      <div
        style={{ minHeight: "100vh" }}
        className="sm:flex sm:flex-row mx-0 justify-center"
      >
        <div class="flex-col flex self-center p-10 sm:max-w-5xl xl:max-w-2xl z-10">
          <div class="self-start hidden lg:flex flex-col  text-white">
            <img src="" class="mb-3" />
            <h1 class="mb-3 font-bold text-5xl text-blue-500">
              Xin chào ? Chào mừng bạn trở lại với 95E-Learning{" "}
            </h1>
            {/* <p class="pr-3 text-black text-xl">
              Ăn tranh thủ, ngủ khẩn trương. Học hết sức, chơi hết mình.
            </p> */}
          </div>
        </div>
        <div className="flex justify-center self-center z-20 relative">
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="p-12 bg-white mx-auto rounded-2xl w-100 z-20 relative"
          >
            <div class="mb-4">
              <h3 class="font-semibold text-2xl text-gray-800">Đăng nhập </h3>
              <p class="text-gray-500">Xin hãy đăng nhập tài khoản của bạn.</p>
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
              <Spin spinning={isLoading}>
                <CustomButton
                  title="Đăng nhập"
                  type="primary"
                  className="w-full flex justify-center bg-blue-400 hover:bg-blue-500 text-gray-100 p-3 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
                  onClick={() => formik.handleSubmit()}
                  disabled={isLoading}
                />
              </Spin>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
