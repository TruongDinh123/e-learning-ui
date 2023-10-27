"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Button, Popconfirm, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getAllRole } from "@/features/User/userSlice";

export default function ViewRoles() {
  const dispatch = useDispatch();
  const [role, setRole] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name Role",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  //viewRoles api
  useEffect(() => {
    dispatch(getAllRole())
      .then(unwrapResult)
      .then((res) => {
        console.log("🚀 ~ res:", res);
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setRole(res.data.metadata))
            .then(() => message.success(res.message, 1.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [dispatch, messageApi]);

  //table role
  let data = [];
  role.forEach((i, index) => {
    data.push({
      key: index + 1,
      name: i?.name,
      action: (
        <>
          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteUser(i?._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    });
  });

  return (
    <div>
      {contextHolder}
      <h1>hello Table Role User</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
