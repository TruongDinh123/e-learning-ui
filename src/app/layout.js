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
import TeacherHeader from "@/components/TeacherHeader/TeacherHeader";
import { Button, Layout, Spin, theme } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
import { isAdmin, isMentor } from "@/middleware";
import "animate.css";
import SiderCustom from "@/components/CustomSidebar/CustomSider";
import InfoCourse from "./courses/view-course-details/[id]/info/page";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";

const Providers = dynamic(() => import("@/Provider"), { ssr: false });

const { Content, Footer } = Layout;

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
      if (!token && pathname !== "/login" && pathname !== "/" && pathname !== "/signup" && !pathname.startsWith("/user/exem-online")) {
        router.push("/login");
      } else if (pathname.includes("/admin") && !(isAdmin() || isMentor())) {
        router.push("/unauthorized");
      } else if (token && pathname === "/login") {
        router.push("/");
      }
    }
    setLoading(false);
  }, [pathname, loading]);

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
              {pathname.includes("/courses/view-course-details") ||
              pathname.includes("/teacher") ? (
                <Layout>
                  <React.Fragment>
                    {/* header teacher */}
                    {pathname.includes("/teacher") && <TeacherHeader />}
                    {!pathname.includes("/admin") && pathname !== "/login"  &&   pathname !== "/signup" &&(
                      <Header />
                    )}
                    <Content
                      className={`${
                        pathname.includes("/teacher") ? "px-12" : "py-16 px-12"
                      } overflow-y-auto sm:py-0 sm:px-6 lg:py-16 lg:px-12`}
                      // style={{
                      //   padding: pathname.includes("/teacher")
                      //     ? "0 48px"
                      //     : "64px 48px",
                      //   overflowY: "auto",
                      // }}
                    >
                      <InfoCourse />
                      <Button
                        type="text"
                        icon={
                          collapsed ? (
                            <MenuUnfoldOutlined />
                          ) : (
                            <MenuFoldOutlined />
                          )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        className="lg:hidden text-base w-16 h-16"
                      />
                      <Layout
                        style={{
                          background: colorBgContainer,
                          borderRadius: borderRadiusLG,
                          maxHeight: "80%",
                          minHeight: "80%",
                        }}
                      >
                        <SiderCustom
                          collapsed={collapsed}
                          setCollapsed={setCollapsed}
                        />
                        <Content className="p-6 text-white overflow-auto bg-[#E8EFF6] sm:p-3 lg:p-6">
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
                      © 2024 95IDEAL TECHNOLOGY BENTRE (version 1.7)
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
                    {!pathname.includes("/admin") &&
                      !pathname.includes("/user/exem-online") &&
                        pathname !== "/signup" &&
                      pathname !== "/login" && <Header />}
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
