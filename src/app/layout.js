"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import { usePathname, useRouter } from "next/navigation";
import CustomFooter from "@/components/Footer/footer";
import AdminFooter from "@/components/AdminFooter/AdminFooter";
import AdminHeader from "@/components/AdminHeaeder/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import { Layout } from "antd";
import React, { Suspense, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import Cookies from "js-cookie";
// import { Providers } from "@/Provider";

const Providers = dynamic(() => import("@/Provider"), { ssr: false });

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [loading, setLoading] = useState(true);

  const shouldRenderFooter = !pathname.includes("/web-rtc/room");

  useEffect(() => {
    // Check if the cookie exists
    const token = Cookies.get("Bearer");
    const user = JSON.parse(localStorage.getItem("user")); // Giả sử bạn lưu thông tin người dùng vào localStorage
    const isAdmin = user?.metadata?.account?.roles?.includes("Admin");
    const isMentor = user?.metadata?.account?.roles?.includes("Mentor");

    // Ngay lập tức chuyển hướng nếu không phải Admin hoặc Mentor và cố gắng truy cập vào /admin/courses
    if (pathname === "/admin/courses" && !(isAdmin || isMentor)) {
      router.push("/unauthorized");
      return; // Ngăn không chạy các đoạn mã phía dưới
    }

    if (!loading) {
      if (!token && pathname !== "/login") {
        router.push("/login");
      } else if (pathname.includes("/admin") && !(isAdmin || isMentor)) {
        router.push("/unauthorized");
      }
    }
    setLoading(false);
  }, [pathname]);

  return (
    <html>
      <body>
        <Providers>
          <Suspense fallback={<p>Loading..</p>}>
            <Layout>
              {pathname.includes("/admin") && (
                <AdminSidebar collapsed={collapsed} />
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
                  className={pathname.includes("/admin") ? "p-3" : undefined}
                >
                  {children}
                </div>
                {shouldRenderFooter &&
                  (!pathname.includes("/admin") && pathname !== "/login" ? (
                    <CustomFooter />
                  ) : (
                    <AdminFooter />
                  ))}
              </Layout>
            </Layout>
          </Suspense>
        </Providers>
      </body>
    </html>
  );
}
