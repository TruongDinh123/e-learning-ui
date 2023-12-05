"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Spin, Upload } from "antd";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { uploadFileQuiz } from "@/features/Quiz/quizSlice";

export default function UploadFileQuiz(propsComponent) {
  const { quizId, file, setFile } = propsComponent;

  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };


  return (
    <div>
        <React.Fragment>
          <Upload {...props}>
            <Button icon={<UploadOutlined />}>Select File</Button>
          </Upload>
        </React.Fragment>
    </div>
  );
}
