'use client';
import {Form, Button} from 'antd';
import React from 'react';

import ModalContentItem from './modalContentItem';

const ModalContentListItem = ({
  form,
  setContainEl,
  fileQuestion,
  setFileQuestion,
  setQuestionImages,
  handleAddQuestion,
}) => {
  return (
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
  );
};

export default ModalContentListItem;
