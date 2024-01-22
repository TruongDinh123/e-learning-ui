"use client";

import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import { forgotPassword } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, message } from "antd";
import { useFormik } from "formik";
import { useRouter } from "next/navigation";
import { AiOutlineMail } from "react-icons/ai";
import { useDispatch } from "react-redux";
import * as yup from "yup";

const emailSchema = yup.object({
  email: yup
    .string()
    .email("Email không hợp lệ")
    .required("Email không được để trống"),
});
export default function ForgotPassword({ onResetForm }) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    formik.submitForm();
  };

  const formik = useFormik({
    validationSchema: emailSchema,
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      values.email = values.email.trim();
      dispatch(forgotPassword(values))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi.open({
              type: "success",
              content: "Mật khẩu mới đã được gửi về Email của bạn",
              duration: 5,
            });
            setTimeout(() => {
              onResetForm();
            }, 5000);
          }
        })
        .catch((err) => {
          message.error(err.response?.data?.message, 3.5);
        });
    },
  });
  return (
    <div>
      {contextHolder}
      <h2 className="text-2xl font-semibold mb-6">Quên mật khẩu</h2>
      <p className="text-sm mb-4">
        Nhập địa chỉ email của bạn để lấy lại mật khẩu.
      </p>
      <form action="">
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
        </div>
        <div className="flex flex-col space-y-4">
          <Button
            title="Gửi"
            type="primary"
            className="w-full custom-button text-white"
            onClick={handleOk}
          >
            Gửi
          </Button>
        </div>
      </form>
    </div>
  );
}
