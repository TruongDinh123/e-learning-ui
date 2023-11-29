"use client";
import {
  Input,
  Button,
  Form,
  Space,
  Card,
  message,
  Table,
  Typography,
  List,
  Collapse,
  Popconfirm,
} from "antd";
import { CloseOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { createQuiz, deleteQuizQuestion, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal } from "antd";
import UpdateQuiz from "../../edit-quiz/page";

export default function QuizCreator({ params }) {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [quiz, setquiz] = useState([]);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [form] = Form.useForm();

  const { Text } = Typography;
  const { Panel } = Collapse;

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

  const handleSaveQuiz = (values) => {
    const formattedValues = {
      ...values,
      questions: values.questions.map((question) => ({
        ...question,
        options: question.options.map((option) => option.option),
      })),
    };

    dispatch(createQuiz({ lessonId: params.id, formattedValues }))
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
            setUpdateQuiz(updateQuiz + 1);
            message.success(res.message, 1.5);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name Quiz",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Questions",
      dataIndex: "questions",
      onFilter: (value, record) => record.questions.indexOf(value) === 0,
      sorter: (a, b) => a.questions.length - b.questions.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  useEffect(() => {
    dispatch(viewQuiz({ lessonId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setquiz(res.metadata))
            .then(() => message.success(res.message, 1.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateQuiz]);

  let data = [];
  quiz?.forEach((i, index) => {
    const questions = i.questions.map((question) => (
      <Panel header={question.question} key={question._id}>
        <List
          dataSource={question.options}
          renderItem={(option, optionIndex) => (
            <List.Item>
              <Text>
                {optionIndex + 1}: {option}
              </Text>
            </List.Item>
          )}
        />
        <Text strong>Answer: {question.answer}</Text>
        <div className="mt-3">
          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() =>
              handleDeleteQuiz({
                quizId: i?._id,
                questionId: question?._id,
              })
            }
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      </Panel>
    ));

    data.push({
      key: index + 1,
      name: i?.name,
      questions: (
        <div>
          <Collapse accordion>{questions}</Collapse>
        </div>
      ),
      action: (
        <div>
          <UpdateQuiz
            quizId={i?._id}
            refresh={() => setUpdateQuiz(updateQuiz + 1)}
          />
        </div>
      ),
    });
  });

  const handleDeleteQuiz = ({ quizId, questionId }) => {
    dispatch(deleteQuizQuestion({ quizId, questionId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setUpdateQuiz(updateQuiz + 1))
            .then(() => message.success(res.message, 2.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      <div className="p-3">
        {contextHolder}
        <Button type="primary" onClick={showModal}>
          Create Quiz
        </Button>
        <Modal title="Create Quiz" open={isModalOpen} onCancel={handleCancel}>
          <Form
            form={form}
            name="quiz_form"
            initialValues={{
              questions: [{}],
            }}
            onFinish={handleSaveQuiz}
          >
            <Form.Item
              label="Quiz Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the quiz name" },
              ]}
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
                  <Button
                    type="dashed"
                    onClick={() => handleAddQuestion()}
                    block
                  >
                    + Add Question
                  </Button>
                </div>
              )}
            </Form.List>
            <div className="pt-2 text-end">
              <Button type="primary" htmlType="submit">
                Save Quiz
              </Button>
            </div>
          </Form>
        </Modal>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
