"use client";
import {
  UserOutlined,
  VideoCameraOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { getAUser, logOut, resetState } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useEffect, useState } from "react";
const logo3 = "/images/logo5.png";

const { Sider } = Layout;

export default function AdminSidebar(props) {
  const { collapsed, setCollapsed } = props;
  const router = useRouter();
  // const userState = useSelector((state) => state.user.user);
  const dispatch = useDispatch();

  const userState = JSON.parse(localStorage.getItem("user"));
  const id = localStorage.getItem("x-client-id");

  const userProfile = useSelector((state) => state.user.profile);
  const [data, setData] = useState(null);

  const userRole = userState?.roles[0];

  const menuItems = [
    {
      key: "1",
      icon: <VideoCameraOutlined />,
      label: "Khóa học",
      children: [
        {
          key: "courses",
          icon: <UserOutlined />,
          label: "Bảng khóa học",
        },
      ],
    },
    {
      key: "2",
      icon: <FileAddOutlined />,
      label: "Bài tập",
      children: [
        {
          key: "quiz/create-quiz",
          icon: <UserOutlined />,
          label: "Tạo bài tập",
        },
        {
          key: "quiz/view-quiz",
          icon: <UserOutlined />,
          label: "Xem bài tập",
        },
        {
          key: "quiz/template-quiz",
          icon: <UserOutlined />,
          label: "Bài tập mẫu",
        },
      ],
    },
    {
      key: "3",
      icon: <UserOutlined />,
      label: "Quản lý",
      children: [
        {
          key: "users/trainee",
          icon: <UserOutlined />,
          label: "Học viên",
        },
      ],
    },
  ];

  if (userRole !== "Mentor") {
    menuItems[2].children.push(
      {
        key: "users/view-users",
        icon: <UserOutlined />,
        label: "Người dùng",
      },
      {
        key: "users/view-role",
        icon: <UserOutlined />,
        label: "Vai trò",
      },
      {
        key: "users/view-teachers",
        icon: <UserOutlined />,
        label: "Khóa học",
      },
      {
        key: "category",
        icon: <UserOutlined />,
        label: "Danh mục",
      }
    );
  }

  const handleLogOut = () => {
    dispatch(logOut())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          // Clear any local storage or cookies that might persist state
          localStorage.clear();
          Cookies.remove("Bearer");

          // Reset the Redux state
          dispatch(resetState());

          // Redirect to the login page
          router.push("/login");
        } else {
          message.error(res.message, 2.5);
        }
      })
      .catch((error) => {});
  };

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  };

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
    >
      <div className="demo-logo-vertical d-flex justify-content-center align-items-center py-3">
        <div className="flex-shrink-0 pb-4">
          <a href="/admin/courses">
            <img
              className="h-36 w-auto object-contain  absolute top-0 mt-[26px] transform -translate-y-1/2  fs-6 text-white text-decoration-none me-4"
              style={{ left: "1rem", paddingLeft: "10px" }}
              src={logo3}
              alt=""
            />
          </a>
        </div>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        style={{ flex: 1 }}
        defaultSelectedKeys={["1"]}
        onClick={({ key }) => {
          router.push(`/admin/${key}`);
          props.setCollapsed(true);
        }}
        items={menuItems}
      />
    </Sider>
  );
}
