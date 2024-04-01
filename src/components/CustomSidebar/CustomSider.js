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

export default function SiderCustom() {
  const router = useRouter();
  const pathname = usePathname();

  const getCourseIdFromPath = (pathname) => {
    const match = pathname.match(/\/courses\/view-course-details\/([^\/]+)/);
    return match ? match[1] : null;
  };

  const courseId = getCourseIdFromPath(pathname);

  const getCurrentKey = () => {
    if (pathname.includes("/info")) {
      return "info";
    } else if (pathname.includes(`/courses/view-course-details/${courseId}`)) {
      return `/courses/view-course-details/${courseId}/ranking`;
    }
    return "1";
  };
  const [selectedKey, setSelectedKey] = useState(getCurrentKey(pathname));

  const items = [
    {
      key: `/courses/view-course-details/${courseId}`,
      icon: React.createElement(InfoCircleOutlined),
      label: "Thông tin",
    },
    {
      key: `/courses/view-course-details/${courseId}/ranking`,
      icon: React.createElement(OrderedListOutlined),
      label: "Bảng Xếp hạng",
    },
    {
      key: `/courses/view-course-details/${courseId}/quizzes`,
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
          background: "#02354B",
          borderRadius: borderRadiusLG,
          color: "#ffffff",
        }}
        className="text-base"
        onClick={({ key }) => {
          router.push(`${key}`);
        }}
        items={items}
      />
    </Sider>
  );
}
