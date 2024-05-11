"use client";
import {
  UserOutlined,
  VideoCameraOutlined,
  FileAddOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import { usePathname, useRouter } from "next/navigation";
import { isMentor } from "@/middleware";
import { useEffect, useState } from "react";
const logo3 = "/images/logo-new.png";
const newlogo = "/images/new.png";

const { Sider } = Layout;

// const showComingSoonModal = () => {
//   Modal.info({
//     title: 'Tính năng sắp ra mắt',
//     content: (
//       <div>
//         <p>Đây là tính năng sắp ra mắt, dành cho giáo viên đặc biệt. Để sử dụng tính năng này vui lòng liên hệ qua 247learn@gmail.com</p>
//       </div>
//     ),
//     onOk() {},
//     type: 'confirm',
//     okButtonProps: {className: 'custom-button'}
//   });
// };

export default function AdminSidebar(props) {
  const { collapsed } = props;
  const router = useRouter();
  const pathname = usePathname()
  const getCurrentKey = (path) => {
    if (pathname.includes('/admin/courses')) {
      return 'courses';
    } else if (pathname.includes('/admin/quiz/create-quiz')) {
      return 'quiz/create-quiz';
    }  else if (pathname.includes('/admin/quiz/view-quiz')) {
      return 'quiz/view-quiz';
    } else if (pathname.includes('admin/quiz/template-quiz')) {
      return 'quiz/template-quiz';
    } else if (pathname.includes('/admin/users/trainee')) {
      return 'users/trainee';
    } else if (pathname.includes('/admin/users/view-teachers')) {
      return 'users/view-teachers';
    } else if (pathname.includes('/admin/users/view-users')) {
      return 'users/view-users';
    } else if (pathname.includes('/admin/users/view-role')) {
      return 'users/view-role';
    } else if (pathname.includes('/admin/category')) {
      return 'category';
    }
    return '1';
  };
  const [selectedKey, setSelectedKey] = useState(getCurrentKey(pathname));

  useEffect(() => {
    setSelectedKey(getCurrentKey(pathname));
  }, [pathname]);

  const menuItems = [
    {
      key: "courses",
      icon: <VideoCameraOutlined />,
      label: "Cuộc Thi",
    },
    {
      key: "2",
      icon: <FileAddOutlined />,
      label: "Đề Thi",
      children: [
        {
          key: "quiz/create-quiz",
          icon: <UserOutlined />,
          label: "Tạo đề thi",
        },
        {
          key: "quiz/view-quiz",
          icon: <UserOutlined />,
          label: "Xem đề thi",
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
        {/*<div className="flex-shrink-0 pb-4">*/}
        {/*  <a href="/">*/}
        {/*    <img*/}
        {/*      className="h-36 w-auto object-contain  absolute top-0 mt-[26px] transform -translate-y-1/2  fs-6 text-white text-decoration-none me-4"*/}
        {/*      style={{ left: "1rem", paddingLeft: "10px" }}*/}
        {/*      src={logo3}*/}
        {/*      alt=""*/}
        {/*    />*/}
        {/*  </a>*/}
        {/*</div>*/}
      </div>
      <Menu
        theme="dark"
        mode="inline"
        style={{ flex: 1 }}
        selectedKeys={[selectedKey]}
        onClick={({ key }) => {
          if (key === "quiz/bank-quiz") {
            showComingSoonModal();
          } else {
            router.push(`/admin/${key}`);
          }
        }}
        items={menuItems}
      />
    </Sider>
  );
}
