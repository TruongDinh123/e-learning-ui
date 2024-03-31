import {
  InfoCircleOutlined,
  LaptopOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import "./teachersidebar.css";
import { usePathname, useRouter } from "next/navigation";

const { Sider } = Layout;

export default function TeacherSidebar() {
  const router = useRouter();
  const pathname = usePathname();
  const getCurrentKey = (path) => {
    if (pathname.includes("/teacher")) {
      return "teacher";
    } else if (pathname.includes("/teacher/ranking")) {
      return "teacher/ranking";
    }
    return "1";
  };
  const [selectedKey, setSelectedKey] = useState(getCurrentKey(pathname));

  const items = [
    {
      key: "/teacher",
      icon: React.createElement(InfoCircleOutlined),
      label: "Thông tin",
      children: [
        {
          key: "/teacher",
          label: "Hướng dẫn",
        },
      ],
    },
    {
      key: "/teacher/ranking",
      icon: React.createElement(OrderedListOutlined),
      label: "Bảng Xếp hạng",
    },
    {
      key: "3",
      icon: React.createElement(SolutionOutlined),
      label: "Quản trị bài tập",
    },
  ];

  useEffect(() => {
    setSelectedKey(getCurrentKey(pathname));
  }, [pathname]);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <Sider
      style={{
        color: "#ffffff", 
        borderRadius: borderRadiusLG,
      }}
      width={200}
    >
      <Menu
        mode="inline"
        defaultSelectedKeys={["1"]}
        defaultOpenKeys={["sub1"]}
        theme="light"
        style={{
          height: "100%",
          background: "linear-gradient(#002979, #1C4185)",
          borderRadius: borderRadiusLG,
          color: "#ffffff", 
        }}
        onClick={({ key }) => {
          router.push(`${key}`);
        }}
        items={items}
      />
    </Sider>
  );
}
