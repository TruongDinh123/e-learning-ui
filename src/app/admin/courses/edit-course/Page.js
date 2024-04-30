"use client";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  editCourse,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Radio, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

const CourseSchema = yup.object({
  title: yup.string().min(2).required("Input the title"),
  name: yup.string().min(2).required("Input the organizer"),
});

export default function EditCourses(props) {
  const { id, refresh, course, categoryId, fetchCategories } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const categories = useSelector(
    (state) => state.category?.categories?.metadata
  );

  useEffect(() => {
    setData(course);
    setCurrentCategory(
      categories &&
        categories.find((category) => category?._id === course?.category)
    );
  }, [course, categories]);

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

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    enableReinitialize: true,
    initialValues: {
      title: data?.title,
      name: data?.name,
      nameCenter: data?.nameCenter,
      isPublic: data?.showCourse,
      categoryId: currentCategory?._id || categoryId,
    },
    onSubmit: (values) => {
      setIsLoading(true);
      dispatch(editCourse({ id: props?.id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            return dispatch(uploadImageCourse({ courseId: id, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  fetchCategories();
                  refresh();
                  setIsLoading(false);
                }
                fetchCategories();
                refresh();
                setIsLoading(false);
                window.location.reload();
                return res;
              });
          }
          fetchCategories();
          refresh();
          setIsLoading(false);
          return res;
        })
        .then((res) => {
          if (values.isPublic) {
            fetchCategories();
            refresh();
            setIsLoading(false);
            return dispatch(buttonPublicCourse(id));
          } else {
            fetchCategories();
            refresh();
            setIsLoading(false);
            return dispatch(buttonPriavteourse(id));
          }
        })
        .then(() => {
          fetchCategories();
          refresh();
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
          message.error(error.response?.data?.message, 3.5);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3 custom-button"
        style={{ width: "100%" }}
        loading={isLoading}
      >
        Update content
      </Button>
      <Modal
        title={
          <h1 className="text-3xl font-bold text-blue-500">
            Update the contest
          </h1>
        }
        width={1000}
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        footer={[
          <Button
            key="cancel"
            onClick={handleCancel}
            style={{ marginRight: 8 }}
          >
            Cancel
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="custom-button"
          >
            Save
          </Button>,
        ]}
      >
        <div className="mt-10">
          <label htmlFor="course" className="fs-6 font-medium">
            Contest title:
          </label>
          <CustomInput
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor="nameCenter" className="fs-6 font-medium">
            Organizer:
          </label>
          <CustomInput
            onChange={formik.handleChange("nameCenter")}
            onBlur={formik.handleBlur("nameCenter")}
            value={formik.values.nameCenter}
          />

          <label
            htmlFor="courseDescription"
            className="text-lg font-medium mt-3"
          >
            Description and Regulation:
          </label>
          <ReactQuill
            theme="snow"
            value={formik.values.title}
            onChange={(content) => formik.setFieldValue("title", content)}
            onBlur={() => formik.setFieldTouched("title", true, true)}
            placeholder="Thêm mô tả"
            className="bg-white"
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                ["blockquote", "code-block"],

                [{ list: "ordered" }, { list: "bullet" }],
                [{ script: "sub" }, { script: "super" }],
                [{ indent: "-1" }, { indent: "+1" }],
                [{ direction: "rtl" }],

                [
                  {
                    size: ["small", false, "large", "huge"],
                  },
                ],
                [{ header: [1, 2, 3, 4, 5, 6, false] }],

                [{ color: [] }, { background: [] }],
                [{ font: [] }],
                [{ align: [] }],

                ["clean"],
              ],
            }}
          />
        </div>

        <div>
          <label htmlFor="course" className="fs-6 font-medium mt-3 mr-3">
            Banner images:
          </label>

          <Upload {...propsUdateImage}>
            <Button className="mt-3" icon={<UploadOutlined />}>
              Choose image
            </Button>
          </Upload>
        </div>
      </Modal>
    </React.Fragment>
  );
}
