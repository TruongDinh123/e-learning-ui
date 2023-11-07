"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Button, Dropdown, Menu, Space, Table, message } from "antd";
import { useEffect, useState } from "react";
import { getAllRole } from "@/features/User/userSlice";
import EditRole from "../edit-role/page";
import DelRole from "../delete-role/page";
import CreateRole from "../create-role/page";
import { useMediaQuery } from "react-responsive";

export default function ViewRoles() {
  const dispatch = useDispatch();
  const [role, setRole] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateRole, setUpdateRole] = useState(0);

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
  }, [dispatch, messageApi, updateRole]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  //table role
  let data = [];
  role.forEach((i, index) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <EditRole id={i?._id} refresh={() => setUpdateRole(updateRole + 1)} />
        </Menu.Item>
        <Menu.Item>
          <DelRole
            idRole={i?._id}
            refresh={() => setUpdateRole(updateRole + 1)}
          />
        </Menu.Item>
      </Menu>
    );
    data.push({
      key: index + 1,
      name: i?.name,
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
          <EditRole id={i?._id} refresh={() => setUpdateRole(updateRole + 1)} />
          <DelRole
            idRole={i?._id}
            refresh={() => setUpdateRole(updateRole + 1)}
          />
        </Space>
      ),
    });
  });

  return (
    <div>
      {contextHolder}
      <h1>Table Role</h1>
      <CreateRole refresh={() => setUpdateRole(updateRole + 1)} />
      <Table columns={columns} dataSource={data} className="pt-3" />
    </div>
  );
}
