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
import {
  LogoutOutlined,
  LoginOutlined,
  UserAddOutlined,
} from "@ant-design/icons";
import { useCallback } from "react";
import "../Header/Header.css";

const logo = "/images/logo.jpg";

const UserLinks = () => (
  <>
    <Link
      className="fs-6 text-dark text-decoration-none me-4 nav-link"
      href="/courses/view-course"
    >
      My Course
    </Link>
    <Link
      className="fs-6 text-dark text-decoration-none me-4 nav-link"
      href="/courses/view-score"
    >
      Score Quiz
    </Link>
    <Link
      className="fs-6 text-dark text-decoration-none me-4 nav-link"
      href="/web-rtc/lobby"
    >
      Create Room
    </Link>
  </>
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
        <Navbar.Brand href="#home" className="d-flex align-items-center hover:text-blue-500 transition-colors duration-200">
          <div style={{ maxWidth: "100px", height: "auto" }}>
            <Image src={logo} alt="Logo" layout="responsive" />
          </div>
          <Link
            className="fs-bold fs-3 text-dark text-decoration-none me-4 nav-link header-link hover:text-blue-500 transition-colors duration-200"
            href="/"
          >
            95 E-learning
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link
              className="fs-6 text-dark text-decoration-none me-4 nav-link selection:hover:text-blue-500"
              href="/"
            >
              Home
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
                <Link
                  className="fs-6 text-dark text-decoration-none me-4"
                  href="/login"
                  icon={<LoginOutlined />}
                >
                  Login
                </Link>
              </Tooltip>
            )}

            {userState === null && (
              <Tooltip title="Sign up">
                <Link
                  className="fs-6 text-dark text-decoration-none me-4"
                  eventKey={2}
                  href="/signup"
                  icon={<UserAddOutlined />}
                >
                  Sign up
                </Link>
              </Tooltip>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}