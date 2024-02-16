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
  Grid,
  InputNumber,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import { selectCourse, viewCourses } from "@/features/Courses/courseSlice";
import {
  createQuiz,
  uploadFileQuiz,
  uploadQuestionImage,
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
import { isAdmin } from "@/middleware";

const { Option } = Select;

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

export default function QuizCreator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourseLessons, setSelectedCourseLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [quizTemplates, setQuizTemplates] = useState([]);
  const [selectedQuizTemplate, setSelectedQuizTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizType, setQuizType] = useState("multiple_choice");
  const [file, setFile] = useState(null);
  const [fileQuestion, setFileQuestion] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();

  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const datePickerPlacement = screens.xs ? "bottomRight" : "bottomLeft";

  const [questionImages, setQuestionImages] = useState([]);

  const handleImageUpload = (event, index) => {
    setQuestionImages((prevState) => {
      const newState = [...prevState];
      newState[index] = fileQuestion;
      return newState;
    });
  };

  const dispatch = useDispatch();

  // Hàm xử lý khi loại quiz thay đổi
  const handleQuizTypeChange = (value) => {
    setQuizType(value);
  };

  const toggleTemplateMode = () => {
    setIsTemplateMode(!isTemplateMode);
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
      setSelectedCourseLessons(selectedCourse?.lessons || []);
    }
  };

  // Hàm xử lý khi chọn bài học
  const handleLessonChange = (value) => {
    setSelectedLesson(value);
  };

  // Hàm xử lý khi chọn học viên
  const handleStudentChange = (value) => {
    if (value.includes("all")) {
      setSelectedStudents(["all"]);
    } else {
      setSelectedStudents(value);
    }
  };

  // Hàm xử lý khi thêm câu hỏi
  const handleAddQuestion = () => {
    const questions = form.getFieldValue("questions") || [];
    // Kiểm tra xem câu hỏi mới có trùng với câu hỏi mẫu không
    if (selectedQuizTemplate) {
      const selectedTemplate = quizTemplates.find(
        (template) => template._id === selectedQuizTemplate
      );
      if (selectedTemplate && selectedTemplate.questions.length > 0) {
        // Nếu có bài tập mẫu, chỉ thêm câu hỏi mới nếu nó không trùng lặp
        const templateQuestions = selectedTemplate.questions.map(
          (q) => q.question
        );
        if (!templateQuestions.includes("")) {
          form.setFieldsValue({ questions: [...questions, {}] });
        }
      } else {
        // Nếu không có bài tập mẫu, thêm câu hỏi mới
        form.setFieldsValue({ questions: [...questions, {}] });
      }
    } else {
      // Nếu không có bài tập mẫu, thêm câu hỏi mới
      form.setFieldsValue({ questions: [...questions, {}] });
    }
  };

  // Hàm xử lý khi xóa câu hỏi
  const handleRemoveQuestion = (index) => {
    const questions = form.getFieldValue("questions") || [];
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    form.setFieldsValue({ questions: newQuestions });
  };

  //props xử lý file
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

  const propsQuestion = {
    onRemove: () => {
      setFileQuestion(null);
    },
    beforeUpload: (file) => {
      setFileQuestion(file);
      return false;
    },
    fileList: fileQuestion ? [fileQuestion] : [],
    accept: ".jpg, .jpeg, .png",
  };

  //hàm xử lý save quiz
  const handleSaveQuiz = (values) => {
    setIsLoading(true);

    const questionWithoutOptionsIndex = values.questions.findIndex(
      (q) => !q.options || q.options.length === 0
    );

    if (questionWithoutOptionsIndex !== -1) {
      message.error(
        `Câu hỏi số ${
          questionWithoutOptionsIndex + 1
        } phải có ít nhất một lựa chọn.`,
        3.5
      );
      setIsLoading(false);
      return;
    }

    let formattedValues;

    let studentIds = selectedStudents;
    if (selectedStudents.includes("all")) {
      studentIds = studentsByCourse.map((student) => student._id);
    }

    let questions = values.questions || [];

    if (selectedQuizTemplate) {
      // Xử lý cho trường hợp sử dụng bài tập mẫu
      const quizTemplate = quizTemplates.find(
        (template) => template._id === selectedQuizTemplate
      );

      // Loại bỏ các câu hỏi trùng lặp từ người dùng
      const userQuestions = questions
        .filter(
          (q) =>
            !quizTemplate.questions.some((tq) => tq.question === q.question)
        )
        .map((question) => {
          return {
            ...question,
            options: question.options.map((option) => option.option),
          };
        });

      // Gộp các câu hỏi từ bài tập mẫu và người dùng
      const combinedQuestions = [...quizTemplate.questions, ...userQuestions];

      formattedValues = {
        type: quizTemplate.type,
        name: values.name,
        courseIds: selectedCourse,
        studentIds: studentIds,
        questions: combinedQuestions,
        submissionTime: values?.submissionTime?.toISOString(),
        timeLimit: values?.timeLimit,
      };
    } else {
      // Xử lý cho trường hợp không sử dụng bài tập mẫu
      if (quizType === "multiple_choice") {
        formattedValues = {
          ...values,
          type: quizType,
          submissionTime: values?.submissionTime?.toISOString(),
          courseIds: selectedCourse,
          studentIds: studentIds,
          timeLimit: values?.timeLimit,
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

    if (selectedLesson) {
      formattedValues = {
        ...formattedValues,
        lessonId: selectedLesson, // Add lessonId to the payload
        courseIds: [], // Clear courseIds since the quiz is associated with a lesson
      };
    } else {
      formattedValues = {
        ...formattedValues,
        courseIds: selectedCourse,
      };
    }

    dispatch(
      createQuiz({
        formattedValues,
      })
    )
      .then(unwrapResult)
      .then(async (res) => {
        const quizId = res.metadata?._id;
        const questionIds = res.metadata?.questions?.map((q) => q._id);

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

        if (fileQuestion) {
          questionImages.forEach((imageFile, index) => {
            if (imageFile && questionIds[index]) {
              dispatch(
                uploadQuestionImage({
                  quizId: quizId,
                  questionId: questionIds[index],
                  filename: fileQuestion,
                })
              ).catch((error) => {
                message.error(
                  error.response?.data?.message ||
                    "An error occurred while uploading the question image.",
                  3.5
                );
              });
            }
          });
        }

        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            if (isTemplateMode) {
              router.push("/admin/quiz/template-quiz");
            } else {
              router.push(`/admin/quiz/view-list-question/${quizId}`);
            }
            message.success(res.message, 1.5);
            setIsLoading(false);
          })
          .catch((error) => {
            setIsLoading(false);
            message.error(error.response?.data?.message, 3.5);
          });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.status === 403 && error.name === "BadRequestError") {
          message.error("A quiz for this lesson already exists.", 3.5);
          setIsLoading(false);
        } else {
          message.error(
            error.response?.data?.message ||
              "An error occurred while saving the quiz.",
            3.5
          );
          setIsLoading(false);
        }
      });
  };

  const coursesFromStore = useSelector((state) => state.course.courses);

  // Fetch courses when the component mounts
  useEffect(() => {
    if (coursesFromStore.length === 0) {
      dispatch(selectCourse())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            const currentTeacherId = localStorage.getItem("x-client-id");
            let visibleCourses;

            if (isAdmin()) {
              visibleCourses = res.metadata;
            } else {
              visibleCourses = res.metadata.filter(
                (course) => course.teacher === currentTeacherId
              );
            }
            setCourses(visibleCourses);
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {});
    } else {
      // Sử dụng dữ liệu từ store
      setCourses(coursesFromStore.metadata);
    }
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
      .catch((error) => {});
  }, []);

  // Handle quiz template selection
  const handleQuizTemplateChange = (value) => {
    setSelectedQuizTemplate(value);
    if (value) {
      const selectedTemplate = quizTemplates.find(
        (template) => template._id === value
      );
      form.setFieldsValue({ type: selectedTemplate.type });
      form.setFieldsValue({ name: selectedTemplate.name });
      form.setFieldsValue({
        questions: selectedTemplate.questions.map((question) => ({
          question: question.question,
          options: question.options.map((option) => ({ option })),
          answer: question.answer,
        })),
      });
    } else {
      form.setFieldsValue({ type: "" });
      form.setFieldsValue({ name: "" });
      form.setFieldsValue({ questions: [{}] });
    }
  };

  return (
    <div className="p-3">
      {contextHolder}
      <div className="overflow-y-auto h-screen pb-28 scrollbar-thin justify-center items-center grid-container">
        <h1 className="text-2xl">
          {isTemplateMode ? "Tạo bài tập mẫu" : "Tạo bài tập"}
        </h1>
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
            <div className="py-2">
              <Button
                onClick={toggleTemplateMode}
                type="primary"
                htmlType="submit"
                className="custom-button"
              >
                {isTemplateMode ? "Tạo bài tập" : "Tạo bài mẫu"}
              </Button>
            </div>
            {!isTemplateMode && (
              <>
                <Row gutter={16} className="py-4">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      name="courseIds"
                      label="Chọn khóa học của bạn:"
                      rules={[
                        { required: true, message: "Vui lòng chọn khóa học" },
                      ]}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
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
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      name="lessonId"
                      label="Chọn bài học:"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Select
                        placeholder="Chọn bài học"
                        onChange={handleLessonChange}
                        value={selectedLesson}
                        className="me-3 w-full sm:w-64 mb-3 md:mb-0"
                      >
                        <Option value="">Không chọn</Option>
                        {selectedCourseLessons.map((lesson) => (
                          <Option key={lesson._id} value={lesson._id}>
                            {lesson.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      name="studentIds"
                      label="Chọn học viên muốn chọn: "
                      rules={[
                        { required: true, message: "Vui lòng chọn học viên" },
                      ]}
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
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
                                {student?.lastName} {student?.firstName}
                              </Option>
                            ))}
                          </>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={24} md={8} lg={6}>
                    {selectedCourse.length > 1 && (
                      <Tooltip title="Bài tập trên nhiều khóa học với bắt buộc chia sẻ với tất cả học viên">
                        <InfoCircleOutlined style={{ color: "red" }} />
                      </Tooltip>
                    )}
                  </Col>
                </Row>

                {!isTemplateMode && quizType !== "essay" && (
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
                )}
              </>
            )}

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
                  {!isTemplateMode && <Option value="essay">Tự luận</Option>}
                </Select>
              </Form.Item>
            </Col>

            {quizType === "multiple_choice" ? (
              <>
                <Row utter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
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
                  {!isTemplateMode && (
                    <>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                          label="Thời hạn nộp"
                          name="submissionTime"
                          className="px-2"
                        >
                          <DatePicker
                            showTime
                            style={{ width: "100%" }}
                            placement={datePickerPlacement}
                            disabledDate={(current) => {
                              // Không cho phép chọn ngày trước ngày hiện tại
                              let currentDate = new Date();
                              currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                              return current && current.toDate() < currentDate;
                            }}
                          />
                        </Form.Item>
                      </Col>
                      <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item
                          name="timeLimit"
                          label="Thời gian làm bài (phút)"
                        >
                          <InputNumber
                            min={1}
                            placeholder="Nhập thời gian làm bài"
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <>
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
                              <Input.TextArea
                                placeholder="Nhập câu hỏi tại đây"
                                autoSize={{ minRows: 2, maxRows: 5 }}
                              />
                            </Form.Item>
                            <Form.Item
                              label="Hình ảnh"
                              name={[field.name, "image"]}
                            >
                              <Upload
                                {...propsQuestion}
                                onChange={(event) =>
                                  handleImageUpload(event, index)
                                }
                              >
                                <Button
                                  className="custom-button"
                                  type="primary"
                                  icon={<UploadOutlined />}
                                >
                                  Thêm tệp
                                </Button>
                              </Upload>
                            </Form.Item>
                            <Form.List name={[field.name, "options"]}>
                              {(subFields, { add, remove }) => (
                                <div>
                                  {subFields.map((subField, subIndex) => (
                                    <div
                                      key={subField.key}
                                      style={{
                                        display: "flex",
                                        marginBottom: 8,
                                        alignItems: "center",
                                      }}
                                    >
                                      <Form.Item
                                        {...subField}
                                        name={[subField.name, "option"]}
                                        fieldKey={[subField.fieldKey, "option"]}
                                        rules={[
                                          {
                                            required: true,
                                            message: "Vui lòng nhập lựa chọn",
                                          },
                                        ]}
                                        style={{ flex: 1, marginRight: 8 }}
                                      >
                                        <Input.TextArea
                                          placeholder="Lựa chọn"
                                          autoSize={{ minRows: 1, maxRows: 5 }}
                                          style={{ width: "100%" }}
                                        />
                                      </Form.Item>
                                      <CloseOutlined
                                        onClick={() => remove(subIndex)}
                                        style={{
                                          color: "red",
                                          cursor: "pointer",
                                          fontSize: '16px',
                                          marginBottom: 8,
                                          alignSelf: 'center'
                                        }}
                                      />
                                    </div>
                                  ))}
                                  <Button
                                    type="dashed"
                                    onClick={() => add()}
                                    block
                                  >
                                    + Thêm lựa chọn
                                  </Button>
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
                              <Input.TextArea autoSize={{ minRows: 1, maxRows: 3 }} placeholder="Đáp án" />
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
                    </>
                  )}
                </Form.List>
                <div className="pt-2 text-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="custom-button"
                    loading={isLoading}
                  >
                    Lưu
                  </Button>
                </div>
              </>
            ) : (
              <>
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
                    okButtonProps={{
                      style: { backgroundColor: "#1890ff", color: "#fff" },
                    }}
                    disabledDate={(current) => {
                      // Không cho phép chọn ngày trước ngày hiện tại
                      let currentDate = new Date();
                      currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                      return current && current.toDate() < currentDate;
                    }}
                  />
                </Form.Item>

                <Upload {...props}>
                  <Button icon={<UploadOutlined />}>Thêm tệp</Button>
                </Upload>

                <div className="pt-2 text-end">
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="custom-button"
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
