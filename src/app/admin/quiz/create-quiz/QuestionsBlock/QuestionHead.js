'use client';
import {Col, DatePicker, Form, Input, Row, Grid, InputNumber} from 'antd';
import 'react-quill/dist/quill.snow.css';
import {memo} from 'react';

const QuestionHead = ({isTemplateMode}) => {
  const {useBreakpoint} = Grid;
  const screens = useBreakpoint();
  const datePickerPlacement = screens.xs ? 'bottomRight' : 'bottomLeft';

  return (
    <Row utter={{xs: 8, sm: 16, md: 24, lg: 32}}>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item label='Tên bài tập' name='name' className='w-full' required>
          <Input placeholder='Nhập tên bài tập' className='w-full' />
        </Form.Item>
      </Col>
      {!isTemplateMode && (
        <>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item
              label='Thời hạn nộp'
              name='submissionTime'
              className='px-2'
              rules={[
                {
                  required: true,
                  message: 'Please enter a question',
                },
              ]}
            >
              <DatePicker
                showTime
                style={{width: '100%'}}
                placement={datePickerPlacement}
                disabledDate={(current) => {
                  // Không cho phép chọn ngày trước ngày hiện tại
                  let currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                  return current && current.toDate() < currentDate;
                }}
              />
            </Form.Item>
          </Col>
          <Col xs={24} sm={12} md={8} lg={6}>
            <Form.Item name='timeLimit' label='Thời gian làm bài (phút)'>
              <InputNumber min={1} placeholder='Nhập thời gian làm bài' />
            </Form.Item>
          </Col>
        </>
      )}
    </Row>
  );
};

export default memo(QuestionHead);
