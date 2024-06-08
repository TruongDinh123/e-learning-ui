'use client';
import {Form, Input, Button, InputNumber} from 'antd';
import React, { useState} from 'react';

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import ModalContentItem from './modalContentItem';

const ModalContent = ({
  form,
  fileQuestion,
  setFileQuestion,
  setQuestionImages,
}) => {
  const [containEl, setContainEl] = useState(null);

  const handleAddQuestion = (e) => {
    e.stopPropagation();

    const questions = form.getFieldValue('questions') || [];
    const newQuestions = [...questions, {}];
    form.setFieldsValue({questions: newQuestions});

    containEl.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
      inline: 'nearest',
    });
  };
  return (
    <>
      <Form.Item name='timeLimit' label='Thời gian làm bài (phút)'>
        <InputNumber min={1} placeholder='Nhập thời gian làm bài' />
      </Form.Item>

      <Form.Item
        label='Tên bài tập'
        name='name'
        rules={[{required: true, message: 'Hãy nhập tên bài'}]}
      >
        <Input placeholder='Tên bài tập' />
      </Form.Item>
      <Form.List name='questions'>
        {(fields, {add, remove}) => (
          <div
            className='overflow-auto scrollbar scrollbar-thin'
            style={{
              height: '34rem',
            }}
          >
            {fields.map((field, index) => (
              <ModalContentItem
                key={index}
                fields={fields}
                setContainEl={setContainEl}
                form={form}
                field={field}
                index={index}
                fileQuestion={fileQuestion}
                setFileQuestion={setFileQuestion}
                setQuestionImages={setQuestionImages}
              />
            ))}
            <Button
              className='bg-orange-200 mt-2'
              type='dashed'
              onClick={handleAddQuestion}
              style={{
                position: 'sticky',
                bottom: 0,
              }}
              block
            >
              + Thêm câu hỏi
            </Button>
          </div>
        )}
      </Form.List>
    </>
  );
};

export default ModalContent;
