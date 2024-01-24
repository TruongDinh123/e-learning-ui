"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { Dropdown, Menu, Space, Spin, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { Button, Popconfirm } from "antd";
import { deleteUser, getAllUser } from "@/features/User/userSlice";
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
  const [pagination, setPagination] = useState({
    current: 1,
    pageSize: 5,
  });

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
  useEffect(() => {
    setIsLoading(true);
    dispatch(
      getAllUser({ page: pagination.current, limit: pagination.pageSize })
    )
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUser(res.metadata.users);
          setPagination((prevPagination) => ({
            ...prevPagination,
            total: res.metadata.total,
            current: res.metadata.currentPage,
            pageSize: res.metadata.pageSize,
          }));
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [updateUser, dispatch, messageApi]);

  //table data
  let data = [];
  user.forEach((i, index) => {
    let menuItems = [];
    if (!i?.roles.some(role => role.name === "Super-Admin")) {
      menuItems.push(
        <Menu.Item>
          <EditUser id={i?._id} refresh={() => setUpdateUser(updateUser + 1)} />
        </Menu.Item>,
        <Menu.Item>
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
        <Dropdown overlay={menu} placement="bottomCenter">
          <Button
            className="text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Chức năng
          </Button>
        </Dropdown>
      ) : (
        <Space size={"middle"}>
          {!i?.roles.some(role => role.name === "Super-Admin") && (
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
    dispatch(deleteUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => setUpdateUser(updateUser + 1));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  };

  const handleTableChange = (newPagination, filters, sorter) => {
    // Cập nhật state pagination với thông tin mới từ sự kiện
    setPagination((prevPagination) => ({
      ...prevPagination,
      current: newPagination.current,
      pageSize: newPagination.pageSize,
    }));

    // Gọi lại API với thông tin phân trang mới để lấy dữ liệu
    fetchUsers(newPagination.current, newPagination.pageSize);
  };

  // Hàm để gọi API và lấy dữ liệu người dùng
  const fetchUsers = (page, pageSize) => {
    setIsLoading(true);
    dispatch(getAllUser({ page, limit: pageSize }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status === 200) {
          setUser(res.metadata.users);
          setPagination((prevPagination) => ({
            ...prevPagination,
            total: res.metadata.total,
          }));
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        messageApi.error("An error occurred while fetching users.");
        setIsLoading(false);
      });
  };

  return (
    <div>
      {contextHolder}
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
              current: pagination.current,
              pageSize: pagination.pageSize,
              total: pagination.total,
              position: ["bottomLeft"],
            }}
            onChange={handleTableChange}
            className="grid-container"
          />
        </React.Fragment>
      )}
    </div>
  );
}
