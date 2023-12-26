import React from "react";
import { Button, Result } from "antd";
import Link from "next/link";
const PageUnauthorized = () => (
  <Result
    title="403"
    subTitle="Xin lỗi, bạn không có quyền truy cập vào trang này"
    extra={
      <Button type="default" >
        <Link href="/">Trang chủ</Link>
      </Button>
    }
  />
);
export default PageUnauthorized;
