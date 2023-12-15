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

  const shouldRenderFooter = !pathname.includes("/web-rtc/room");

  useEffect(() => {
    // Check if the cookie exists
    const token = localStorage.getItem('authorization');
    if (!token && pathname !== '/login') {
      // If the cookie doesn't exist and the user is not on the login page, redirect to the login page
      router.push('/login');
    }
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
                {!pathname.includes("/admin") && pathname !== "/login" ? (
                  <Header />
                ) : pathname === "/login" ? (
                  <Header />
                ) : (
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
