"use client";
import CustomInput from "@/components/comman/CustomInput";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { Button, Modal, Radio, message } from "antd";
import { useRouter } from "next/navigation";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  createCourse,
} from "@/features/Courses/courseSlice";
import { useState } from "react";

const CourseSchema = yup.object({
  title: yup
    .string()
    .required("Nhập tiêu đề")
    .trim("Title must not start or end with whitespace"),
  name: yup
    .string()
    .required("Nhập tên")
    .trim("Name must not start or end with whitespace"),
  isPublic: yup.boolean().required("Visibility is required"),
});

export default function AddCourse(props) {
  const { refresh } = props;
  const router = useRouter();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin =
    user &&
    user.metadata.account &&
    user.metadata.account.roles.includes("Admin");

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    formik.submitForm();
    if (formik.isValid && !formik.isSubmitting && formik.submitCount > 0) {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    initialValues: {
      title: "",
      name: "",
      isPublic: true,
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      values.title = values.title.trim();
      setIsLoading(true);

      dispatch(createCourse(values))
        .then(unwrapResult)
        .then((res) => {
          const courseId = res.metadata?._id;
          if (res.status) {
            if (values.isPublic) {
              dispatch(buttonPublicCourse(courseId));
              refresh();
            } else {
              dispatch(buttonPriavteourse(courseId));
              refresh();
            }
            messageApi
              .open({
                type: "success",
                content: "Action in progress...",
                duration: 2.5,
              })
              .then(() => message.success(res.message, 2.5), refresh())
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
      {isAdmin && (
        <Button
          type="primary"
          onClick={showModal}
          className="me-3"
          style={{
            color: "#fff",
            backgroundColor: "#1890ff",
          }}
        >
          Tạo khóa học
        </Button>
      )}
      <Modal
        title="Tạo khóa học"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={
          <div>
            <Button
              key="back"
              type="primary"
              onClick={handleOk}
              style={{
                color: "#fff",
                backgroundColor: "#1890ff",
              }}
              loading={isLoading}
            >
              Save
            </Button>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </div>
        }
      >
        <div className="col-md-6 col-sm-12">
          <form action="" className="pb-5">
            <div className="mt-3 w-auto">
              <label htmlFor="course" className="fs-6 fw-bold">
                Tên khóa học
              </label>
              <CustomInput
                id="course"
                placeholder="Thêm tên"
                onChange={formik.handleChange("name")}
                onBlur={formik.handleBlur("name")}
                value={formik.values.name}
                error={
                  formik.submitCount > 0 &&
                  formik.touched.name &&
                  formik.errors.name
                    ? formik.errors.name
                    : null
                }
              />
            </div>
            <div className="mt-3 w-auto">
              <label htmlFor="course" className="fs-6 fw-bold">
                Mô tả khóa học
              </label>
              <textarea
                id="course"
                placeholder="Thêm mô tả"
                onChange={formik.handleChange("title")}
                onBlur={formik.handleBlur("title")}
                value={formik.values.title}
                className="form-control"
              />
              {formik.submitCount > 0 &&
              formik.touched.title &&
              formik.errors.title
                ? formik.errors.title
                : null}
            </div>

            <div className="mt-3">
              <label htmlFor="visibility" className="fs-6 fw-bold">
                Tùy chọn:
              </label>
              <Radio.Group
                id="visibility"
                onChange={(e) =>
                  formik.setFieldValue("isPublic", e.target.value)
                }
                onBlur={formik.handleBlur("isPublic")}
                value={formik.values.isPublic}
              >
                <Radio value={true}>Public</Radio>
                <Radio value={false}>Private</Radio>
              </Radio.Group>
            </div>
          </form>
        </div>
      </Modal>
    </div>
  );
}
