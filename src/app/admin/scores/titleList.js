import {Col, Row, Typography} from 'antd';
import { memo } from 'react';
const { Title } = Typography;

const TitleList = () => {
  return (
    <Row style={{width: '100%'}}>
      <Col span={6}><Title level={5} >Tên bài Kiểm tra</Title></Col>
      <Col span={4}><Title level={5} >Họ và tên</Title></Col>
      <Col span={8}><Title level={5} >Thông tin</Title></Col>
      <Col span={2}><Title level={5} >Số Điểm</Title></Col>
      <Col span={4}><Title level={5} >Thời gian hoàn thành</Title></Col>
    </Row>
  );
};

export default memo(TitleList);
