"use client";
import {
  UserOutlined,
  VideoCameraOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { useRouter } from "next/navigation";
import { isMentor } from "@/middleware";
const logo3 = "/images/logo5.png";

const { Sider } = Layout;

export default function AdminSidebar(props) {
  const { collapsed } = props;
  const router = useRouter();

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
          label: "Bài tập học viên",
        },
        {
          key: "users/view-teachers",
          icon: <UserOutlined />,
          label: "Học viên khoá học",
        },
      ],
    },
  ];

  if (!isMentor()) {
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
        key: "category",
        icon: <UserOutlined />,
        label: "Danh mục",
      }
    );
  }

  return (
    <Sider
      trigger={null}
      collapsible
      collapsed={collapsed}
      breakpoint="lg"
      collapsedWidth="0"
      width={220}
      style={{
        minHeight: "calc(100vh + 200px)",
        overflow: "auto",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 2000,
      }}
    >
      <div className="demo-logo-vertical d-flex justify-content-center align-items-center py-3">
        <div className="flex-shrink-0 pb-4">
          <a href="/">
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
