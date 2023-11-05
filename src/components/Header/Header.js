"use client";

import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { useDispatch, useSelector } from "react-redux";
import CustomButton from "../comman/CustomBtn";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";
import { resetState } from "@/features/User/userSlice";

export default function Header() {
  const userState = useSelector((state) => state?.user?.user);
  const router = useRouter();
  const dispatch = useDispatch();

  return (
    <Navbar
      collapseOnSelect
      expand="lg"
      className="bg-body-tertiary"
      variant="light"
    >
      <Container fluid>
        <Navbar.Brand href="#home" className="d-flex align-items-center">
          <Link
            className="fs-bold fs-3 text-dark text-decoration-none me-4"
            href="/"
          >
            95 E-learning
          </Link>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Link
              className="fs-6 text-dark text-decoration-none me-4"
              href="#Home"
            >
              Home
            </Link>
            <Link
              className="fs-6 text-dark text-decoration-none me-4"
              href="/courses/view-course"
            >
              My Course
            </Link>
            <Link
              className="fs-6 text-dark text-decoration-none me-4"
              href="/courses/view-score"
            >
              Score Quiz
            </Link>
          </Nav>
          <Nav>
            {userState !== null ? (
              <CustomButton
                title="Logout"
                type="link"
                className="text-dark"
                onClick={() => {
                  localStorage.clear();
                  Cookies.remove("Bearer");
                  dispatch(resetState());
                  router.push("/login");
                }}
              />
            ) : (
              <Link
                className="fs-6 text-dark text-decoration-none me-4"
                href="/login"
              >
                Login
              </Link>
            )}

            {userState === null && (
              <Link
                className="fs-6 text-dark text-decoration-none me-4"
                eventKey={2}
                href="/signup"
              >
                Sign up
              </Link>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}
