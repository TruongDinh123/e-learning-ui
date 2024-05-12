"use client";
import React, { useEffect, useState } from "react";
import { useFormik } from "formik";
import * as yup from "yup";
import { Avatar, Button, Card, DatePicker, Upload, message } from "antd";
import {
  getAUser,
  updateUser,
  uploadImageUser,
} from "@/features/User/userSlice";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { Content } from "antd/es/layout/layout";
import { AntDesignOutlined, UploadOutlined } from "@ant-design/icons";
import CustomInput from "@/components/comman/CustomInput";
import moment from "moment";
import "../user/page.css";
import UpdateInfo from './updateInfo';

const Userchema = yup.object().shape({
  lastName: yup.string(),
  firstName: yup.string(),
  email: yup.string().email(),
  dob: yup.date(),
  phoneNumber: yup.string(),
  gender: yup.string(),
});

export default function UpdateInfoUser() {


  return (
    <UpdateInfo />
  );
}
