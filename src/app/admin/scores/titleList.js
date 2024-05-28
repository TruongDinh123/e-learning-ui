import {Col, Row} from 'antd';
import { memo } from 'react';

const TitleList = () => {
  return (
    <Row style={{width: '100%'}}>
      <Col span={6}>Họ và tên</Col>
      <Col span={8}>Thông tin</Col>
      <Col span={2}>Số Điểm</Col>
      <Col span={8}>Thời gian hoàn thành</Col>
    </Row>
  );
};

export default memo(TitleList);
