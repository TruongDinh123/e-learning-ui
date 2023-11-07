"use client";
import { Button, Card, Form, Input, message, Select, Space } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import { createQuiz } from "@/features/Quiz/quizSlice";
import { CloseOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";

const { Option } = Select;

export default function QuizCreator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courses, setCourses] = useState([]); // Danh sách khóa học
  const [selectedCourseLessons, setSelectedCourseLessons] = useState([]);
  const [form] = Form.useForm();
  const router = useRouter();

  const dispatch = useDispatch();

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
    setSelectedCourseLessons(selectedCourse?.lessons || []);
  };

  // Hàm xử lý khi chọn bài học
  const handleLessonChange = (value) => {
    setSelectedLesson(value);
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

    dispatch(createQuiz({ lessonId: selectedLesson, formattedValues }))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "success",
            content: "Action in progress...",
            duration: 2.5,
          })
          .then(() => {
            message.success(res.message, 1.5);
            router.push("/admin/quiz/view-quiz");
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 1.5,
            })
            .then(() => {
              setCourses(res.data.metadata);
              setSelectedCourseLessons(res.data.metadata[0]?.lessons || []);
            });
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="me-3" style={{ paddingBottom: "100px" }}>
        <Form
          form={form}
          name="quiz_form"
          initialValues={{
            questions: [{}],
          }}
          onFinish={handleSaveQuiz}
        >
          <div style={{ display: "flex" }}>
            <Select
              placeholder="Select a course"
              onChange={handleCourseChange}
              value={selectedCourse}
              style={{marginRight: "10px"}}
            >
              {courses.map((course) => (
                <Option key={course._id} value={course._id}>
                  {course.name}
                </Option>
              ))}
            </Select>
            <Select
              placeholder="Select a lesson"
              onChange={handleLessonChange}
              value={selectedLesson}
            >
              {selectedCourseLessons.map((lesson) => (
                <Option key={lesson._id} value={lesson._id}>
                  {lesson.name}
                </Option>
              ))}
            </Select>
          </div>
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
            <Button type="primary" htmlType="submit">
              Save Quiz
            </Button>
          </div>
        </Form>
      </div>
    </div>
  );
}
