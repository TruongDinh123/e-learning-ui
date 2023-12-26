"use client";
import {
  UserOutlined,
  VideoCameraOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu } from "antd";
import { Nav } from "react-bootstrap";
import CustomButton from "../comman/CustomBtn";
import Link from "next/link";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { logOut, resetState } from "@/features/User/userSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const { Sider } = Layout;
export default function AdminSidebar(props) {
  const { collapsed } = props;
  const router = useRouter();
  // const userState = useSelector((state) => state.user.user);
  const dispatch = useDispatch();
  const userState = JSON.parse(localStorage.getItem("user"));

  const userRole = userState.metadata.account.roles[0];

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
        label: "Giáo viên",
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
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical d-flex justify-content-center align-items-center py-3">
        <Avatar src={`https://xsgames.co/randomusers/avatar.php?g=pixel`} />
        <span
          className="fs-6 text-white text-decoration-none me-4"
          style={{ paddingLeft: "10px" }}
        >
          {userState.metadata.account?.lastName}
        </span>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        style={{ flex: 1 }}
        defaultSelectedKeys={["1"]}
        onClick={({ key }) => {
          router.push(`/admin/${key}`);
        }}
        items={menuItems}
      />
      <div
        style={{
          position: "absolute",
          bottom: 0,
          width: "100%",
          display: "flex",
          justifyContent: "center", // Căn giữa nút đăng xuất
        }}
      >
        <Nav style={{ padding: "10px 0" }}>
          {userState !== null ? (
            <CustomButton
              title="Đăng xuất"
              type="link"
              className="text-white"
              onClick={() => handleLogOut()}
            />
          ) : (
            <Link href="/login">
              <span className="fs-6 text-dark text-decoration-none me-4">
                Đăng nhập
              </span>
            </Link>
          )}
        </Nav>
      </div>
    </Sider>
  );
}
