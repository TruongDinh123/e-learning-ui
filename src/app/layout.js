"use client";
import "katex/dist/katex.min.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import { usePathname, useRouter } from "next/navigation";
import CustomFooter from "@/components/Footer/footer";
import AdminFooter from "@/components/AdminFooter/AdminFooter";
import AdminHeader from "@/components/AdminHeaeder/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import TeacherSidebar from "@/components/TeacherSidebar/TeacherSidebar";
import TeacherHeader from "@/components/TeacherHeader/TeacherHeader";
import { Layout, Spin, theme } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { isAdmin, isMentor } from "@/middleware";
import 'animate.css';
const logo = "/images/logoimg.jpg";

const Providers = dynamic(() => import("@/Provider"), { ssr: false });

const { Content, Footer, Header: HeaderTeacher } = Layout;

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const shouldRenderFooter = !pathname.includes("/web-rtc/room");

  useEffect(() => {
    setLoading(false);
  }, [pathname]);

  useEffect(() => {
    // Check if the cookie exists
    const token = Cookies.get("Bearer");

    // Ngay lập tức chuyển hướng nếu không phải Admin hoặc Mentor và cố gắng truy cập vào /admin/courses
    if (pathname === "/admin/courses" && !(isAdmin() || isMentor())) {
      router.push("/unauthorized");
      return; // Ngăn không chạy các đoạn mã phía dưới
    }

    const isLessonPage = pathname.startsWith("/courses/lessons/");
    const isCourseDetailnPage = pathname.startsWith(
      "/courses/view-course-details/"
    );

    if (!loading && !isLessonPage && !isCourseDetailnPage) {
      if (!token && pathname !== "/login" && pathname !== "/") {
        router.push("/login");
      } else if (pathname.includes("/admin") && !(isAdmin() || isMentor())) {
        router.push("/unauthorized");
      }
    }
    setLoading(false);
  }, [pathname]);

  return (
    <html>
      <body>
        <Providers>
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <Spin />
            </div>
          ) : (
            <Suspense fallback={<Spin size="large"></Spin>}>
              {pathname.includes("/teacher") ? (
                <Layout>
                  <React.Fragment>
                    {/* header teacher */}
                    {pathname.includes("/teacher") && <TeacherHeader />}
                    <Content
                      style={{
                        padding: "0 48px",
                        overflowY: "auto",
                      }}
                    >
                      <header
                        className="flex items-center space-x-4"
                        style={{
                          margin: "16px 0",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <img
                          src={logo}
                          className="h-24 w-24"
                          height="100"
                          style={{
                            aspectRatio: "100/100",
                            objectFit: "cover",
                          }}
                          width="100"
                        />
                        <h1 className="text-4xl font-bold text-center" style={{
                          color: "#13C57C"
                        }}>
                          Trung tâm khóa học Tường Ân
                        </h1>
                      </header>
                      <Layout
                        style={{
                          background: colorBgContainer,
                          borderRadius: borderRadiusLG,
                          maxHeight: "80%",
                          minHeight: "80%",
                        }}
                      >
                        <TeacherSidebar />
                        <Content
                          style={{
                            padding: "0 24px",
                            color: "white",
                            overflow: "auto",
                            background: "#E8EFF6",
                          }}
                        >
                          {children}
                        </Content>
                      </Layout>
                    </Content>
                    <Footer
                      style={{
                        textAlign: "center",
                        background: "#001529",
                        color: "white",
                      }}
                    >
                      © 2024 95EdTech From 95 Solutions Team
                    </Footer>
                  </React.Fragment>
                </Layout>
              ) : (
                <Layout>
                  {pathname.includes("/admin") && (
                    <AdminSidebar
                      collapsed={collapsed}
                      setCollapsed={setCollapsed}
                    />
                  )}
                  <Layout>
                    {!pathname.includes("/admin") && pathname !== "/login" && (
                      <Header />
                    )}
                    {pathname.includes("/admin") && (
                      <AdminHeader
                        setCollapsed={setCollapsed}
                        collapsed={collapsed}
                      />
                    )}

                    <div
                      className={pathname.includes("/admin") ? "" : "app"}
                      style={{
                        marginLeft: pathname.includes("/admin")
                          ? collapsed
                            ? ""
                            : "220px"
                          : "0",
                      }}
                    >
                      {children}
                    </div>
                    {shouldRenderFooter &&
                      (!pathname.includes("/admin") ? (
                        <CustomFooter />
                      ) : (
                        <AdminFooter sidebarCollapsed={!collapsed} />
                      ))}
                  </Layout>
                </Layout>
              )}
            </Suspense>
          )}
        </Providers>
      </body>
    </html>
  );
}
