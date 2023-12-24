"use client";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/navigation";
import { resetState, setUser } from "@/features/User/userSlice";
import { Col, Row, Tooltip } from "antd";
import "../Header/header.css";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useCallback } from "react";
import { Image, Navbar } from "react-bootstrap";
import Cookies from "js-cookie";

const logo = "/images/logo.jpg";
const logo2 = "/images/logo-svg.svg";
const logo3 = "/images/logo3.png";

const UserLinks = () => {
  const userState = useSelector((state) => state?.user?.user);

  return (
    <React.Fragment>
      <Link href="/courses/view-course">
        <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
          Khóa học của tôi
        </span>
      </Link>
      <Link href="/courses/view-score">
        <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
          Điểm của tôi
        </span>
      </Link>
      <Link href="/web-rtc/lobby">
        <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
          Tạo phòng họp
        </span>
      </Link>
      {(userState?.metadata?.account?.roles.includes("Admin") ||
        userState?.metadata?.account?.roles.includes("Mentor")) && (
        <Link href="/admin/courses/view-courses">
          <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
            Admin
          </span>
        </Link>
      )}
    </React.Fragment>
  );
};

export default function Header() {
  const userState = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    router.push("/login");
    localStorage.clear();
    Cookies.remove("Bearer");
    dispatch(resetState());
    dispatch(setUser(null));
  }, [dispatch, router]);

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      // className="bg-gray-200 hover:bg-body-primary transition-colors duration-200"
      variant="light"
      className="flex items-center justify-between flex-wrap bg-white shadow border-solid border-t-2 border-blue-700 p-4"
    >
      <Container fluid>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={8} xl={6}>
            <div class="mr-auto md:w-36 flex-shrink-0 mt-4">
              <Image src={logo3} alt="Logo" className=" hidden sm:block" />
            </div>
          </Col>
          <Col className="gutter-row" xs={24} sm={24} md={12} lg={16} xl={18}>
            <Navbar.Brand className="flex flex-wrap justify-between items-center mx-auto max-w-screen-xl">
              <Navbar.Toggle
                aria-controls="responsive-navbar-nav"
                className="flex items-center px-3 py-2 border-2 rounded text-blue-700 border-blue-700 hover:text-blue-700 hover:border-blue-700"
              />
            </Navbar.Brand>
          </Col>
        </Row>

        <Navbar.Collapse
          id="responsive-navbar-nav"
          className="menu w-full lg:block flex-grow lg:items-center lg:w-auto lg:px-3 px-8"
        >
          <Nav className="text-md font-bold text-blue-700 lg:flex-grow">
            <Link href="/">
              <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                Trang chủ
              </span>
            </Link>
            {userState && <UserLinks />}
          </Nav>
          <Nav
            style={{
              display: "flex",
              justifyContent: "center",
            }}
            id="responsive-navbar-nav"
            className="text-md font-bold text-blue-700 lg:flex-grow"
          >
            <React.Fragment>
              <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                {userState?.metadata?.account?.lastName}
              </span>
              {userState !== null ? (
                <Tooltip title="Logout">
                  <span
                    title="Logout"
                    onClick={logout}
                    icon={<LogoutOutlined />}
                    className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2"
                  >
                    Đăng xuất
                  </span>
                </Tooltip>
              ) : (
                <Tooltip title="Login">
                  <Link href="/login" icon={<LoginOutlined />}>
                    <span className="cursor-pointer block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
                      Đăng nhập
                    </span>
                  </Link>
                </Tooltip>
              )}
            </React.Fragment>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
