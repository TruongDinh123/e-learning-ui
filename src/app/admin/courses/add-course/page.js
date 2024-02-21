"use client";
import CustomInput from "@/components/comman/CustomInput";
import { useDispatch, useSelector } from "react-redux";
import { useFormik } from "formik";
import { unwrapResult } from "@reduxjs/toolkit";
import * as yup from "yup";
import { Button, Modal, Radio, Upload, message } from "antd";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  createCourse,
  updateCourseImage,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import React, { useEffect, useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import CustomButton from "@/components/comman/CustomBtn";
import { getAllCategoryAndSubCourses } from "@/features/categories/categorySlice";
import { isAdmin } from "@/middleware";

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
  categoryId: yup.string().required("Chọn danh mục tương ứng"),
});

export default function AddCourse(props) {
  const { refresh, fetchCategories } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const dispatch = useDispatch();


  useEffect(() => {
    dispatch(getAllCategoryAndSubCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  }, []);

  const categories = useSelector(
    (state) => state.category?.categories?.metadata
  );

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
      categoryId: "" || (categories && categories[0]?._id),
      isPublic: true,
    },
    onSubmit: (values) => {
      values.name = values.name.trim();
      values.title = values.title.trim();
      values.categoryId = values.categoryId.trim();
      setIsLoading(true);

      dispatch(createCourse(values))
        .then(unwrapResult)
        .then((res) => {
          const courseId = res.metadata?._id;
          if (file) {
            dispatch(uploadImageCourse({ courseId: courseId, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                console.log("res", res);
                if (res.status) {
                  const imageUrl = res.metadata?.findCourse?.image_url;
                  console.log("imageUrl", imageUrl);
                  dispatch(updateCourseImage({ courseId, imageUrl }));

                  if (values.isPublic) {
                    fetchCategories();
                    refresh();
                    dispatch(buttonPublicCourse(courseId));
                  } else {
                    fetchCategories();
                    refresh();
                    dispatch(buttonPriavteourse(courseId));
                  }
                  refresh();
                  setFile(null);
                  setIsLoading(false);
                  messageApi
                    .open({
                      type: "Thành công",
                      content: "Đang thực hiện...",
                      duration: 2.5,
                    })
                    .then((res) => {
                      message.success(res.message, 0.5);
                      fetchCategories();
                      setIsLoading(false);
                      setIsModalOpen(false);
                      refresh();
                      formik.resetForm();
                    })
                    .catch((error) => {
                      setIsLoading(false);
                      message.error(error.response?.data?.message, 3.5);
                    });
                }
              })
              .catch((error) => {
                setIsLoading(false);
              });
          } else {
            if (values.isPublic) {
              fetchCategories();
              refresh();
              dispatch(buttonPublicCourse(courseId));
            } else {
              fetchCategories();
              refresh();
              dispatch(buttonPriavteourse(courseId));
            }
            fetchCategories();
            refresh();
            setIsLoading(false);
            messageApi
              .open({
                type: "Thành công",
                content: "Đang thực hiện...",
                duration: 2.5,
              })
              .then((res) => {
                message.success(res.message, 0.5);
                fetchCategories();
                setIsLoading(false);
                setIsModalOpen(false);
                refresh();
                formik.resetForm();
              })
              .catch((error) => {
                setIsLoading(false);
                message.error(error.response?.data?.message, 3.5);
              });
          }
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      {isAdmin() && (
        <CustomButton
          type="primary"
          title={
            <div className="flex items-center justify-center">
              <PlusOutlined />
              <span className="ml-1">Tạo khóa học</span>
            </div>
          }
          onClick={showModal}
          className={`py-2 px-3 bg-blue-900 hover:bg-blue-400 text-white text-center inline-block text-sm my-1 mx-1 rounded-lg cursor-pointer border-none`}
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
              className="custom-button"
              onClick={handleOk}
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

          <label htmlFor="category" className="text-lg font-medium mt-3">
            Danh mục:
          </label>
          <select
            id="category"
            onChange={formik.handleChange("categoryId")}
            onBlur={formik.handleBlur("categoryId")}
            value={formik.values.categoryId}
            className="mx-2"
          >
            {categories &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
          {formik.submitCount > 0 &&
          formik.touched.categoryId &&
          formik.errors.categoryId
            ? formik.errors.categoryId
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
