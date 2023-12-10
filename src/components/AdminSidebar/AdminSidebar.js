"use client";
import {
  UploadOutlined,
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
import { resetState } from "@/features/User/userSlice";

const { Sider } = Layout;
export default function AdminSidebar(props) {
  const { collapsed } = props;
  const router = useRouter();
  const userState = useSelector((state) => state?.user?.user);
  const dispatch = useDispatch();

  const userRole = userState?.metadata?.account?.roles[0];

  const menuItems = [
    {
      key: "1",
      icon: <VideoCameraOutlined />,
      label: "Khóa học",
      children: [
        {
          key: "courses/view-courses",
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
      ],
    },
    {
      key: "3",
      icon: <FileAddOutlined />,
      label: "Bài kiểm tra",
      children: [
        {
          key: "assignment/create-assignment",
          icon: <UserOutlined />,
          label: "Tạo bài kiểm tra",
        },
        {
          key: "assignment/view-assignment",
          icon: <UserOutlined />,
          label: "Xem bài kiểm tra",
        },
      ],
    },
    {
      key: "4",
      icon: <UserOutlined />,
      label: "Học viên",
      children: [
        {
          key: "users/score-trainee",
          icon: <UserOutlined />,
          label: "Quản lí học viên",
        },
      ],
    },
  ];

  if (userRole !== "Mentor") {
    menuItems[3].children.push(
      {
        key: "users/view-users",
        icon: <UserOutlined />,
        label: "Quản lí người dùng",
      },
      {
        key: "users/view-role",
        icon: <UserOutlined />,
        label: "Quản lý vai trò",
      },
      {
        key: "users/view-teachers",
        icon: <UserOutlined />,
        label: "Quản lý giáo viên",
      }
    );
  }

  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical d-flex justify-content-center align-items-center py-3">
        <Avatar src="" />
        <Nav>
          {userState !== null ? (
            <CustomButton
              title="Logout"
              type="link"
              className="text-white"
              onClick={() => {
                localStorage.clear();
                Cookies.remove("Bearer");
                dispatch(resetState());
                router.push("/login");
              }}
            />
          ) : (
            <Link href="/login">
              <span className="fs-6 text-dark text-decoration-none me-4">
                Login
              </span>
            </Link>
          )}
        </Nav>
      </div>
      <Menu
        theme="dark"
        mode="inline"
        defaultSelectedKeys={["1"]}
        onClick={({ key }) => {
          router.push(`/admin/${key}`);
        }}
        items={menuItems}
      />
    </Sider>
  );
}
