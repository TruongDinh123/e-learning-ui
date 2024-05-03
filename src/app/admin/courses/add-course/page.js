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
import React, { useState } from "react";
import { PlusOutlined, UploadOutlined } from "@ant-design/icons";
import CustomButton from "@/components/comman/CustomBtn";
import { isAdmin } from "@/middleware";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

const CourseSchema = yup.object({
  title: yup
    .string()
    .required("Input the title")
    .trim("Title must not start or end with whitespace"),
  name: yup
    .string()
    .required("Input the organizer")
    .trim("Name must not start or end with whitespace")
});

export default function AddCourse(props) {
  const { refresh, fetchCategories } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [logoOrg, setLogoOrg] = useState(null);
  const dispatch = useDispatch();


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

  const handleOrganizerUpload = {
    onRemove: () => {
      setLogoOrg(null);
      formik.setFieldValue("filename", ""); // reset filename when file is removed
    },
    beforeUpload: (logo) => {
      setLogoOrg(logo);
      formik.setFieldValue("filename", logo.name); // set filename when a new file is uploaded
      return false;
    },
    fileList: logoOrg ? [logoOrg] : [],
  };

  const handleBannerUpload = {
    onRemove: () => {
      setFile(null);
      formik.setFieldValue("banner-contest", "");
    },
    beforeUpload: (banner) => {
      setFile(banner);
      formik.setFieldValue("banner-contest", banner.name);
      return false;
    },
    fileList: file ? [file] : [],

  };

  const formik = useFormik({
    validationSchema: CourseSchema,
    initialValues: {
      title: "",
      name: "",
      nameCenter: "",
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
            dispatch(uploadImageCourse({ courseId: courseId, filename: logoOrg, bannerURL: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  const imageUrl = res.metadata?.findCourse?.image_url;
                  dispatch(updateCourseImage({ courseId, imageUrl }));
                  refresh();
                  setFile(null);
                  setIsLoading(false);
                  setIsModalOpen(false);
                  formik.resetForm();
                }
              })
              .catch((error) => {
                setIsLoading(false);
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
              <span className="ml-1">Add Contest</span>
            </div>
          }
          onClick={showModal}
          className={`py-2 px-3 bg-blue-900 hover:bg-blue-400 text-white text-center inline-block text-sm my-1 mx-1 rounded-lg cursor-pointer border-none`}
        ></CustomButton>
      )}
      <Modal
        title={
          <h1 className="text-2xl font-bold text-blue-500">Create contest</h1>
        }
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        width={1000}
        footer={
          <div>
            <Button key="cancel" onClick={handleCancel}>
              Cancel
            </Button>
            <Button
              key="save"
              type="primary"
              className="custom-button"
              onClick={handleOk}
              loading={isLoading}
            >
              Save
            </Button>
          </div>
        }
      >
        <div className="mt-10">
          <label htmlFor="course" className="text-lg font-medium">
            Contest title:
          </label>
          <CustomInput
            id="course"
            placeholder="Input the title"
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

          <label htmlFor="nameCenter" className="text-lg font-medium">
            Organizer:
          </label>
          <CustomInput
            id="nameCenter"
            placeholder="Input the organizer"
            onChange={formik.handleChange("nameCenter")}
            onBlur={formik.handleBlur("nameCenter")}
            value={formik.values.nameCenter}
          />
          <div>
            <label htmlFor="banner-img" className="text-lg font-medium mt-3 mr-3">
              Banner contest image:
            </label>
            <Upload {...handleBannerUpload}>
              <Button className="mt-3" icon={<UploadOutlined />}>
                Choose banner
              </Button>
            </Upload>
          </div>

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
            placeholder="Add description and regulation"
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
          {formik.submitCount > 0 && formik.touched.title && formik.errors.title
            ? formik.errors.title
            : null}
        </div>

        <div>
          <label htmlFor="course" className="text-lg font-medium mt-3 mr-3">
            Organizer logo:
          </label>
          <Upload {...handleOrganizerUpload}>
            <Button className="mt-3" icon={<UploadOutlined />}>
              Choose logo
            </Button>
          </Upload>
        </div>
      </Modal>
    </React.Fragment>
  );
}
