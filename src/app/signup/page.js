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
import {BsEye, BsEyeSlash} from "react-icons/bs";
import {useState} from "react";

const registerSchema = yup.object({
  email: yup
      .string()
      .email("Email không hợp lệ")
      .required("Yêu cầu nhập email"),
  password: yup
      .string()
      .min(6, "Password phải có ít nhất 6 kí tự")
      .required("Yêu cầu nhập mật khẩu"),
});

export default function SignUp() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();
  const dispatch = useDispatch();
  const [showPassword, setShowPassword] = useState(false);
  const [passwordValue, setPasswordValue] = useState("");

  const formik = useFormik({
    validationSchema: registerSchema,
    initialValues: {
      email: "",
      password: "",
    },
    onSubmit: (values) => {
      if(values.password && values.email) {
        dispatch(registerUser(values))
        .then(unwrapResult)
        .then((res) => {
          if(res.user){
            messageApi
                .open({
                  type: "Thành công",
                  content: "Đăng ký thành công",
                  duration: 1,
                })
                .then(() => message.info("Di chuyển qua trang đăng nhập", 1))
                .then(() => {
                  router.push("/login");
                });
          } else {
            messageApi
                .open({
                  type: "Thất bại",
                  content: res.message ?? "Có lỗi xảy ra",
                  duration: 2,
                })
          }

        });
      }
      
    },
  });

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
          <h1 className="text-3xl font-bold p-2">Đăng ký tài khoản</h1>
          <form
              action="signup"
              onSubmit={formik.handleSubmit}
              className="p-4  rounded"
          >
            <div className="flex flex-col space-y-4 mb-6">
              <label className="flex flex-col" htmlFor="email">
                <span className="text-sm font-medium">Email</span>
                <CustomInput
                    prefix={<AiOutlineMail />}
                    placeholder="Địa chỉ email"
                    onChange={formik.handleChange("email")}
                    onBlur={formik.handleBlur("email")}
                    value={formik.values.email}
                    error={formik.touched.email && formik.errors.email}
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
                    onBlur={formik.handleBlur("password")}
                    onChange={(e) => {
                      formik.handleChange("password")(e);
                      setPasswordValue(e.target.value);
                    }}
                    value={passwordValue}
                    error={formik.touched.password && formik.errors.password}
                    type={showPassword ? "text" : "password"}
                />
              </label>

            </div>

            <CustomButton
                title="Đăng ký"
                type="primary"
                className="py-1 px-8 bg-blue-900 hover:bg-blue-400 mt-5
                text-white text-center inline-block text-lg
                my-1 mx-1 rounded-lg cursor-pointer border-none w-full"
            />

            <div className="mt-2 mb-2">
              <Link href="/login">
                <span
                    className="text-xs text-blue-800  hover:text-blue-800"
                >
                  Bạn đã có tài khoản? <b>Đăng nhập</b>
                </span>
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
