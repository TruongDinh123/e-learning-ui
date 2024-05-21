'use client';
import {Button, Col, DatePicker, Form, Input, Upload} from 'antd';
import {UploadOutlined} from '@ant-design/icons';
import dynamic from 'next/dynamic';

import 'react-quill/dist/quill.snow.css';
import { memo } from 'react';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {ssr: false}
);

const EssayBlock = ({setFile, file, isLoading}) => {
  //props xử lý file
  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  return (
    <>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item
          label='Tên bài tập'
          name='name'
          rules={[
            {
              required: true,
              message: 'Vui lòng nhập tên bài tập.',
            },
          ]}
          className='w-full'
        >
          <Input placeholder='Tên bài' className='w-full' />
        </Form.Item>
      </Col>
      <Form.Item
        label='Tiêu đề'
        name='essayTitle'
        rules={[{required: true, message: 'Vui lòng nhập tiêu đề'}]}
      >
        <Input placeholder='Tiêu đề' />
      </Form.Item>

      <Form.Item name='essayContent'>
        <ReactQuill theme='snow' />
      </Form.Item>

      <Form.Item label='Thời hạn nộp' name='submissionTime'>
        <DatePicker
          showTime
          okButtonProps={{
            style: {backgroundColor: '#1890ff', color: '#fff'},
          }}
          disabledDate={(current) => {
            // Không cho phép chọn ngày trước ngày hiện tại
            let currentDate = new Date();
            currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
            return current && current.toDate() < currentDate;
          }}
        />
      </Form.Item>

      <Upload {...props}>
        <Button icon={<UploadOutlined />}>Thêm tệp</Button>
      </Upload>

      <div className='pt-2 text-end'>
        <Button
          type='primary'
          htmlType='submit'
          className='custom-button'
          loading={isLoading}
        >
          Lưu
        </Button>
      </div>
    </>
  );
};

export default memo(EssayBlock);
