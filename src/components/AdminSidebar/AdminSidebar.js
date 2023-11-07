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
            <Link
              className="fs-6 text-dark text-decoration-none me-4"
              href="/login"
            >
              Login
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
        items={[
          {
            key: "1",
            icon: <VideoCameraOutlined />,
            label: "Course",
            children: [
              {
                key: "courses/add-course",
                icon: <UserOutlined />,
                label: "Add Course",
              },
              {
                key: "courses/view-courses",
                icon: <UserOutlined />,
                label: "Table Course",
              },
            ],
          },
          {
            key: "2",
            icon: <FileAddOutlined />,
            label: "Quiz",
            children: [
              {
                key: "quiz/create-quiz",
                icon: <UserOutlined />,
                label: "Create Quiz",
              },
              {
                key: "quiz/view-quiz",
                icon: <UserOutlined />,
                label: "View Quiz",
              },
            ],
          },
          {
            key: "3",
            icon: <UserOutlined />,
            label: "User",
            children: [
              {
                key: "users/view-users",
                icon: <UserOutlined />,
                label: "Table User",
              },
              {
                key: "users/score-trainee",
                icon: <UserOutlined />,
                label: "Table Score User",
              },
            ],
          },
        ]}
      />
    </Sider>
  );
}
