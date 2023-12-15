"use client";
import {
  Button,
  Card,
  Col,
  DatePicker,
  Form,
  Input,
  message,
  Row,
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
import {
  createQuiz,
  uploadFileQuiz,
  viewQuizTemplates,
} from "@/features/Quiz/quizSlice";
import {
  CloseOutlined,
  InfoCircleOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import "./page.css";

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
  const [quizTemplates, setQuizTemplates] = useState([]);
  console.log("🚀 ~ quizTemplates:", quizTemplates);
  const [selectedQuizTemplate, setSelectedQuizTemplate] = useState(null);
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
    if (value.length > 1) {
      const allStudents = value.flatMap((courseId) => {
        const course = courses.find((course) => course._id === courseId);
        return course?.students || [];
      });
      setStudentsByCourse(allStudents);
      setSelectedStudents(["all"]);
    } else if (value.length === 1) {
      const selectedCourse = courses.find((course) => course._id === value[0]);
      setStudentsByCourse(selectedCourse?.students || []);
    }
  };

  // Hàm xử lý khi chọn học viên
  const handleStudentChange = (value) => {
    if (value.includes("all")) {
      setSelectedStudents(["all"]);
    } else {
      setSelectedStudents(value);
    }
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
    setIsLoading(true);

    let formattedValues;
    let studentIds = selectedStudents;
    if (selectedStudents.includes("all")) {
      studentIds = studentsByCourse.map((student) => student._id);
    }

    if (selectedQuizTemplate) {
      const quizTemplate = quizTemplates.find(
        (template) => template._id === selectedQuizTemplate
      );

      const userQuestions = values.questions.map((question) => {
        return {
          ...question,
          options: question.options.map((option) => option.option),
        };
      });

      const combinedQuestions = [...quizTemplate.questions, ...userQuestions];

      formattedValues = {
        type: quizTemplate.type,
        name: quizTemplate.name,
        courseIds: selectedCourse,
        studentIds: studentIds,
        questions: combinedQuestions,
        submissionTime: values?.submissionTime?.toISOString(),
      };
    } else {
      if (quizType === "multiple_choice") {
        formattedValues = {
          ...values,
          type: quizType,
          submissionTime: values?.submissionTime?.toISOString(),
          courseIds: selectedCourse,
          studentIds: studentIds,
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
          studentIds: studentIds,
          submissionTime: values?.submissionTime?.toISOString(),
          essay: {
            title: values.essayTitle,
            content: values.essayContent,
          },
        };
      }
    }

    dispatch(
      createQuiz({
        formattedValues,
      })
    )
      .then(unwrapResult)
      .then((res) => {
        const quizId = res.metadata?._id;
        if (file) {
          dispatch(uploadFileQuiz({ quizId: quizId, filename: file })).then(
            (res) => {
              if (res.status) {
                setFile(null);
              }
              setIsLoading(false);
            }
          );
        }
        messageApi
          .open({
            type: "success",
            content: "Action in progress...",
            duration: 2.5,
          })
          .then(() => {
            router.push(`/admin/quiz/view-list-question/${quizId}`);
            message.success(res.message, 1.5);
            setIsLoading(false);
          })
          .catch((error) => {
            console.log(error);
            setIsLoading(false);
            message.error(error.response?.data?.message, 3.5);
          });
      });
  };

  useEffect(() => {
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.metadata);
          // setSelectedCourseLessons(res.data.metadata[0]?.students || []);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Fetch quiz templates when the component mounts
  useEffect(() => {
    dispatch(viewQuizTemplates())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setQuizTemplates(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  // Handle quiz template selection
  const handleQuizTemplateChange = (value) => {
    setSelectedQuizTemplate(value);
    if (value) {
      const selectedTemplate = quizTemplates.find((template) => template._id === value);
      form.setFieldsValue({ type: selectedTemplate.type });
      form.setFieldsValue({ name: selectedTemplate.name });
    } else {
      form.setFieldsValue({ type: "" });
      form.setFieldsValue({ name: "" });
    }
  };

  return (
    <div>
      {contextHolder}
      <div className="overflow-y-auto h-screen pb-28 scrollbar-thin justify-center items-center ">
        <h1 className="text-2xl">Tạo bài tập</h1>
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
            <Row gutter={16} className="py-4">
              <Col xs={24} sm={12} md={8} lg={6}>
                <span>Chọn khóa học của bạn:</span>
                <Select
                  mode="multiple"
                  placeholder="Chọn khóa học"
                  onChange={handleCourseChange}
                  value={selectedCourse}
                  style={{ width: "100%" }}
                >
                  {courses.map((course) => (
                    <Option key={course._id} value={course._id}>
                      {course.name}
                    </Option>
                  ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8} lg={6}>
                <span>Chọn học viên muốn chọn:</span>
                <Select
                  mode="multiple"
                  placeholder="Chọn học viên"
                  onChange={handleStudentChange}
                  value={selectedStudents}
                  disabled={selectedCourse.length > 1}
                  style={{ width: "100%" }}
                >
                  {selectedCourse.length > 1 ? (
                    <Option key="all" value="all">
                      Thêm tất cả
                    </Option>
                  ) : (
                    <>
                      <Option key="all" value="all">
                        Chọn tất cả
                      </Option>
                      {studentsByCourse.map((student) => (
                        <Option key={student._id} value={student._id}>
                          {student.lastName}
                        </Option>
                      ))}
                    </>
                  )}
                </Select>
              </Col>
              <Col xs={24} sm={24} md={8} lg={6}>
                {selectedCourse.length > 1 && (
                  <Tooltip title="Bài tập trên nhiều khóa học với bắt buộc chia sẻ với tất cả học viên">
                    <InfoCircleOutlined style={{ color: "red" }} />
                  </Tooltip>
                )}
              </Col>
            </Row>
           
            <Col xs={24} sm={12} md={8} lg={6} className="pb-4">
              <span>Chọn mẫu bài tập:</span>
              <Select
                placeholder="Chọn mẫu bài tập"
                onChange={handleQuizTemplateChange}
                style={{ width: "100%" }}
              >
                <Option value="">Không chọn</Option>
                {quizTemplates.map((template) => (
                  <Option key={template._id} value={template._id}>
                    {template.name}
                  </Option>
                ))}
              </Select>
            </Col>

            <Col xs={24} sm={12} md={8} lg={6}>
              <Form.Item
                label="Loại bài tập"
                name="type"
                rules={[
                  { required: true, message: "Vui lòng chọn bài kiểm tra" },
                ]}
              >
                <Select
                  placeholder="chọn Loại bài tập"
                  onChange={handleQuizTypeChange}
                  className="w-full"
                >
                  <Option value="multiple_choice">Trắc nghiệm</Option>
                  <Option value="essay">Tự luận</Option>
                </Select>
              </Form.Item>
            </Col>

            {quizType === "multiple_choice" ? (
              <>
                <Row gutter={8}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      label="Tên bài tập"
                      name="name"
                      rules={[
                        {
                          required: true,
                          message: "Vui lòng nhập tên bài tập.",
                        },
                      ]}
                      className="w-full"
                    >
                      <Input placeholder="Tên bài" className="w-full" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item label="Thời hạn nộp" name="submissionTime">
                      <DatePicker
                        showTime
                        disabledDate={(current) => {
                          // Không cho phép chọn ngày trước ngày hiện tại
                          let currentDate = new Date();
                          currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                          return current && current.toDate() < currentDate;
                        }}
                      />
                    </Form.Item>
                  </Col>
                </Row>
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <div className="">
                      {fields.map((field, index) => (
                        <div key={field.key} className="pb-4">
                          <Card
                            key={field.key}
                            title={`Câu hỏi ${index + 1}`}
                            extra={
                              <Button
                                danger
                                onClick={() => handleRemoveQuestion(index)}
                              >
                                Xóa
                              </Button>
                            }
                            className="bg-slate-300"
                          >
                            <Form.Item
                              label="Câu hỏi"
                              name={[field.name, "question"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập câu hỏi.",
                                },
                              ]}
                            >
                              <Input placeholder="Câu hỏi" />
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
                                            message: "Vui lòng chọn câu hỏi",
                                          },
                                        ]}
                                      >
                                        <div className="p-2">
                                          <Input placeholder="Option" />
                                        </div>
                                      </Form.Item>
                                      <CloseOutlined
                                        onClick={() => subMeta.remove(subIndex)}
                                      />
                                    </Space>
                                  ))}
                                  <div className="py-4 w-full">
                                    <Button
                                      type="dashed"
                                      onClick={() => subMeta.add()}
                                      block
                                      className="bg-slate-400"
                                    >
                                      + Thêm lựa chọn
                                    </Button>
                                  </div>
                                </div>
                              )}
                            </Form.List>
                            <Form.Item
                              label="Đáp án"
                              name={[field.name, "answer"]}
                              rules={[
                                {
                                  required: true,
                                  message: "Vui lòng nhập đáp án",
                                },
                              ]}
                            >
                              <Input placeholder="Đáp án" />
                            </Form.Item>
                          </Card>
                        </div>
                      ))}
                      <Button
                        type="dashed"
                        className="bg-orange-200"
                        onClick={() => handleAddQuestion()}
                        block
                      >
                        + Thêm câu hỏi
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
                    Lưu
                  </Button>
                </div>
              </>
            ) : (
              <>
                <Form.Item
                  label="Tiêu đề"
                  name="essayTitle"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input placeholder="Tiêu đề" />
                </Form.Item>

                <Form.Item name="essayContent">
                  <ReactQuill theme="snow" />
                </Form.Item>

                <Form.Item label="Thời hạn nộp" name="submissionTime">
                  <DatePicker
                    showTime
                    disabledDate={(current) => {
                      // Không cho phép chọn ngày trước ngày hiện tại
                      let currentDate = new Date();
                      currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                      return current && current.toDate() < currentDate;
                    }}
                  />
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
                    Lưu
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
