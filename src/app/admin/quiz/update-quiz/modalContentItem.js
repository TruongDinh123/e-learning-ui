'use client';
import {Card, Form, Input, Button, Upload, Image} from 'antd';
import React, {useEffect, useRef} from 'react';
import {CloseOutlined, UploadOutlined} from '@ant-design/icons';

import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import Editor from '@/config/quillConfig';

const htmlToJson = (html) => {
  return JSON.stringify(html);
};

const ModalContentItem = ({
  form,
  field,
  index,
  fileQuestion,
  setFileQuestion,
  setQuestionImages,
  fields,
  setContainEl
}) => {
  const containBlock = useRef(null);
  const propsQuestion = {
    onRemove: () => {
      setFileQuestion(null);
    },
    beforeUpload: (file) => {
      setFileQuestion(file);
      return false;
    },
    fileList: fileQuestion ? [fileQuestion] : [],
    accept: '.jpg, .jpeg, .png',
  };

  const handleRemoveQuestion = (index) => {
    const questions = form.getFieldValue('questions') || [];
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    form.setFieldsValue({questions: newQuestions});
  };

  const handleImageUpload = (event, index) => {
    setQuestionImages((prevState) => {
      const newState = [...prevState];
      newState[index] = fileQuestion;
      return newState;
    });
  };

  useEffect(() => {
    if(fields && fields.length - 1 === index) {
      setContainEl(containBlock)
    }
  }, [fields, index, setContainEl])
  
  return (
    <Card
      key={field.key}
      title={`Question ${index + 1}`}
      className=' mt-2'
      extra={<Button onClick={() => handleRemoveQuestion(index)}>Xóa</Button>}
      ref={containBlock}
    >
      <Form.Item
        label='Câu hỏi'
        name={[field.name, 'question']}
        rules={[
          {
            required: true,
            message: 'Hãy nhập câu hỏi',
          },
        ]}
      >
        <Editor
          placeholder='Nhập câu hỏi tại đây'
          value={form.getFieldValue(['questions', field.name, 'question'])}
          onChange={(html) => {
            const jsonValue = htmlToJson(html);
            form.setFieldValue({
              [field.name]: {question: jsonValue},
            });
          }}
        />
      </Form.Item>
      <Form.Item label='Hình ảnh' name={[field.name, 'image']}>
        <Upload
          {...propsQuestion}
          onChange={(event) => handleImageUpload(event, index)}
        >
          <Button
            className='custom-button'
            type='primary'
            icon={<UploadOutlined />}
          >
            Thêm tệp
          </Button>
        </Upload>
        {form.getFieldValue(['questions', index, 'image']) && (
          <Image
            src={form.getFieldValue(['questions', index, 'image'])}
            alt={`Question ${index + 1}`}
            className='max-w-auto h-40'
            style={{
              maxWidth: '50%'
            }}
            />
        )}
      </Form.Item>
      <Form.List name={[field.name, 'options']}>
        {(subFields, {add, remove}) => (
          <div>
            {subFields.map((subField, subIndex) => (
              <div
                key={subField.key}
                style={{
                  display: 'flex',
                  marginBottom: 8,
                  alignItems: 'center',
                }}
              >
                <Form.Item
                  {...subField}
                  name={[subField.name, 'option']}
                  fieldKey={[subField.fieldKey, 'option']}
                  rules={[
                    {
                      required: true,
                      message: 'Vui lòng nhập lựa chọn',
                    },
                  ]}
                  style={{flex: 1, marginRight: 8}}
                >
                  <Input.TextArea
                    placeholder='Lựa chọn'
                    autoSize={{
                      minRows: 1,
                      maxRows: 5,
                    }}
                    style={{width: '100%'}}
                  />
                </Form.Item>
                <CloseOutlined
                  onClick={() => remove(subIndex)}
                  style={{
                    color: 'red',
                    cursor: 'pointer',
                    fontSize: '16px',
                    marginBottom: 8,
                    alignSelf: 'center',
                  }}
                />
              </div>
            ))}
            <Button type='dashed' onClick={() => add()} block>
              + Thêm lựa chọn
            </Button>
          </div>
        )}
      </Form.List>
      <Form.Item
        label='Đáp án'
        name={[field.name, 'answer']}
        className='mt-2'
        rules={[
          {
            required: true,
            message: 'Hãy nhập đáp án',
          },
        ]}
      >
        <Input placeholder='Đáp án' />
      </Form.Item>
    </Card>
  );
};

export default ModalContentItem;
