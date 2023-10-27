import { Layout } from "antd";
const { Footer } = Layout;
export default function AdminFooter() {
  return (
    <Footer
      style={{
        textAlign: "center",
        position: "fixed",
        bottom: "0",
        right: "0",
      }}
    >
      95 IDeal Elearning {new Date().getFullYear} Created by Định
    </Footer>
  );
}
