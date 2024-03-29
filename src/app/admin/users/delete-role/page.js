"use client";
import { deleteRole } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Popconfirm, message } from "antd";
import { Button } from "antd";
import React from "react";
import { useDispatch } from "react-redux";

export default function DelRole(props) {
  const { idRole, refresh } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const dispatch = useDispatch();

  const handleDeleteRole = () => {
    dispatch(deleteRole({ id: idRole }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => message.success(res.message, 2.5), refresh());
        }
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
      });
  };

  return (
    <React.Fragment>
      {contextHolder}
      <Popconfirm
        title="Xóa vai trò"
        description="Bạn có chắc muốn xóa vai trò?"
        okText="Có"
        cancelText="Không"
        className="me-3"
        onConfirm={() => handleDeleteRole()}
        okButtonProps={{
          style: { backgroundColor: "red" },
        }}
      >
        <Button danger style={{ width: "100%" }}>
          Xóa<acronym title=""></acronym>
        </Button>
      </Popconfirm>
    </React.Fragment>
  );
}
