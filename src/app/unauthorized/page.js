import React from 'react';
import {Result} from 'antd';
import Link from 'next/link';

const PageUnauthorized = () => (
  <Result
    title='403'
    subTitle='Xin lỗi, bạn không có quyền truy cập vào trang này'
    style={{
      marginTop: '75px',
      height: '100%',
      position: 'relative',
      height: ' calc(100vh - 426px)',
    }}
    extra={<Link href='/'>Trang chủ</Link>}
  />
);

export default PageUnauthorized;
