"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import "./globals.css";
import Header from "@/components/Header/Header";
import { usePathname } from "next/navigation";
import CustomFooter from "@/components/Footer/footer";
import AdminFooter from "@/components/AdminFooter/AdminFooter";
import AdminHeader from "@/components/AdminHeaeder/AdminHeader";
import AdminSidebar from "@/components/AdminSidebar/AdminSidebar";
import { Layout } from "antd";
import { Suspense, useState } from "react";
import { Providers } from "@/Provider";

export default function RootLayout({ children }) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const shouldRenderFooter = !pathname.includes("/web-rtc/room");
  return (
    <html lang="en">
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
                <div className={pathname.includes("/admin") && "p-3"}>
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
