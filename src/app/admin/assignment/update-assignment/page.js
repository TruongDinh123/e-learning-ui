"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Card, Form, Input, Modal, message, Button, Space } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CloseOutlined } from "@ant-design/icons";
import {
  updateAssignment,
  viewAssignmentByCourseId,
} from "@/features/Assignment/assignmentSlice";
import { useRouter } from "next/navigation";

export default function UpdateAssignment(props) {
  const { assignmentId, courseId, questionId, refresh } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setquiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
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
    setIsLoading(true);
    const formattedValues = {
      ...values,
      questions: values.questions.map((question) => {
        if (question._id === questionId) {
          return {
            _id: question._id,
            ...question,
            options: question.options.map((option) => option.option),
          };
        }
        return question;
      }),
    };
    dispatch(updateAssignment({ assignmentId: assignmentId, formattedValues }))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "success",
            content: "Action in progress...",
            duration: 2.5,
          })
          .then(() => {
            setIsModalOpen(false);
            message.success(res.message, 1.5);
            router.push(`/admin/assignment/view-list-assignment/${courseId}`);
            refresh();
          });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (quiz.length > 0) {
      const questionToUpdate = quiz[0].questions?.find(
        (question) => question._id === questionId
      );
      if (questionToUpdate) {
        const formattedQuestion = {
          _id: questionToUpdate._id,
          question: questionToUpdate.question,
          answer: questionToUpdate.answer,
          options: questionToUpdate.options.map((option) => ({ option })),
        };
        form.setFieldsValue({ questions: [formattedQuestion] });
      }
    }
  }, [quiz]);

  useEffect(() => {
    dispatch(viewAssignmentByCourseId({ courseId: courseId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
          form.setFieldsValue({ name: res.metadata[0].name });
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{ color: "#fff", backgroundColor: "#1890ff" }}
      >
        Update
      </Button>
      <Modal
        title="Update Assignment"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[<></>]}
      >
        <Form
          form={form}
          name="assignment_form"
          initialValues={{
            questions: [{}],
          }}
          onFinish={handleUpdateQuiz}
        >
          <Form.Item
            label="Assignment Name"
            name="name"
            rules={[
              { required: true, message: "Please enter the assignment name" },
            ]}
          >
            <Input placeholder="Assignment Name" />
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
              loading={isLoading}
            >
              Save Assignment
            </Button>
          </div>
        </Form>
      </Modal>
    </React.Fragment>
  );
}
