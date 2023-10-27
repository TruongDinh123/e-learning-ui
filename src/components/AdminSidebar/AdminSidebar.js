"use client";
import {
  UploadOutlined,
  UserOutlined,
  VideoCameraOutlined,
} from "@ant-design/icons";
import { Avatar, Layout, Menu } from "antd";
import { useRouter } from "next/navigation";

const { Sider } = Layout;
export default function AdminSidebar(props) {
  const { collapsed } = props;
  const router = useRouter();
  return (
    <Sider trigger={null} collapsible collapsed={collapsed}>
      <div className="demo-logo-vertical d-flex justify-content-center align-items-center py-3">
        <Avatar src="" />
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
            icon: <UserOutlined />,
            label: "User",
            children: [
              {
                key: "users/view-users",
                icon: <UserOutlined />,
                label: "Table User",
              },
            ],
          },
          {
            key: "3",
            icon: <UploadOutlined />,
            label: "nav 3",
          },
        ]}
      />
    </Sider>
  );
}
