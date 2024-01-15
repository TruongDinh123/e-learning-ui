import { getAUser, logOut, resetState } from "@/features/User/userSlice";
import {
  LockOutlined,
  LoginOutlined,
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

const { Header } = Layout;

const headerStyle = { padding: 0, background: "#fff" };

export default function AdminHeader(props) {
  const { setCollapsed, collapsed } = props;
  const userProfile = useSelector((state) => state.user.profile);
  const [data, setData] = useState(null);
  const userState = JSON.parse(localStorage.getItem("user"));
  const router = useRouter();

  const id = localStorage.getItem("x-client-id");
  const dispatch = useDispatch();

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
      .catch((error) => {
        
      });
  };

  const menu = (
    <Menu>
      <Menu.Item key="0">
        <UserOutlined />{" "}
        <Link href={"/admin/users/edit-user-form"}>Cập nhật thông tin</Link>
      </Menu.Item>
      <Menu.Item key="1">
        <LockOutlined />
        <Link href={"/admin/users/change-password"}> Đổi mật khẩu</Link>
      </Menu.Item>
    </Menu>
  );

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
            <Nav>
              {userState !== null ? (
                <>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => handleLogOut()}
                  >
                    <LoginOutlined className="h-6 w-6" title="Đăng xuất" />
                    <span className="sr-only">Đăng xuất</span>
                  </Button>
                </>
              ) : (
                <Link href="/login">
                  <span className="fs-6 text-dark text-decoration-none me-4 text-black">
                    Đăng nhập
                  </span>
                </Link>
              )}
            </Nav>

            <Dropdown overlay={menu} trigger={["click"]}>
              <Avatar
                className="ml-4 h-9 w-9"
                src={userProfile?.image_url || data?.image_url}
                alt="avatar"
              />
            </Dropdown>
          </div>
        </header>
      </div>
    </Header>
  );
}
