import { DownOutlined } from "@ant-design/icons";
import { Avatar, Dropdown, Layout, Menu } from "antd";

const { Header } = Layout;
const logo3 = "/images/logo5.png";

export default function TeacherHeader() {
  const menu = (
    <Menu>
      <Menu.Item key="0">
        <a href="/profile">Hồ sơ cá nhân</a>
      </Menu.Item>
      <Menu.Item key="1">
        <a href="/settings">Cài đặt</a>
      </Menu.Item>
      <Menu.Divider />
      <Menu.Item key="3">Đăng xuất</Menu.Item>
    </Menu>
  );
  return (
    <Header
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <img className="h-36 w-auto" src={logo3} alt="" />

      <div style={{ display: "flex", alignItems: "center" }}>
        <Avatar
          size={40}
          className="bg-white items-center justify-between"
          src={logo3}
        />
        <Dropdown overlay={menu} trigger={["hover"]} className="ml-3">
          <a className="ant-dropdown-link text-white" onClick={(e) => e.preventDefault()}>
            Tên Giáo Viên <DownOutlined />
          </a>
        </Dropdown>
      </div>
    </Header>
  );
}
