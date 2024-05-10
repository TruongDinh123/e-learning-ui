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
import ForgotPassword from "../user/forgot-password/page";
import Link from "next/link";

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
  const [isForgotPass, setIsForgotPass] = useState(false);

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
            const roleNames = res.metadata.account.roles.map(
              (role) => role.name
            );

            Cookies.set("Bearer", res?.metadata.tokens.accessToken);
            Cookies.set("refreshToken", res?.metadata.tokens.refreshToken);

            localStorage.setItem(
                "user",
                JSON.stringify(res.metadata.account)
            );
            const userName =
                (res.metadata.account?.firstName
                    ? res.metadata.account?.firstName + " "
                    : "") +
                (res.metadata.account?.lastName
                    ? res.metadata.account?.lastName
                    : "");
            localStorage.setItem("userName", JSON.stringify(userName));

            localStorage.setItem("x-client-id", res.metadata.account._id);
            if (
                roleNames.includes("Admin") ||
                roleNames.includes("Super-Admin") ||
                roleNames.includes("Mentor")
            ) {
              router.push("/admin/courses");
            } else {
              router.push("/");
            }
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

  const handleResetForm = () => {
    setIsForgotPass(false);
  };

  return (
    <div
      className="min-h-screen relative bg-no-repeat bg-cover bg-center
      flex items-center justify-center"
      style={{
        backgroundImage:
          "url(https://images.pexels.com/photos/5905445/pexels-photo-5905445.jpeg)",
      }}
    >
      {contextHolder}
      <div className="flex flex-col md:flex-row items-center justify-center w-full max-w-5xl">
        <div className="md:w-1/2 text-center md:text-left p-8">
          <h1 className="text-4xl font-bold mb-4">
            <Link href="/">
              <p className="hover:no-underline hover:text-[#007bff]">
                247learn.vn
              </p>
            </Link>
          </h1>
        </div>
        <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm md:max-w-md">
          {isForgotPass ? (
            <>
              <ForgotPassword onResetForm={handleResetForm} />
              <div className="flex items-center justify-between mt-4">
                <a
                  href="#"
                  className="text-xs text-blue-600 hover:underline hover:text-blue-800"
                  onClick={() => setIsForgotPass(false)}
                >
                  Đăng nhập
                </a>
              </div>
            </>
          ) : (
            <>
              <h2 className="text-2xl font-semibold mb-6">Đăng nhập</h2>
              <p className="text-sm mb-4">
                Xin hãy đăng nhập tài khoản của bạn.
              </p>
              <form action="" onSubmit={formik.handleSubmit}>
                <div className="flex flex-col space-y-4 mb-6">
                  <label className="flex flex-col" htmlFor="email">
                    <span className="text-sm font-medium">Email</span>
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
                  </label>
                  <label className="flex flex-col" htmlFor="password">
                    <span className="text-sm font-medium">Mật khẩu</span>
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
                  </label>
                </div>

                <CustomButton
                  title={isLoading ? <Spin /> : "Đăng nhập"}
                  type="primary"
                  disabled={isLoading}
                  onClick={() => formik.handleSubmit()}
                  className="py-1 px-8 bg-blue-900 hover:bg-blue-400 text-white text-center inline-block text-lg my-1 mx-1 rounded-lg cursor-pointer border-none w-full"
                />
                <div className="flex items-center justify-between mt-4">
                  <a
                    href="#"
                    className="text-xs text-blue-800  hover:text-blue-800"
                    onClick={() => setIsForgotPass(true)}
                  >
                    Quên mật khẩu
                  </a>

                  <a
                      href="/signup"
                      className="text-xs text-blue-800  hover:text-blue-800"
                  >
                    <b>Đăng ký tài khoản</b>
                  </a>
                </div>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
