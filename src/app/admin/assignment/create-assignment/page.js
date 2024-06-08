"use client";
import { Button, Card, Form, Input, message, Select, Space, Spin } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createAssignment } from "@/features/Assignment/assignmentSlice";

const { Option } = Select;

export default function AssignmentCreate() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]); // Danh sách khóa học
  const [isLoading, setIsLoading] = useState(false);
  const [form] = Form.useForm();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const dispatch = useDispatch();

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
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

  const handleSaveAssigment = (values) => {
    setLoading(true);
    const formattedValues = {
      ...values,
      courseId: selectedCourse,
      questions: values.questions.map((question) => ({
        ...question,
        options: question.options.map((option) => option.option),
      })),
    };

    dispatch(createAssignment({ formattedValues }))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            message.success(res.message, 1.5);
            router.push("/admin/assignment/view-assignment");
            setLoading(false);
          });
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
        setLoading(false);
      });
  };

  useEffect(() => {
    setIsLoading(true);

    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.metadata);
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        messageApi.error(error.response?.data?.message);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="me-3" style={{ paddingBottom: "100px" }}>
        <h1>Create Assignment</h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            name="quiz_form"
            initialValues={{
              questions: [{}],
            }}
            onFinish={handleSaveAssigment}
          >
            <div style={{ display: "flex" }}>
              <Select
                placeholder="Select a course"
                onChange={handleCourseChange}
                value={selectedCourse}
                style={{ marginRight: "10px" }}
              >
                {courses.map((course) => (
                  <Option key={course._id} value={course._id}>
                    {course.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Form.Item
              label="Assigment Name"
              name="name"
              rules={[
                { required: true, message: "Please enter the assignment name" },
              ]}
            >
              <Input placeholder="Assignment Name" />
            </Form.Item>
            <Form.Item
              label="Assigment Description"
              name="description"
              rules={[
                {
                  required: true,
                  message: "Please enter the assignment description",
                },
              ]}
            >
              <Input placeholder="Assigment Name" />
            </Form.Item>
            <Form.Item label="Time Limit" name="timeLimit">
              <Select placeholder="Select a time limit">
                <Option value={15}>15 minutes</Option>
                <Option value={30}>30 minutes</Option>
                <Option value={45}>45 minutes</Option>
                <Option value={null}>No limit</Option>
              </Select>
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
            <div className="pt-6 text-end">
              <Button
                type="primary"
                htmlType="submit"
                loading={loading}
                style={{
                  color: "#fff",
                  backgroundColor: "#1890ff",
                }}
              >
                Save Quiz
              </Button>
            </div>
          </Form>
        )}
      </div>
    </div>
  );
}
