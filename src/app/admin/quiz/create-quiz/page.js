"use client";
import {
  Button,
  Card,
  DatePicker,
  Form,
  Input,
  message,
  Select,
  Space,
  Spin,
  Tooltip,
  Upload,
} from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import { createQuiz, uploadFileQuiz } from "@/features/Quiz/quizSlice";
import {
  CloseOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import UploadFileQuiz from "../upload-file/page";

const { Option } = Select;

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

export default function QuizCreator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [quizId, setQuizId] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizType, setQuizType] = useState("multiple_choice");
  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const dispatch = useDispatch();

  // Hàm xử lý khi loại quiz thay đổi
  const handleQuizTypeChange = (value) => {
    setQuizType(value);
  };

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    if (value.length === 1) {
      const selectedCourse = courses.find((course) => course._id === value[0]);
      setStudentsByCourse(selectedCourse?.students || []);
    } else {
      const allStudents = value.flatMap((courseId) => {
        const course = courses.find((course) => course._id === courseId);
        return course?.students || [];
      });
      setStudentsByCourse(allStudents);
      setSelectedStudents(allStudents.map((student) => student._id));
    }
  };

  // Hàm xử lý khi chọn học viên
  const handleStudentChange = (value) => {
    setSelectedStudents(value);
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

  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const handleSaveQuiz = (values) => {
    let formattedValues;
    if (quizType === "multiple_choice") {
      formattedValues = {
        ...values,
        type: quizType,
        submissionTime: values.submissionTime.toISOString(),
        courseIds: selectedCourse,
        studentIds: selectedStudents,
        questions: values.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
      };
    } else {
      formattedValues = {
        type: quizType,
        name: values.essayTitle,
        courseIds: selectedCourse,
        studentIds: selectedStudents,
        submissionTime: values.submissionTime.toISOString(),
        essay: {
          title: values.essayTitle,
          content: values.essayContent,
        },
      };
    }

    dispatch(
      createQuiz({
        formattedValues,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        console.log("🚀 ~ res:", res);
        const quizId = res.metadata?._id;
        console.log("🚀 ~ quizId:", quizId);


        if (file) {
          dispatch(uploadFileQuiz({ quizId: quizId, filename: file }))
            .then((res) => {
              if (res.status) {

                setFile(null);
              }
              setIsLoading(false);
            })

            messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            }).then(() => {
              router.push("/admin/quiz/view-quiz");
              message.success(res.message, 1.5);
            })
            .catch((error) => {
              console.log(error);
              setIsLoading(false);
              message.error(error.response?.data?.message, 3.5);
            });
        }
      });
  };

  useEffect(() => {
    setIsLoading(true);

    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.data.metadata);
          // setSelectedCourseLessons(res.data.metadata[0]?.students || []);
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      {contextHolder}
      <div className="overflow-y-auto h-screen pb-28 scrollbar-thin">
        <h1>Create Quizs</h1>
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
            onFinish={handleSaveQuiz}
          >
            <div style={{ display: "flex" }}>
              <Select
                mode="multiple"
                placeholder="Select courses"
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
              <Select
                mode="multiple"
                placeholder="Select students"
                onChange={handleStudentChange}
                value={selectedStudents}
                disabled={selectedCourse.length > 1}
              >
                {studentsByCourse.map((student) => (
                  <Option key={student._id} value={student._id}>
                    {student.lastName}
                  </Option>
                ))}
              </Select>
              {selectedCourse.length > 1 && (
                <Tooltip title="Bài tập trên nhiều khóa học với bắt buộc chia sẻ với tất cả học viên">
                  <InfoCircleOutlined style={{ color: "red" }} />
                </Tooltip>
              )}
            </div>

            <Form.Item
              label="Quiz Type"
              name="type"
              rules={[
                { required: true, message: "Please select the quiz type" },
              ]}
            >
              <Select
                placeholder="Select quiz type"
                onChange={handleQuizTypeChange}
              >
                <Option value="multiple_choice">Multiple Choice</Option>
                <Option value="essay">Essay</Option>
              </Select>
            </Form.Item>

            {quizType === "multiple_choice" ? (
              <>
                <Form.Item
                  label="Quiz Name"
                  name="name"
                  rules={[
                    { required: true, message: "Please enter the quiz name" },
                  ]}
                >
                  <Input placeholder="Quiz Name" />
                </Form.Item>
                <Form.Item
                  label="Submission Time"
                  name="submissionTime"
                  rules={[
                    {
                      required: true,
                      message: "Please select the submission time",
                    },
                  ]}
                >
                  <DatePicker showTime />
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
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ color: "#fff", backgroundColor: "#1890ff" }}
                    loading={isLoading}
                  >
                    Save Quiz
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Form.Item
                  label="Essay Title"
                  name="essayTitle"
                  rules={[
                    { required: true, message: "Please enter the essay title" },
                  ]}
                >
                  <Input placeholder="Essay Title" />
                </Form.Item>

                <Form.Item
                  label="Essay Content"
                  name="essayContent"
                  rules={[
                    {
                      required: true,
                      message: "Please enter the essay content",
                    },
                  ]}
                >
                  <ReactQuill theme="snow" />
                </Form.Item>

                <Form.Item
                  label="Submission Time"
                  name="submissionTime"
                  rules={[
                    {
                      required: true,
                      message: "Please select the submission time",
                    },
                  ]}
                >
                  <DatePicker showTime />
                </Form.Item>

                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>

                <div className="pt-2 text-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    style={{ color: "#fff", backgroundColor: "#1890ff" }}
                    loading={isLoading}
                  >
                    Save Quiz
                  </Button>
                </div>
              </>
            )}
          </Form>
        )}
      </div>
    </div>
  );
}
