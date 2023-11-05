"use client";
import { addStudentToCourse, getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import CustomInput from "@/components/comman/CustomInput";
import { useFormik } from "formik";
import * as yup from "yup";
import { getAllUser } from "@/features/User/userSlice";

const EmailSchema = yup.object({
  email: yup.string().email().required("email is required"),
});

export default function AddStudentToCourse(props) {
  const { courseId, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [user, setuser] = useState([]);

  useEffect(() => {
    getAUserData();
  }, []);

  const getAUserData = () => {
    dispatch(getAllUser())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setuser(res.data.metadata);
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
    validationSchema: EmailSchema,
    enableReinitialize: true,
    initialValues: {
      email: "",
    },
    onSubmit: (values) => {
      dispatch(addStudentToCourse({ courseId: courseId, values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => {
              message.success(res.message, 1.5);
              refresh();
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  return (
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal} className="me-3">
        invite
      </Button>
      <Modal
        title="Edit Course"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <div>
          <label htmlFor="course" className="fs-6 fw-bold">
            Email
          </label>
          <CustomInput
            className="mb-3"
            onChange={formik.handleChange("email")}
            onBlur={formik.handleBlur("email")}
            value={formik.values.email}
            error={formik.touched.email && formik.errors.email}
          />
        </div>
      </Modal>
    </>
  );
}
