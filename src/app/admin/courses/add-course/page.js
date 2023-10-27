"use client";
import CustomButton from "@/components/comman/CustomBtn";
import CustomInput from "@/components/comman/CustomInput";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { createCourse } from "@/features/Courses/courseSlice";

const CourseSchema = yup.object({
  title: yup.string().min(6).required("Title is required"),
  name: yup.string().min(6).required("name is required"),
});

export default function AddCourse() {
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

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
    <main className="bg-white p-4 rounded-3">
      {contextHolder}
      <h4>Add Course</h4>
      <div className="row">
        <div className="col-3">
          <form action="" className="pb-5">
            <div className="mt-3">
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
            <CustomButton
              type="primary"
              className="mt-5"
              title="Add Course"
              onClick={() => formik.handleSubmit()}
            />
          </form>
        </div>
      </div>
    </main>
  );
}
