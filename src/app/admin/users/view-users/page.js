"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Space, Spin, Table, message } from "antd";
import { useEffect, useState } from "react";
import { Button, Popconfirm } from "antd";
import { deleteUser, getAllUser } from "@/features/User/userSlice";
import EditUser from "../edit-user/page";
import { useMediaQuery } from "react-responsive";

export default function ViewUsers() {
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateUser, setUpdateUser] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Last Name",
      dataIndex: "lastName",
      onFilter: (value, record) => record.lastName.indexOf(value) === 0,
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      onFilter: (value, record) => record.email.indexOf(value) === 0,
      sorter: (a, b) => a.email.length - b.email.length,
      sortDirections: ["descend"],
    },
    {
      title: "Status",
      dataIndex: "status",
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.length - b.status.length,
      sortDirections: ["descend"],
    },
    {
      title: "Roles",
      dataIndex: "roles",
      onFilter: (value, record) => record.roles.indexOf(value) === 0,
      sorter: (a, b) => a.roles.length - b.roles.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  //viewUsers api
  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllUser())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.data.metadata);
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [updateUser, dispatch, messageApi]);

  //table data
  let data = [];
  user.forEach((i, index) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <EditUser id={i?._id} refresh={() => setUpdateUser(updateUser + 1)} />
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteUser(i?._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
    data.push({
      key: index + 1,
      lastName: i?.lastName,
      email: i?.email,
      status: i?.status,
      roles: i?.roles,
      action: isMobile ? (
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            className="text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Actions
          </Button>
        </Dropdown>
      ) : (
        <Space size={"middle"}>
          <EditUser id={i?._id} refresh={() => setUpdateUser(updateUser + 1)} />

          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteUser(i?._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </Space>
      ),
    });
  });

  //handleDeleteUser
  const handleDeleteUser = (id) => {
    dispatch(deleteUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setUpdateUser(updateUser + 1));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {contextHolder}
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <h1>Table User</h1>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </div>
  );
}