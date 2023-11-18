"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { Button, Modal, message } from "antd";
import { useRouter } from "next/navigation";
import { createCourse } from "@/features/Courses/courseSlice";
import { useState } from "react";

const CourseSchema = yup.object({
  title: yup.string().min(6).required("Title is required"),
  name: yup.string().min(6).required("name is required"),
});

export default function AddCourse() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const dispatch = useDispatch();

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const handleCancel = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    initialValues: {
      title: "",
      name: "",
    },
    onSubmit: (values) => {
      dispatch(createCourse(values))
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
              .then(() => {
                router.push("/admin/courses/view-courses");
              });
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });
  return (
    <div>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{
          color: "#fff",
          backgroundColor: "#1890ff",
        }}
      >
        Create
      </Button>
      <Modal
        title="Create lesson"
        open={isModalOpen}
        width={50 + "%"}
        height={50 + "%"}
        footer={
          <>
            <Button
              key="back"
              type="primary"
              onClick={handleOk}
              style={{
                color: "#fff",
                backgroundColor: "#1890ff",
              }}
            >
              Save
            </Button>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        }
      >
        <div className="row">
          <div className="col-lg-3 col-md-6 col-sm-12">
            <form action="" className="pb-5">
              <div className="mt-3 w-auto">
                <label htmlFor="course" className="fs-6 fw-bold">
                  Course Title
                </label>
                <CustomInput
                  id="course"
                  placeholder="Add course title"
                  onChange={formik.handleChange("title")}
                  onBlur={formik.handleBlur("title")}
                  value={formik.values.title}
                  error={formik.touched.title && formik.errors.title}
                />
              </div>
              <div className="mt-3">
                <label htmlFor="course" className="fs-6 fw-bold">
                  Course Name
                </label>
                <CustomInput
                  id="course"
                  placeholder="Add course name"
                  onChange={formik.handleChange("name")}
                  onBlur={formik.handleBlur("name")}
                  value={formik.values.name}
                  error={formik.touched.name && formik.errors.name}
                />
              </div>
            </form>
          </div>
        </div>
      </Modal>
    </div>
  );
}
