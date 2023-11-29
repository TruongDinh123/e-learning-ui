"use client";
import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../comman/CustomBtn";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { resetState, setUser } from "@/features/User/userSlice";
import { Image, Tooltip } from "antd";
import "../Header/header.css";
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import React, { useCallback } from "react";

const logo = "/images/logo.jpg";

const UserLinks = () => (
  <React.Fragment>
    <Link href="/courses/view-course">
      <span className="fs-6 text-dark text-decoration-none me-4 nav-link">
        My Course
      </span>
    </Link>
    <Link href="/courses/view-score">
      <span className="fs-6 text-dark text-decoration-none me-4 nav-link">
        Score Quizs
      </span>
    </Link>
    <Link href="/web-rtc/lobby">
      <span className="fs-6 text-dark text-decoration-none me-4 nav-link">
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
      className="bg-gray-200 hover:bg-body-primary transition-colors duration-200"
      variant="light"
    >
      <Container fluid>
        <Navbar.Brand
          href="#home"
          className="d-flex align-items-center hover:text-blue-500 transition-colors duration-200"
        >
          <div style={{ maxWidth: "100px", height: "auto" }}>
            <Image src={logo} alt="Logo" layout="responsive" />
          </div>
          <Link href="/">
            <span className="fs-bold fs-3 text-dark text-decoration-none me-4 nav-link header-link hover:text-blue-500 transition-colors duration-200">
              95 E-learning
            </span>
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link href="/">
              <span className="fs-6 text-dark text-decoration-none me-4 nav-link selection:hover:text-blue-500">
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
                className="fs-6 text-dark text-decoration-none me-4 nav-link header-link"
                style={{ textAlign: "center" }}
              >
                {userState.metadata?.account?.lastName}
              </span>
            ) : (
              <span
                className="fs-6 text-dark text-decoration-none me-4 nav-link header-link"
                style={{ textAlign: "center" }}
              >
                Guest
              </span>
            )}
            {userState !== null ? (
              <Tooltip title="Logout">
                <CustomButton
                  title="Logout"
                  type="link"
                  className="text-dark"
                  onClick={logout}
                  icon={<LogoutOutlined />}
                />
              </Tooltip>
            ) : (
              <Tooltip title="Login">
                <Link href="/login" icon={<LoginOutlined />}>
                  <span className="fs-6 text-dark text-decoration-none me-4">
                    Login
                  </span>
                </Link>
              </Tooltip>
            )}

            {userState === null && (
              <Tooltip title="Sign up">
                <Link href="/signup" icon={<UserAddOutlined />}>
                  <span className="fs-6 text-dark text-decoration-none me-4">
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
