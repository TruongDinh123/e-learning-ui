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
import { message } from "antd";
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
  const [passwordValue, setPasswordValue] = useState("");
  const formik = useFormik({
    validationSchema: loginSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(login(values))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "success",
                content: "Action in progress...",
                duration: 2.5,
              })
              .then(() => message.success(res.message, 2.5))
              .then(() =>
                message.info(
                  `Redirecting to ${
                    res.metadata.account.roles.includes("Trainee")
                      ? "Home"
                      : "Dashboard"
                  } `,
                  2.5
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
          message.error(error.response.data.message, 3.5);
        });
    },
  });

  return (
    <div className="container-fluid bg-white">
      {contextHolder}
      <div className="row py-5">
        <div className="col-lg-4 col-md-6 col-sm-8 mx-auto py-5">
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="form-wrapper p-4"
          >
            <CustomInput
              prefix={<AiOutlineMail />}
              placeholder="Email Address"
              onChange={formik.handleChange("email")}
              onBlur={formik.handleBlur("email")}
              value={formik.values.email}
              error={formik.touched.email && formik.errors.email}
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
              placeholder="Password"
              className="mt-3"
              onChange={(e) => {
                formik.handleChange("password")(e);
                setPasswordValue(e.target.value);
              }}
              onBlur={formik.handleBlur("password")}
              value={passwordValue}
              error={formik.touched.password && formik.errors.password}
              type={showPassword ? "text" : "password"}
            />
            <div className="pt-3 pb-2">
              <Link
                href="#"
                className="text-decoration-none my-3 text-end"
              >
                Forgot Password ?
              </Link>
            </div>
            <CustomButton
              title="login"
              type="primary"
              className="w-100 d-block mb-3"
              onClick={() => formik.handleSubmit()}
            />
            <div className="my-3">
              <Link
                href="/signup"
                className="text-dark text-decoration-none text-center"
              >
                Do you have an Account? <b>Register</b>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}