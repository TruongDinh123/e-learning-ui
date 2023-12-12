"use client";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../comman/CustomBtn";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { resetState, setUser } from "@/features/User/userSlice";
import { Button, Col, Row, Tooltip } from "antd";
import "../Header/header.css";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import React, { useCallback } from "react";
import { Image, Navbar } from "react-bootstrap";

const logo = "/images/logo.jpg";
const logo2 = "/images/logo-svg.svg";
const logo3 = "/images/logo3.png";

const UserLinks = () => (
  <React.Fragment>
    <Link href="/courses/view-course">
      <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
        My Course
      </span>
    </Link>
    <Link href="/courses/view-score">
      <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
        Score Quizs
      </span>
    </Link>
    <Link href="/web-rtc/lobby">
      <span className="block mt-4 lg:inline-block lg:mt-0 hover:text-white px-4 py-2 rounded hover:bg-blue-700 mr-2">
        Create Room
      </span>
    </Link>
  </React.Fragment>
);

export default function Header() {
  const userState = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const dispatch = useDispatch();

  const logout = useCallback(() => {
    localStorage.clear();
    Cookies.remove("Bearer");
    dispatch(resetState());
    dispatch(setUser(null));
    router.push("/login");
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
                Home
              </span>
            </Link>
            {userState && <UserLinks />}
          </Nav>
          <Nav
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {userState ? (
              <span
                className="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0"
                style={{ textAlign: "center" }}
              >
                {userState.metadata?.account?.lastName}
              </span>
            ) : (
              <span
                className="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0"
                style={{ textAlign: "center" }}
              >
                Guest
              </span>
            )}
            {userState !== null ? (
              <Tooltip title="Logout">
                <span
                  title="Logout"
                  onClick={logout}
                  icon={<LogoutOutlined />}
                  className="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0"
                >
                  Logout
                </span>
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <Link href="/login" icon={<LoginOutlined />}>
                  <span className="block text-md px-4 ml-2 py-2 rounded text-blue-700 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">
                    Login
                  </span>
                </Link>
              </Tooltip>
            )}

            {userState === null && (
              <Tooltip title="Sign up">
                <Link href="/signup" icon={<UserAddOutlined />}>
                  <span className="block text-md px-4 py-2 rounded text-blue-700 ml-2 font-bold hover:text-white mt-4 hover:bg-blue-700 lg:mt-0">
                    Sign up
                  </span>
                </Link>
              </Tooltip>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
