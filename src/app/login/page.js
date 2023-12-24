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
                content: "Đang thực hiện...",
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
                  "authorization",
                  res.metadata.tokens.accessToken
                );

                localStorage.setItem("x-client-id", res.metadata.account._id);
                res.metadata.account.roles.includes("Trainee")
                  ? router.push("/")
                  : router.push("/admin/dashboard");
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
    <div className="container-fluid bg-white">
      {contextHolder}
      <div className="row py-5">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto py-5">
          <h1 className="text-3xl font-bold p-2">Đăng nhập</h1>
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="form-wrapper p-4 border rounded"
          >
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
            <div className="pt-3 pb-2">
              {/* <Link href="#">
                <span className="text-decoration-none my-3 text-end">
                  Forgot Password ?
                </span>
              </Link> */}
            </div>
            <Spin spinning={isLoading}>
              <CustomButton
                title="Đăng nhập"
                type="primary"
                className="w-100 d-block mb-3"
                style={{ color: "#fff", backgroundColor: "#1890ff" }}
                onClick={() => formik.handleSubmit()}
                disabled={isLoading}
              />
            </Spin>
            {/* <div className="my-3">
              <Link href="/signup">
                <span className="text-dark text-decoration-none text-center">
                  Do you have an Account? <b>Register</b>
                </span>
              </Link>
            </div> */}
          </form>
        </div>
      </div>
    </div>
  );
}
