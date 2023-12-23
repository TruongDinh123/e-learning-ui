"use client";
import {
  editCourse,
  getACourse,
  uploadImageCourse,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Upload, message } from "antd";
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
      .catch((error) => {
        console.log(error);
      });
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
    },
    onSubmit: (values) => {
      dispatch(editCourse({ id: props?.id, values }))
        .then(unwrapResult)
        .then((res) => {
          if (file) {
            dispatch(uploadImageCourse({ courseId: id, filename: file })).then(
              (res) => {
                if (res.status) {
                  refresh();
                }
              }
            );
          }
          else {
            refresh();
          }
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => {
              refresh();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{ width: "100%", color: "#fff", backgroundColor: "#1890ff" }}
      >
        Chỉnh sửa
      </Button>
      <Modal
        title="Chỉnh sửa khóa học"
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
            style={{ backgroundColor: "#1890ff", color: "white" }}
          >
            Lưu
          </Button>,
        ]}
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Tên
          </label>
          <CustomInput
            onChange={formik.handleChange("name")}
            onBlur={formik.handleBlur("name")}
            value={formik.values.name}
            error={formik.touched.name && formik.errors.name}
          />

          <label htmlFor="course" className="fs-6 fw-bold">
            Chủ đề
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("title")}
            onBlur={formik.handleBlur("title")}
            value={formik.values.title}
            error={formik.touched.title && formik.errors.title}
          />
        </div>

        <Upload {...propsUdateImage}>
          <Button icon={<UploadOutlined />}>Chọn tệp</Button>
        </Upload>
      </Modal>
    </React.Fragment>
  );
}
