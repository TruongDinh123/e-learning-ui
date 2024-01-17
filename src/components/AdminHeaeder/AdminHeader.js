import { getAUser, logOut, resetState } from "@/features/User/userSlice";
import {
  LockOutlined,
  LoginOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Layout, Button, Avatar, Menu, Dropdown } from "antd";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Nav } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

const { Header } = Layout;

const headerStyle = { padding: 0, background: "#02354B" };

export default function AdminHeader(props) {
  const { setCollapsed, collapsed } = props;
  const userProfile = useSelector((state) => state.user.profile);
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userState = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  const id = localStorage.getItem("x-client-id");
  const dispatch = useDispatch();

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  useEffect(() => {
    getAUsereData();
  }, []);

  const getAUsereData = () => {
    dispatch(getAUser(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
        }
      })
      .catch((error) => {});
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <Link href={"/admin/users/edit-user-form"}>Cập nhật thông tin</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <Link href={"/admin/users/change-password"}> Đổi mật khẩu</Link>
      </Menu.Item>
      {userState !== null && (
        <Menu.Item onClick={() => handleLogOut()}>
          <span
            title="Logout"
            className="text-red-500"
            loading={isLoading}
            icon={<LogoutOutlined />}
          >
            Đăng xuất
          </span>
        </Menu.Item>
      )}
    </Menu>
  );

  const handleLogOut = () => {
    setIsLoading(true);
    dispatch(logOut())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          // Clear any local storage or cookies that might persist state
          localStorage.clear();
          Cookies.remove("Bearer");

          // Reset the Redux state
          dispatch(resetState());
          setIsLoading(false);
          // Redirect to the login page
          router.push("/login");
        } else {
          setIsLoading(false);
          message.error(res.message, 2.5);
        }
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  return (
    <Header style={headerStyle}>
      <div className="flex flex-col w-full overflow-x-hidden">
        <header className="w-full bg-white dark:bg-gray-800 border-b dark:border-gray-600 flex justify-between items-center px-6">
          <div className="flex">
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </div>
          <div className="flex items-center">
            {isMobile ? null : (
              <span>
                Xin chào, <a className="font-medium">{data?.firstName}</a>
              </span>
            )}
            {collapsed && isMobile ? (
              <span>
                Xin chào, <a className="font-medium">{data?.firstName}</a>
              </span>
            ) : null}

            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                className="ml-4 h-9 w-9"
                src={
                  userProfile?.image_url ||
                  data?.image_url ||
                  `https://xsgames.co/randomusers/avatar.php?g=pixel`
                }
                alt="avatar"
              />
            </Dropdown>
          </div>
        </header>
      </div>
    </Header>
  );
}
