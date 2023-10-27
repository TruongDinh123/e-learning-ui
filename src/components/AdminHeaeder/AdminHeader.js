import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Layout, Button } from "antd";
const { Header } = Layout;

const headerStyle = { padding: 0, background: "#fff" };

export default function AdminHeader(props) {
  const { setCollapsed, collapsed } = props;
  return (
    <Header style={headerStyle}>
      <Button
        type="text"
        icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
        onClick={() => setCollapsed(!collapsed)}
        style={{
          fontSize: "16px",
          width: 64,
          height: 64,
        }}
      />
    </Header>
  );
}
