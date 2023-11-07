"use client";
import { deleteRole } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Popconfirm, message } from "antd";
import { Button } from "antd";
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
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => message.success(res.message, 2.5), refresh());
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <>
      {contextHolder}
      <Popconfirm
        title="Delete the Role"
        description="Are you sure to delete this Role?"
        okText="Yes"
        cancelText="No"
        className="me-3"
        onConfirm={() => handleDeleteRole()}
      >
        <Button danger style={{ width: "100%" }}>
          Delete
        </Button>
      </Popconfirm>
    </>
  );
}
