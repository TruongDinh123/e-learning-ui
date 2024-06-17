"use client";
import { addStudentToCourse, addStudentToCourseSuccess } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";

const EmailSchema = yup.object({
  email: yup.string()
    .email("email phải là một địa chỉ email hợp lệ")
    .required("email là bắt buộc")
    // .matches(/^[a-zA-Z0-9._%+-]+@gmail\.com$/, "email phải là địa chỉ Gmail"),
});

// Tạo một mảng với 101 học viên giả
const mockStudents = Array.from({ length: 101 }, (_, index) => ({
  _id: `student${index + 1}`,
  firstName: `FirstName${index + 1}`,
  lastName: `LastName${index + 1}`,
}));

export default function AddStudentToCourse(props) {
  const { courseId, refresh, dataStudent } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    if (dataStudent && dataStudent.length >= 100) {
      Modal.info({
        title: "Giới hạn số lượng học viên",
        content: "Số lượng học viên của bạn đã vượt quá 100. Vui lòng liên lạc với quản trị viên qua email kimochi2033@gmail.com để nâng cấp dịch vụ.",
        okText: "Đã hiểu",
        okButtonProps: {
          className: "custom-button",
        },
      });
    } else {
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: EmailSchema,
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      dispatch(addStudentToCourse({ courseId: courseId, values }))
        .then(unwrapResult)
        .then((res) => {
          const studentInfo = {
            _id: res.metadata._id,
            firstName: res.metadata.firstName,
            lastName: res.metadata.lastName,
          };
          // Dispatch action để cập nhật thông tin học viên vào store
          dispatch(addStudentToCourseSuccess({ courseId, studentInfo }));
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 0.5,
            })
            .then(() => {
              refresh();
            });
        })
        .catch((error) => {
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button type="primary" onClick={showModal} className="me-3 custom-button">
        Thêm học viên
      </Button>
      <Modal
        title="Thêm email"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="custom-button"
          >
            OK
          </Button>
        }
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Email:
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
            placeholder="Email"
          />
        </div>
      </Modal>
    </React.Fragment>
  );
}
