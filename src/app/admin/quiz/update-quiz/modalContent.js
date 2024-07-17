'use client';
import {Form, Input, InputNumber} from 'antd';
import React, {useState} from 'react';

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import ModalContentListItem from './modalContentListItem';

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
  console.log(form, 'glkjasdf');
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
      <ModalContentListItem
        form={form}
        setContainEl={setContainEl}
        fileQuestion={fileQuestion}
        setFileQuestion={setFileQuestion}
        setQuestionImages={setQuestionImages}
        handleAddQuestion={handleAddQuestion}
      />
    </>
  );
};

export default ModalContent;
