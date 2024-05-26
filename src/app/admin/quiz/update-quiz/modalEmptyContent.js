'use client';
import {
  Form,
  Input,
  Button,
  Upload,
} from 'antd';
import React, {memo} from 'react';
import { UploadOutlined} from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';
import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';

const ReactQuill = dynamic(
  () => import('react-quill').then((mod) => mod.default),
  {ssr: false}
);

const ModalEmptyContent = ({file, quiz, quizToUpdate, setFile}) => {
  const propUpdateEssay = {
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
      {quiz?.essay?.attachment && (
        <div>
          <a href={quizToUpdate.essay.attachment} download>
            Download Attachment
          </a>
        </div>
      )}
      <Upload {...propUpdateEssay}>
        <Button icon={<UploadOutlined />}>Select File</Button>
      </Upload>
    </>
  );
};

export default memo(ModalEmptyContent);
