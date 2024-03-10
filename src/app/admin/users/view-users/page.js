"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import {
  Dropdown,
  Input,
  Menu,
  Select,
  Space,
  Spin,
  Table,
  message,
} from "antd";
import React, { useEffect, useState } from "react";
import { Button, Popconfirm } from "antd";
import { deleteUser, getAllRole, getAllUser } from "@/features/User/userSlice";
import EditUser from "../edit-user-modal/page";
import { useMediaQuery } from "react-responsive";
import "../view-users/page.css";
export default function ViewUsers() {
  const dispatch = useDispatch();
  const [user, setUser] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateUser, setUpdateUser] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const { Option } = Select;
  const [searchTerm, setSearchTerm] = useState("");
  const [filterRole, setFilterRole] = useState("");
  const [roles, setRoles] = useState([]);

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Họ",
      dataIndex: "lastName",
      onFilter: (value, record) => record.lastName.indexOf(value) === 0,
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ["descend"],
    },
    {
      title: "Tên",
      dataIndex: "firstName",
      onFilter: (value, record) => record.firstName.indexOf(value) === 0,
      sorter: (a, b) => a.firstName.localeCompare(b.firstName),
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      onFilter: (value, record) => record.email.indexOf(value) === 0,
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      onFilter: (value, record) => record.status.indexOf(value) === 0,
      sorter: (a, b) => a.status.localeCompare(b.status),
      sortDirections: ["descend"],
    },
    {
      title: "Vai trò",
      dataIndex: "roles",
      onFilter: (value, record) => record.roles.indexOf(value) === 0,
      sorter: (a, b) => a.roles.join(", ").localeCompare(b.roles.join(", ")),
      sortDirections: ["descend"],
    },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];
  //viewUsers api
  const allUsersStore = useSelector((state) => state?.user?.allUsers);
  const allRolesStore = useSelector((state) => state?.user?.allRoles);

  useEffect(() => {
    if (allUsersStore?.metadata?.users?.length > 0) {
      setUser(allUsersStore.metadata.users);
    } else {
      setIsLoading(true);
      dispatch(getAllUser())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setUser(res.metadata.users);
          } else {
            messageApi.error(res.message);
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    }
  }, [updateUser, dispatch, messageApi]);

  useEffect(() => {
    if (allRolesStore?.metadata?.length > 0) {
      setRoles(allRolesStore.metadata);
    } else {
      dispatch(getAllRole())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setRoles(res.metadata);
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {
          messageApi.error("An error occurred while fetching roles.");
        });
    }
  }, [dispatch]);

  let filteredUsersByRole = user.filter((u) => {
    if (!filterRole) return true;
    return u.roles.some((role) => role._id === filterRole);
  });

  //Tìm kiếm tên người dùng
  let filteredUsers = filteredUsersByRole.filter((u) => {
    return (
      u.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  });

  //table data
  let data = [];
  filteredUsers.forEach((i, index) => {
    let menuItems = [];
    if (!i?.roles.some((role) => role.name === "Super-Admin")) {
      menuItems.push(
        <Menu.Item key={index}>
          <EditUser id={i?._id} refresh={() => setUpdateUser(updateUser + 1)} />
        </Menu.Item>,
        <Menu.Item key={index}>
          <Popconfirm
            title="Xóa người dùng"
            description="Bạn có chắc muốn xóa người dùng?"
            okText="Có"
            okButtonProps={{ style: { backgroundColor: "red" } }}
            cancelText="Không"
            onConfirm={() => handleDeleteUser(i?._id)}
          >
            <Button danger style={{ width: "100%" }}>
              Xóa
            </Button>
          </Popconfirm>
        </Menu.Item>
      );
    }

    const menu = <Menu>{menuItems}</Menu>;

    data.push({
      key: index + 1,
      lastName: i?.lastName,
      firstName: i?.firstName,
      email: i?.email,
      status: i?.status,
      roles: i?.roles.map((role) => role.name),
      action: isMobile ? (
        <Dropdown menu={menu} placement="bottomCenter">
          <Button
            className="text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Chức năng
          </Button>
        </Dropdown>
      ) : (
        <Space size={"middle"}>
          {!i?.roles.some((role) => role.name === "Super-Admin") && (
            <>
              <EditUser
                id={i?._id}
                refresh={() => setUpdateUser(updateUser + 1)}
              />
              <Popconfirm
                title="Xóa người dùng"
                description="Bạn có chắc muốn xóa người dùng?"
                okButtonProps={{ style: { backgroundColor: "red" } }}
                okText="Có"
                cancelText="Không"
                onConfirm={() => handleDeleteUser(i?._id)}
              >
                <Button danger style={{ width: "100%" }}>
                  Xóa
                </Button>
              </Popconfirm>
            </>
          )}
        </Space>
      ),
    });
  });

  //handleDeleteUser
  const handleDeleteUser = (id) => {
    const updatedUsers = user.filter((u) => u._id !== id);
    setUser(updatedUsers);

    dispatch(deleteUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (!res.status) {
          setUser(user);
          message.error("Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.");
        }
      })
      .catch((error) => {
        setUser(user);
        message.error("Có lỗi xảy ra khi xóa người dùng. Vui lòng thử lại.");
      });
  };

  return (
    <div className="p-3">
      {contextHolder}
      <div className="flex flex-col md:flex-row md:items-center md:justify-start space-y-2 md:space-y-0 md:space-x-2">
        <div className="flex flex-col">
          <label
            htmlFor="userSearch"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Tìm kiếm người dùng
          </label>
          <Input
            title="Tìm kiếm người dùng"
            placeholder="Tìm kiếm người dùng"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mb-2 sm:mb-0 w-full sm:w-64"
          />
        </div>
        <div className="flex flex-col">
          <label
            htmlFor="roleSelect"
            className="mb-1 text-sm font-medium text-gray-700"
          >
            Lọc theo vai trò
          </label>
          <Select
            showSearch
            placeholder="Lọc theo vai trò"
            value={filterRole}
            onChange={(value) => setFilterRole(value)}
            className="w-full sm:w-64 mb-2"
          >
            <Option value="">Tất cả vai trò</Option>
            {roles.map((role) => (
              <Option key={role._id} value={role._id}>
                {role.name}
              </Option>
            ))}
          </Select>
        </div>
      </div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <Table
            title={() => (
              <div className="flex justify-between">
                <h1 className="text-3xl font-medium">Danh sách người dùng</h1>
              </div>
            )}
            columns={columns}
            dataSource={data}
            pagination={{
              pageSize: 5,
              position: ["bottomLeft"],
            }}
            className="grid-container"
          />
        </React.Fragment>
      )}
    </div>
  );
}
