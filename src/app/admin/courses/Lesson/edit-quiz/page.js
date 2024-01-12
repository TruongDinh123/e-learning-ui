"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Card, Form, Input, Modal, message, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { CloseOutlined } from "@ant-design/icons";

export default function UpdateQuiz(props) {
  const { quizId, lessonId, refresh } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setquiz] = useState([]);

  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddQuestion = () => {
    const questions = form.getFieldValue("questions") || [];
    const newQuestions = [...questions, {}];
    form.setFieldsValue({ questions: newQuestions });
  };

  const handleRemoveQuestion = (index) => {
    const questions = form.getFieldValue("questions") || [];
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    form.setFieldsValue({ questions: newQuestions });
  };

  const handleUpdateQuiz = (values) => {
    const formattedValues = {
      ...values,
      questions: values.questions.map((question) => ({
        ...question,
        options: question.options.map((option) => option.option),
      })),
    };

    dispatch(updateQuiz({ quizId: quizId, formattedValues }))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            setIsModalOpen(false);
            message.success(res.message, 1.5);
            refresh();
          });
      })
      .catch((error) => {});
  };

  useEffect(() => {
    if (quiz.length > 0) {
      const formattedQuiz = {
        name: quiz[0].name,
        questions: quiz[0].questions.map((question) => ({
          question: question.question,
          answer: question.answer,
          options: question.options.map((option) => ({ option })),
        })),
      };
      form.setFieldsValue(formattedQuiz);
    }
  }, [quiz]);

  useEffect(() => {
    dispatch(viewQuiz({ lessonId: lessonId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
        } else {
        }
      })
      .catch((error) => {});
  }, []);

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3 bg-blue-900 hover:bg-blue-400 "
        style={{ color: "#fff", backgroundColor: "#1890ff" }}
      >
        update quiz
      </Button>
      <Modal
        title="Update Quiz"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[<></>]}
      >
        <Form
          form={form}
          name="quiz_form"
          initialValues={{
            questions: [{}],
          }}
          onFinish={handleUpdateQuiz}
        >
          <Form.Item
            label="Quiz Name"
            name="name"
            rules={[{ required: true, message: "Please enter the quiz name" }]}
          >
            <Input placeholder="Quiz Name" />
          </Form.Item>
          <Form.List name="questions">
            {(fields, { add, remove }) => (
              <div>
                {fields.map((field, index) => (
                  <Card
                    key={field.key}
                    title={`Question ${index + 1}`}
                    extra={
                      <Button onClick={() => handleRemoveQuestion(index)}>
                        Remove
                      </Button>
                    }
                  >
                    <Form.Item
                      label="Question"
                      name={[field.name, "question"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter a question",
                        },
                      ]}
                    >
                      <Input placeholder="Question" />
                    </Form.Item>
                    <Form.List name={[field.name, "options"]}>
                      {(subFields, subMeta) => (
                        <div>
                          {subFields.map((subField, subIndex) => (
                            <Space key={subField.key}>
                              <Form.Item
                                noStyle
                                name={[subField.name, "option"]}
                                rules={[
                                  {
                                    required: true,
                                    message: "Please enter an option",
                                  },
                                ]}
                              >
                                <Input placeholder="Option" />
                              </Form.Item>
                              <CloseOutlined
                                onClick={() => subMeta.remove(subIndex)}
                              />
                            </Space>
                          ))}
                          <Button
                            type="dashed"
                            onClick={() => subMeta.add()}
                            block
                          >
                            + Add Option
                          </Button>
                        </div>
                      )}
                    </Form.List>
                    <Form.Item
                      label="Answer"
                      name={[field.name, "answer"]}
                      rules={[
                        {
                          required: true,
                          message: "Please enter the answer",
                        },
                      ]}
                    >
                      <Input placeholder="Answer" />
                    </Form.Item>
                  </Card>
                ))}
                <Button type="dashed" onClick={() => handleAddQuestion()} block>
                  + Add Question
                </Button>
              </div>
            )}
          </Form.List>
          <div className="pt-2 text-end">
            <Button
              type="primary"
              htmlType="submit"
              style={{ color: "#fff", backgroundColor: "#1890ff" }}
            >
              Save Quiz
            </Button>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
