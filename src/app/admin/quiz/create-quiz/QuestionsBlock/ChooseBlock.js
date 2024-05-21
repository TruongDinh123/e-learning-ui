'use client';
import {Button, Form, Input} from 'antd';
import {CloseOutlined} from '@ant-design/icons';
import 'react-quill/dist/quill.snow.css';

const ChooseBlock = ({form, field}) => {
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
                key={[subField.key, 'option']}
                rules={[
                  {
                    required: true,
                    message: 'Vui lòng nhập lựa chọn',
                  },
                ]}
                style={{
                  flex: 1,
                  marginRight: 8,
                }}
              >
                <Input.TextArea
                  placeholder='Lựa chọn'
                  autoSize={{
                    minRows: 1,
                    maxRows: 5,
                  }}
                  style={{width: '100%'}}
                  onChange={(e) => {
                    const updatedOptions = [
                      ...form.getFieldValue([
                        'questions',
                        field.name,
                        'options',
                      ]),
                    ];
                    updatedOptions[subIndex] = {
                      option: e.target.value,
                    };
                    const newQuestions = form
                      .getFieldValue('questions')
                      .map((q, qi) => {
                        if (qi === field.name) {
                          return {
                            ...q,
                            options: updatedOptions,
                            answer: '',
                          };
                        }
                        return q;
                      });

                    form.setFieldsValue({
                      questions: newQuestions,
                    });
                  }}
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

export default ChooseBlock;
