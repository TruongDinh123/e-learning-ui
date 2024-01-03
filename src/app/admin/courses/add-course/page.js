"use client";
import CustomInput from "@/components/comman/CustomInput";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { Button, Modal, Radio, Upload, message } from "antd";
import { useRouter } from "next/navigation";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  createCourse,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import React, { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import CustomButton from "@/components/comman/CustomBtn";

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
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();

  const user = JSON.parse(localStorage?.getItem("user"));

  const isAdmin = user?.metadata?.account?.roles?.includes("Admin");

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

  const propsUdateImage = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue("filename", ""); // reset filename when file is removed
    },
    beforeUpload: (file) => {
      setFile(file);
      formik.setFieldValue("filename", file.name); // set filename when a new file is uploaded
      return false;
    },
    fileList: file ? [file] : [],
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
          if (file) {
            dispatch(uploadImageCourse({ courseId: courseId, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  if (values.isPublic) {
                    dispatch(buttonPublicCourse(courseId));
                  } else {
                    dispatch(buttonPriavteourse(courseId));
                  }
                  setFile(null);
                  setIsLoading(false);
                  messageApi
                    .open({
                      type: "Thành công",
                      content: "Đang thực hiện...",
                      duration: 2.5,
                    })
                    .then((res) => {
                      router.push("/admin/courses");
                      message.success(res.message, 0.5);
                      refresh();
                      setIsLoading(false);
                    })
                    .catch((error) => {
                      console.log(error);
                      setIsLoading(false);
                      message.error(error.response?.data?.message, 3.5);
                    });
                }
              })
              .catch((error) => {
                console.log(error);
                setIsLoading(false);
              });
          }
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      {isAdmin && (
        <CustomButton
          type="primary"
          title={
            <div className="flex items-center justify-center">
              <PlusOutlined />
              <span className="ml-1">Tạo khóa học</span>
            </div>
          }
          onClick={showModal}
          className="flex justify-center bg-blue-500 hover:bg-blue-400 text-white p-2 rounded-full tracking-wide font-semibold shadow-lg cursor-pointer transition ease-in duration-500"
        ></CustomButton>
      )}
      <Modal
        title={
          <h1 className="text-2xl font-bold text-blue-500">Tạo khóa học</h1>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1000}
        footer={
          <div>
            <Button key="cancel" onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              key="save"
              type="primary"
              onClick={handleOk}
              style={{
                color: "#fff",
                backgroundColor: "#1890ff",
              }}
              loading={isLoading}
            >
              Lưu
            </Button>
          </div>
        }
      >
        <div className="mt-10">
          <label htmlFor="course" className="text-lg font-medium">
            Tên khóa học:
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

          <label htmlFor="course" className="text-lg font-medium mt-3">
            Mô tả khóa học:
          </label>
          <textarea
            id="course"
            placeholder="Thêm mô tả"
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            value={formik.values.title}
            className="form-control"
          />
          {formik.submitCount > 0 && formik.touched.title && formik.errors.title
            ? formik.errors.title
            : null}
        </div>

        <div>
          <label htmlFor="course" className="text-lg font-medium mt-3 mr-3">
            Hình ảnh khóa học:
          </label>
          <Upload {...propsUdateImage}>
            <Button className="mt-3" icon={<UploadOutlined />}>
              Chọn hình ảnh
            </Button>
          </Upload>
        </div>

        <div className="mt-3">
          <label htmlFor="visibility" className="text-lg font-medium pr-2">
            Tùy chọn:
          </label>
          <Radio.Group
            id="visibility"
            onChange={(e) => formik.setFieldValue("isPublic", e.target.value)}
            onBlur={formik.handleBlur("isPublic")}
            value={formik.values.isPublic}
          >
            <Radio value={true}>Public</Radio>
            <Radio value={false}>Private</Radio>
          </Radio.Group>
        </div>
      </Modal>
    </React.Fragment>
  );
}
