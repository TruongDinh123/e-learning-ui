"use client";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  editCourse,
  getACourse,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Radio, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { UploadOutlined } from "@ant-design/icons";

const CourseSchema = yup.object({
  title: yup.string().min(2).required("Nhập tiêu đề"),

  name: yup.string().min(2).required("Nhập tên"),
  isPublic: yup.boolean().required("Visibility is required"),
});

export default function EditCourses(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [data, setData] = useState(null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    getACourseData();
  }, []);

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

  const getACourseData = () => {
    dispatch(getACourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
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
      isPublic: data?.showCourse,
    },
    onSubmit: (values) => {
      dispatch(editCourse({ id: props?.id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            return dispatch(uploadImageCourse({ courseId: id, filename: file }))
              .then(unwrapResult)
              .then((res) => {
                if (res.status) {
                  setFile(null);
                  messageApi.open({
                    type: "Thành công",
                    content: "Đang thực hiện...",
                    duration: 2.5,
                  });
                }
                return res;
              });
          }
          return res;
        })
        .then((res) => {
          if (values.isPublic) {
            return dispatch(buttonPublicCourse(id));
          } else {
            return dispatch(buttonPriavteourse(id));
          }
        })
        .then(() => {
          refresh();
        })
        .catch((error) => {
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
      >
        Cập nhật
      </Button>
      <Modal
        title={
          <h1 className="text-3xl font-bold text-blue-500">
            Cập nhật khóa học
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
            Hủy
          </Button>,
          <Button
            key="ok"
            type="primary"
            onClick={handleOk}
            className="custom-button"
          >
            Lưu
          </Button>,
        ]}
      >
        <div className="mt-10">
          <label htmlFor="course" className="fs-6 font-medium">
            Tên khóa học:
          </label>
          <CustomInput
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor="course" className="fs-6 font-medium mt-3">
            Mô tả khóa học:
          </label>
          <textarea
            id="course"
            placeholder="Thêm mô tả"
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            value={formik.values.title}
            error={formik.touched.title && formik.errors.title}
            className="form-control"
          />
          {formik.submitCount > 0 && formik.touched.title && formik.errors.title
            ? formik.errors.title
            : null}
        </div>

        <div>
          <label htmlFor="course" className="fs-6 font-medium mt-3 mr-3">
            Hình ảnh khóa học:
          </label>

          <Upload {...propsUdateImage}>
            <Button className="mt-3" icon={<UploadOutlined />}>
              Chọn hình ảnh
            </Button>
          </Upload>
        </div>

        <div className="mt-3">
          <label htmlFor="visibility" className="fs-6 font-medium pr-2">
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
