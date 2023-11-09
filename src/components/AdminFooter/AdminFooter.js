import { Footer } from "antd/es/layout/layout";
import React from "react";
import { useMediaQuery } from "react-responsive";

function AdminFooter() {
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  return (
    !isMobile && (
      <Footer
        style={{
          textAlign: "center",
          position: "fixed",
          bottom: "0",
          width: "100%",
          justifyContent: "center",
        }}
      >
        95Elearning {new Date().getFullYear()} created by 95IDEAL
      </Footer>
    )
  );
}

export default AdminFooter;
