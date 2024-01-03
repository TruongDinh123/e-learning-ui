"use client";
import React, { Fragment, useEffect, useState } from "react";
import { Formik, useFormik } from "formik";
import * as yup from "yup";
import { Button, message } from "antd";
import { getAUser, updateUser } from "@/features/User/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import CustomButton from "@/components/comman/CustomBtn";

const Userchema = yup.object().shape({
  lastName: yup
    .string()
    .required("Name is required")
    .trim("Name must not start or end with whitespace")
    .min(3, "Name must be at least 3 characters long")
    .matches(/^\S*$/, "Name must not contain whitespace"),
  email: yup.string().email().required("email is required"),
});

export default function UpdateInfoUser() {
  const id = localStorage.getItem("x-client-id");
  const [user, setUser] = useState(null);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const handleOk = () => {
    formik.submitForm();
  };

  const formik = useFormik({
    validationSchema: Userchema,
    enableReinitialize: true,
    initialValues: {
      lastName: user?.lastName,
      email: user?.email,
    },
    onSubmit: (values) => {
      values.lastName = values.lastName.trim();
      dispatch(updateUser({ id: id, values }))
        .then(unwrapResult)
        .then((res) => {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => {
              setUser(res);
            });
        })
        .catch((error) => {
          console.log(error);
        });
    },
  });

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.data.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Fragment>
      {contextHolder}
      <div className="row p-5">
        <div className="col-lg-12">
          <div className="card">
            <div className="card-header">
              <h4 className="card-title">Cập nhật thông tin</h4>
            </div>
            <div className="card-body">
              <div className="form-validation">
                <form
                  className="form-valide"
                  action="#"
                  method="post"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div className="row">
                    <div className="col-xl-6">
                      <div className="form-group mb-3 row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="val-username"
                        >
                          Tên:
                          {/* <span className="text-danger">*</span> */}
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            id="val-username"
                            name="val-username"
                            placeholder="Enter a username.."
                            onChange={formik.handleChange("lastName")}
                            onBlur={formik.handleBlur("lastName")}
                            value={formik.values.lastName}
                            error={
                              formik.submitCount > 0 &&
                              formik.touched.lastName &&
                              formik.errors.lastName
                                ? formik.errors.lastName
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 row">
                        <label
                          className="col-lg-4 col-form-label"
                          htmlFor="val-email"
                        >
                          Email:
                          {/* Email <span className="text-danger">*</span> */}
                        </label>
                        <div className="col-lg-6">
                          <input
                            type="text"
                            className="form-control"
                            id="val-email"
                            name="val-email"
                            placeholder="Your valid email.."
                            onChange={formik.handleChange("email")}
                            onBlur={formik.handleBlur("email")}
                            value={formik.values.email}
                            error={
                              formik.submitCount > 0 &&
                              formik.touched.email &&
                              formik.errors.email
                                ? formik.errors.email
                                : null
                            }
                          />
                        </div>
                      </div>
                      <div className="form-group mb-3 row">
                        <div className="col-lg-8 ms-auto">
                          <Button
                            type="primary"
                            onClick={handleOk}
                            style={{
                              color: "#fff",
                              backgroundColor: "#1890ff",
                            }}
                          >
                            Lưu
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Fragment>
  );
}
