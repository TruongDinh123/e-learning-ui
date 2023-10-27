"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import Link from "next/link";
import { AiOutlineMail } from "react-icons/ai";
import { RiLockPasswordLine } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { registerUser } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { message } from "antd";
import { useRouter } from "next/navigation";

const registerSchema = yup.object({
  lastName: yup.string().required("Last name is required"),
  email: yup
    .string()
    .email("Email should be Valid")
    .required("Email is required"),
  password: yup.string().min(6).required("Password is required"),
});

export default function SignUp() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const formik = useFormik({
    validationSchema: registerSchema,
    initialValues: {
      lastName: "",
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      dispatch(registerUser(values))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Register successfully...",
              duration: 2.5,
            })
            .then(() => message.info("Redirecting to login page...", 2.5))
            .then(() => {
              router.push("/login");
            });
        });
    },
  });
  return (
    <div className="container-fluid bg-white">
      {contextHolder}
      <div className="row py-5">
        <div className="col-4 mx-auto py-5">
          <form
            action=""
            onSubmit={formik.handleSubmit}
            className="form-wrapper p-4"
          >
            <CustomInput
              prefix={<AiOutlineMail />}
              placeholder="Last name"
              onChange={formik.handleChange("lastName")}
              onBlur={formik.handleBlur("lastName")}
              value={formik.values.lastName}
              error={formik.touched.lastName && formik.errors.lastName}
              className="mb-3"
            />
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
              placeholder="Password"
              className="mt-3"
              onChange={formik.handleChange("password")}
              onBlur={formik.handleBlur("password")}
              value={formik.values.password}
              error={formik.touched.password && formik.errors.password}
            />
            <Link
              href="/login"
              className="text-dark text-decoration-none my-3 text-end"
            >
              Login
            </Link>
            <CustomButton
              title="register"
              type="primary"
              className="w-100 d-block mb-3"
              onClick={() => formik.handleSubmit()}
            />
          </form>
        </div>
      </div>
    </div>
  );
}
