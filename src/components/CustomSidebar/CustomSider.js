import {
  InfoCircleOutlined,
  LaptopOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  NotificationOutlined,
  OrderedListOutlined,
  SolutionOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import React, { useEffect, useState } from "react";
import "./teachersidebar.css";
import { usePathname, useRouter } from "next/navigation";
import { useMediaQuery } from 'react-responsive';
const { Sider } = Layout;

export default function SiderCustom(props) {
  const { collapsed, setCollapsed } = props;
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

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1024px)'
  });

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
    if (isDesktopOrLaptop) {
      setCollapsed(false);
    }
  }, [pathname, isDesktopOrLaptop]);

  const {
    token: { borderRadiusLG },
  } = theme.useToken();

  return (
    <>
      <Sider
        style={{
          color: "#ffffff",
          borderRadius: borderRadiusLG,
        }}
        trigger={null}
        collapsible
        collapsed={collapsed}
        collapsedWidth="0"
        width={200}
        breakpoint="lg"
      >
        <Menu
          mode="inline"
          defaultSelectedKeys={["1"]}
          defaultOpenKeys={["sub1"]}
          theme="light"
          style={{
            height: "100%",
            background: "#4d6d7b",
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
    </>
  );
}
