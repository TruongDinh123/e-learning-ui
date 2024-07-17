'use client';
import {Form, Input, Button} from 'antd';
import React from 'react';
import {CloseOutlined} from '@ant-design/icons';

const AddListItemBlock = ({field}) => {
  return (
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
  );
};

export default AddListItemBlock;
