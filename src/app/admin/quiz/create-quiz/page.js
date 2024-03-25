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
  Spin,
  Upload,
  Grid,
  InputNumber,
  Result,
  Modal,
  Badge,
  Pagination,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { createSelector, unwrapResult } from "@reduxjs/toolkit";
import { selectCourse } from "@/features/Courses/courseSlice";
import {
  DeldraftQuiz,
  createQuiz,
  draftQuiz,
  getDraftQuiz,
  uploadFileQuiz,
  uploadQuestionImage,
  viewQuizTemplates,
} from "@/features/Quiz/quizSlice";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import "./page.css";
import { isAdmin, isMentor } from "@/middleware";
import { refreshAUser } from "@/features/User/userSlice";
import _ from "lodash";

const { Option } = Select;

import "react-quill/dist/quill.snow.css";
import Editor from "@/config/quillConfig";
import moment from "moment";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

const htmlToJson = (html) => {
  return JSON.stringify(html);
};

export default function QuizCreator() {
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [showDraftQuizzesSelect, setShowDraftQuizzesSelect] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courses, setCourses] = useState([]);
  const [studentsByCourse, setStudentsByCourse] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [quizTemplates, setQuizTemplates] = useState([]);
  const [draftQuizzes, setDraftquiz] = useState([]);
  const [selectedQuizTemplate, setSelectedQuizTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [quizType, setQuizType] = useState("multiple_choice");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [showStudentSelectModal, setShowStudentSelectModal] = useState(false);
  const [initialQuestions, setInitialQuestions] = useState([]);

  const [file, setFile] = useState(null);
  const [form] = Form.useForm();
  const router = useRouter();
  const { useBreakpoint } = Grid;
  const screens = useBreakpoint();
  const datePickerPlacement = screens.xs ? "bottomRight" : "bottomLeft";

  const [questionImages, setQuestionImages] = useState([]);

  const [currentPage, setCurrentPage] = useState(1);
  const questionsPerPage = 10;

  const paginate = (page) => {
    setCurrentPage(page);
  };

  const handleImageUpload = (file, index) => {
    setQuestionImages((prevState) => {
      const newState = [...prevState];
      newState[index] = file;
      return newState;
    });
  };

  const dispatch = useDispatch();

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    dispatch(refreshAUser(currentTeacherId));
  }, []);

  // Hàm xử lý khi loại quiz thay đổi
  const handleQuizTypeChange = (value) => {
    setQuizType(value);
  };

  const toggleTemplateMode = () => {
    setIsTemplateMode(!isTemplateMode);
  };

  const [isCourseSelected, setIsCourseSelected] = useState(false);

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    setIsCourseSelected(value.length > 0);
    const hasDraftQuizzesForSelectedCourse =
      value.length > 0 &&
      draftQuizzes.some((quiz) => value.includes(quiz.courseIds[0]));
    setShowDraftQuizzesSelect(hasDraftQuizzesForSelectedCourse);

    if (value.length > 1) {
      const allStudents = value.flatMap((courseId) => {
        const course = courses?.find((course) => course?._id === courseId);
        return course?.students || [];
      });
      setStudentsByCourse(allStudents);
      setSelectedStudents(["all"]);
    } else if (value.length === 1) {
      const selectedCourse = courses?.find(
        (course) => course?._id === value[0]
      );
      setStudentsByCourse(selectedCourse?.students || []);
    } else {
      setStudentsByCourse([]);
      setDraftquiz([]);
      setInitialQuestions([]);
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
    // Thêm câu hỏi mới vào danh sách
    const newQuestions = [...questions, {}];

    // Cập nhật danh sách câu hỏi với câu hỏi mới
    form.setFieldsValue({ questions: newQuestions });

    // Kiểm tra số lượng câu hỏi sau khi thêm
    if (newQuestions.length % questionsPerPage === 0) {
      // Nếu số lượng câu hỏi đạt giới hạn của trang, chuyển đến trang tiếp theo
      const newCurrentPage = Math.ceil(newQuestions.length / questionsPerPage);
      setCurrentPage(newCurrentPage);
    }

    if (selectedQuizTemplate) {
      const selectedTemplate = quizTemplates.find(
        (template) => template._id === selectedQuizTemplate
      );
      if (selectedTemplate && selectedTemplate?.questions?.length > 0) {
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

    const totalQuestionsAfterRemoval = newQuestions.length;
    const minimumQuestionsForCurrentPage = (currentPage - 1) * questionsPerPage;
    if (totalQuestionsAfterRemoval <= minimumQuestionsForCurrentPage && currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
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

  const getPropsQuestion = (index) => ({
    onRemove: () => {
      const newQuestionImages = [...questionImages];
      newQuestionImages[index] = null;
      setQuestionImages(newQuestionImages);
    },
    beforeUpload: (file) => {
      const newQuestionImages = [...questionImages];
      newQuestionImages[index] = file;
      setQuestionImages(newQuestionImages);
      return false; // Ngăn chặn việc tự động upload
    },
    fileList: questionImages[index] ? [questionImages[index]] : [],
    accept: ".jpg, .jpeg, .png",
  });

  const questionsAreEqual = (q1, q2) => {
    // So sánh nội dung câu hỏi và câu trả lời
    if (q1.question.trim() !== q2.question.trim() || q1.answer !== q2.answer) {
      return false;
    }
    // Đảm bảo rằng cả hai đều có options là mảng các chuỗi
    const options1 = q1.options
      .map((opt) => (typeof opt === "object" ? opt.option : opt))
      .map((opt) => opt.trim());
    const options2 = q2.options
      .map((opt) => (typeof opt === "object" ? opt.option : opt))
      .map((opt) => opt.trim());

    // So sánh các lựa chọn, nếu số lượng khác nhau, chúng không bằng nhau
    if (options1.length !== options2.length) {
      return false;
    }
    // So sánh từng lựa chọn
    for (let i = 0; i < options1.length; i++) {
      if (options1[i] !== options2[i]) {
        return false;
      }
    }

    return true;
  };

  //hàm xử lý save quiz ver 2
  const handleSaveQuiz = (values, action) => {
    setIsLoading(true);

    // Chuẩn bị dữ liệu câu hỏi
    const currentQuestions = form.getFieldValue("questions") || [];
    const normalizedCurrentQuestions = currentQuestions.map((q) => ({
      ...q,
      options: q.options.map((opt) =>
        typeof opt === "object" ? opt.option : opt
      ),
    }));

    // Lọc và chuẩn bị câu hỏi để lưu
    const questionsToSave = normalizedCurrentQuestions.filter((q) => {
      if (!q._id) return true;
      const originalQuestion = initialQuestions.find((iq) => iq._id === q._id);
      // Câu hỏi đã chỉnh sửa có _id và nội dung khác với normalizedInitialQuestions
      return originalQuestion ? !questionsAreEqual(q, originalQuestion) : false;
    });

    if (quizType === "multiple_choice") {
      const questionWithoutOptionsIndex = values?.questions?.findIndex(
        (q) => !q?.options || q?.options?.length === 0
      );

      if (questionWithoutOptionsIndex !== -1) {
        message.warning(
          `Câu hỏi số ${
            questionWithoutOptionsIndex + 1
          } phải có ít nhất một lựa chọn.`,
          3.5
        );
        setIsLoading(false);
        return;
      }
    }

    // Định dạng giá trị dựa trên dữ liệu form và thêm logic dựa trên `action`
    let formattedValues = {
      ...values,
      type: quizType,
      courseIds: selectedCourse,
      studentIds: action === "assign" ? selectedStudents : [],
      questions: questionsToSave,
      isDraft: action === "save_draft",
    };

    // Thêm isDraft vào formattedValues dựa trên action
    if (action === "save_draft") {
      formattedValues.isDraft = true;
      if (selectedQuizId) {
        formattedValues.quizIdDraft = selectedQuizId;
      }
    }

    let studentIds = selectedStudents;
    if (selectedStudents.includes("all")) {
      studentIds = studentsByCourse.map((student) => student._id);
    }

    // let questions = values.questions || [];
    let questions = form.getFieldValue("questions") || [];
    const apiAction = action === "save_draft" ? draftQuiz : createQuiz;

    if (selectedQuizTemplate) {
      formattedValues = {
        type: quizType,
        name: values.name,
        courseIds: selectedCourse,
        studentIds: studentIds,
        // questions: combinedQuestions,
        questions: questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
        submissionTime: values?.submissionTime?.toISOString(),
        timeLimit: values?.timeLimit,
      };
    } else {
      // Xử lý cho trường hợp không sử dụng bài tập mẫu
      if (apiAction === createQuiz && quizType === "multiple_choice") {
        formattedValues = {
          ...formattedValues,
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
      } else if (apiAction === createQuiz && quizType === "essay") {
        //xử lý tự luận
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

      if (selectedLesson && selectedLesson !== "") {
        formattedValues.lessonId = selectedLesson;
      } else {
        // Đảm bảo không thêm lessonId nếu không có bài học được chọn
        delete formattedValues.lessonId;
      }
    }

    if (selectedLesson) {
      formattedValues = {
        ...formattedValues,
        lessonId: selectedLesson,
        courseIds: [],
      };
    } else {
      formattedValues = {
        ...formattedValues,
        courseIds: selectedCourse,
        // ...(selectedQuizId ? { quizIdDraft: selectedQuizId } : {}), 
      };
    }

    dispatch(
      apiAction({
        formattedValues,
      })
    )
      .then(unwrapResult)
      .then(async (res) => {
        const quizId = res.metadata?._id;
        const questionIds = res.metadata?.questions?.map((q) => q._id);
        const userId = localStorage?.getItem("x-client-id");
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

        if (questionImages) {
          questionImages.forEach((imageFile, index) => {
            if (imageFile && questionIds[index]) {
              dispatch(
                uploadQuestionImage({
                  quizId: quizId,
                  questionId: questionIds[index],
                  filename: imageFile,
                  isTemplateMode,
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

        if (apiAction === createQuiz) {
          if (action !== "save_draft") {
            dispatch(DeldraftQuiz({ quizIdDraft: selectedQuizId }));
          }
        }

        dispatch(refreshAUser(userId));
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
      })
      .finally(() => {
        setIsLoading(false);
      });
      
      if (apiAction === draftQuiz) {
        message.success("Tạo bài nháp thành công", 2.5);
        router.push("/admin/courses");
      } else if (isTemplateMode) {
        router.push("/admin/quiz/template-quiz");
      } else {
        router.push(`/admin/quiz/view-quiz`);
      }
  };

  const selectCourses = createSelector(
    [(state) => state.course.courses],
    (courses) => courses
  );

  const selectDraftQuiz = createSelector(
    [(state) => state.quiz.getdraftQuiz],
    (getdraftQuiz) => getdraftQuiz
  );

  const selectQuizTemplates = createSelector(
    [(state) => state.quiz.getQuizTemplates],
    (getQuizTemplates) => getQuizTemplates
  );

  const coursesFromStore = useSelector((state) => selectCourses(state));
  const draftQuizFromStore = useSelector((state) => selectDraftQuiz(state));
  const getQuizTemplatesStore = useSelector((state) =>
    selectQuizTemplates(state)
  );
  const userFromStore = useSelector((state) => state.user);

  // Giả sử selectedCourse chứa ID của khóa học hiện tại được chọn
  const currentTeacherId = useMemo(() => {
    return (
      userFromStore?.user?._id || userFromStore?.user?.metadata?.account?._id
    );
  }, [userFromStore]);

  // Tìm khóa học hiện tại từ danh sách khóa học trong userFromStore
  const currentCourse = useMemo(() => {
    return (
      userFromStore?.user?.metadata?.account?.courses?.find(
        (course) => course._id === selectedCourse[0]
      ) ||
      userFromStore?.user?.courses?.find(
        (course) => course._id === selectedCourse[0]
      )
    );
  }, [userFromStore, selectedCourse]);

  // Tìm thông tin teacherQuizzes cho giáo viên hiện tại trong khóa học đó
  // Kiểm tra xem giáo viên đã đạt giới hạn tạo bài tập cho khóa học này chưa
  const isQuizLimitReached = useMemo(() => {
    const teacherQuizInfo = currentCourse?.teacherQuizzes?.find(
      (tq) => tq.teacherId === currentTeacherId
    );
    return teacherQuizInfo ? teacherQuizInfo.quizCount >= 3 : false;
  }, [currentCourse, currentTeacherId]);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    let visibleCourses;

    if (coursesFromStore?.length === 0) {
      dispatch(selectCourse())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            if (isAdmin()) {
              visibleCourses = res.metadata;
            } else if (isMentor()) {
              visibleCourses = res.metadata.filter(
                (course) => course.teacher === currentTeacherId
              );
            }
            setCourses(visibleCourses);
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {
          if (error.response.status === 401) {
            // Handle unauthorized error
            router.push("/login"); // Assuming '/login' is your login route path
          } else {
            messageApi.error("An unexpected error occurred.");
          }
        });
    } else {
      // Áp dụng lọc cũng cho dữ liệu từ store
      if (isAdmin()) {
        visibleCourses = coursesFromStore.metadata;
      } else if (isMentor()) {
        visibleCourses = coursesFromStore.metadata.filter(
          (course) => course.teacher === currentTeacherId
        );
      }
      setCourses(visibleCourses);
    }
  }, [coursesFromStore, dispatch]);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    let visibleCourses;

    dispatch(selectCourse())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          if (isAdmin()) {
            visibleCourses = res.metadata;
          } else if (isMentor()) {
            visibleCourses = res.metadata.filter(
              (course) => course.teacher === currentTeacherId
            );
          }
          setCourses(visibleCourses);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        if (error.response.status === 401) {
          // Handle unauthorized error
          router.push("/login"); // Assuming '/login' is your login route path
        } else {
          messageApi.error("An unexpected error occurred.");
        }
      });
  }, [dispatch]);

  // Fetch quiz templates when the component mounts
  //fetch the templates
  useEffect(() => {
    if (getQuizTemplatesStore?.length === 0) {
      dispatch(viewQuizTemplates())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setQuizTemplates(res.metadata);
          } else {
            messageApi.error(res.message);
          }
        });
    } else {
      setQuizTemplates(getQuizTemplatesStore.metadata);
    }
  }, []);

  //fetch the draft
  useEffect(() => {
    const courseId = selectedCourse[0];
    const filteredDraftQuizzes = draftQuizFromStore?.filter((quiz) =>
      quiz.courseIds.includes(courseId)
    );

    if (filteredDraftQuizzes.length > 0) {
      setDraftquiz(filteredDraftQuizzes);
      setInitialQuestions(filteredDraftQuizzes[0].questions);
      setShowDraftQuizzesSelect(filteredDraftQuizzes.length > 0);
    } else if (selectedCourse?.length > 0) {
      dispatch(getDraftQuiz())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            const filteredRes = res.metadata.filter((quiz) =>
              quiz.courseIds.includes(courseId)
            );
            setDraftquiz(filteredRes);
            if (filteredRes.length > 0) {
              setInitialQuestions(filteredRes[0].questions);
            }
          } else {
            messageApi.error(res.message);
          }
        });
    }
  }, [selectedCourse]);

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
      setSelectedQuizId("");
    } else {
      form.setFieldsValue({ type: "" });
      form.setFieldsValue({ name: "" });
      form.setFieldsValue({ questions: [{}] });
    }
  };

  //Xử lý sự kiện khi một bài tập nháp được chọn
  const handleDraftQuizSelect = (selectedQuizId) => {
    const selectedQuiz = draftQuizzes.find(
      (quiz) => quiz._id === selectedQuizId
    );
    if (selectedQuiz) {
      form.setFieldsValue({
        name: selectedQuiz.name,
        type: selectedQuiz.type,
        submissionTime: selectedQuiz?.submissionTime
          ? moment(selectedQuiz?.submissionTime)
          : null,
        timeLimit: selectedQuiz?.timeLimit,
        questions: selectedQuiz.questions.map((question) => ({
          _id: question._id,
          question: question.question,
          options: question.options.map((option) => ({ option })),
          answer: question.answer,
        })),
      });

      const newQuestionImages = selectedQuiz.questions.map((question) => {
        if (question.image_url) {
          const urlParts = question.image_url.split("/");
          const fileName = urlParts[urlParts.length - 1];
          return {
            uid: question._id,
            name: fileName,
            status: "done",
            url: question.image_url,
          };
        }
        return null;
      });

      setQuestionImages(newQuestionImages);
    } else {
      form.resetFields([
        "name",
        "type",
        "questions",
        "submissionTime",
        "timeLimit",
      ]);
      setQuestionImages([]);
    }
    setSelectedQuizTemplate("");
    setSelectedQuizId(selectedQuizId);
  };

  const handleFinishFailed = (errorInfo) => {
    // Kiểm tra nếu người dùng chưa chọn khóa học và không phải là tạo bài tập mẫu
    if (!selectedCourse?.length && !isTemplateMode) {
      message.warning(
        "Vui lòng chọn ít nhất một khóa học trước khi tiếp tục.",
        3.5
      );
    }
    if (!selectedStudents?.length && !isTemplateMode) {
      message.warning(
        "Vui lòng chọn ít nhất một học viên trước khi tiếp tục.",
        3.5
      );
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
            onFinishFailed={handleFinishFailed}
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
                <Row gutter={16} className="">
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      name="courseIds"
                      label="Chọn khóa học của bạn:"
                      rules={
                        isQuizLimitReached
                          ? [
                              {
                                required: true,
                                message:
                                  "Bạn đã hết số lượng bài tập cho khóa học này.",
                              },
                            ]
                          : [
                              {
                                required: true,
                                message: "Vui lòng chọn khóa học",
                              },
                            ]
                      }
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 24 }}
                    >
                      <Select
                        mode="multiple"
                        placeholder="Chọn khóa học"
                        onChange={handleCourseChange}
                        value={selectedCourse}
                        style={{ width: "100%" }}
                        // disabled={isQuizLimitReached}
                      >
                        {courses?.map((course) => (
                          <Option key={course._id} value={course._id}>
                            {course.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    {showDraftQuizzesSelect && (
                      <Form.Item
                        name="quizIdDraft"
                        label="Bài tập nháp"
                        rules={
                          isQuizLimitReached
                            ? [
                                {
                                  required: true,
                                  message:
                                    "Bạn đã hết số lượng bài tập cho khóa học này.",
                                },
                              ]
                            : null
                        }
                        labelCol={{ span: 24 }}
                        wrapperCol={{ span: 24 }}
                      >
                        <Badge
                          count={draftQuizzes.length}
                          offset={[10, 0]}
                          showZero
                        >
                          <Select
                            onChange={handleDraftQuizSelect}
                            placeholder="Chọn bài tập nháp"
                            disabled={
                              isQuizLimitReached ||
                              (selectedQuizTemplate &&
                                selectedQuizTemplate !== "")
                            }
                          >
                            <Select.Option value="">Không chọn</Select.Option>
                            {draftQuizzes.map((quiz) => (
                              <Select.Option key={quiz._id} value={quiz._id}>
                                {quiz.name}
                              </Select.Option>
                            ))}
                          </Select>
                        </Badge>
                      </Form.Item>
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
                      disabled={
                        !isCourseSelected ||
                        isQuizLimitReached ||
                        (selectedQuizId && selectedQuizId !== "")
                      }
                    >
                      <Option value="">Không chọn</Option>
                      {quizTemplates?.map((template) => (
                        <Option key={template._id} value={template._id}>
                          {template.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                )}
              </>
            )}

            {quizType === "multiple_choice" ? (
              <>
                <Row utter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
                  <Col xs={24} sm={12} md={8} lg={6}>
                    <Form.Item
                      label="Tên bài tập"
                      name="name"
                      rules={
                        !isQuizLimitReached || isTemplateMode
                          ? [
                              {
                                required: true,
                                message: "Vui lòng nhập tên bài tập.",
                              },
                            ]
                          : []
                      }
                      className="w-full"
                    >
                      <Input
                        disabled={
                          !isCourseSelected ||
                          (isQuizLimitReached && !isTemplateMode)
                        }
                        placeholder="Tên bài"
                        className="w-full"
                      />
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
                            disabled={!isCourseSelected || isQuizLimitReached}
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
                            disabled={!isCourseSelected || isQuizLimitReached}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  )}
                </Row>
                {isCourseSelected && (
                  <>
                    <div>
                      {!isQuizLimitReached || isTemplateMode ? (
                        <Form.List name="questions">
                          {(fields, { add, remove }) => {
                            // Tính toán chỉ số của câu hỏi đầu và cuối trên trang hiện tại
                            const indexOfLastQuestion = currentPage * questionsPerPage;
                            const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
                            // Lọc ra các câu hỏi để hiển thị trên trang hiện tại
                            const currentQuestions = fields.slice(indexOfFirstQuestion, indexOfLastQuestion);
                            return (
                              <>
                              {currentQuestions.map((field, index) => (
                                <div key={field.key} className="pb-4">
                                  <Card
                                    key={field.key}
                                    title={`Câu hỏi ${indexOfFirstQuestion + index + 1}`}
                                    extra={
                                      <Button
                                        danger
                                        onClick={() =>
                                          handleRemoveQuestion(indexOfFirstQuestion + index)
                                        }
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
                                      <Editor
                                        placeholder="Nhập câu hỏi tại đây"
                                        value={form.getFieldValue([
                                          "questions",
                                          field.name,
                                          "question",
                                        ])}
                                        onChange={(html) => {
                                          const jsonValue = htmlToJson(html);
                                          form.setFieldValue({
                                            [field.name]: {
                                              question: jsonValue,
                                            },
                                          });
                                        }}
                                      />
                                    </Form.Item>
                                    <Form.Item
                                      label="Hình ảnh"
                                      name={[field.name, "image"]}
                                    >
                                      <Upload
                                        {...getPropsQuestion(index)}
                                        onChange={(event) =>
                                          handleImageUpload(event.file, index)
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
                                          {subFields.map(
                                            (subField, subIndex) => (
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
                                                  name={[
                                                    subField.name,
                                                    "option",
                                                  ]}
                                                  fieldKey={[
                                                    subField.fieldKey,
                                                    "option",
                                                  ]}
                                                  rules={[
                                                    {
                                                      required: true,
                                                      message:
                                                        "Vui lòng nhập lựa chọn",
                                                    },
                                                  ]}
                                                  style={{
                                                    flex: 1,
                                                    marginRight: 8,
                                                  }}
                                                >
                                                  <Input.TextArea
                                                    placeholder="Lựa chọn"
                                                    autoSize={{
                                                      minRows: 1,
                                                      maxRows: 5,
                                                    }}
                                                    style={{ width: "100%" }}
                                                  />
                                                </Form.Item>
                                                <CloseOutlined
                                                  onClick={() =>
                                                    remove(subIndex)
                                                  }
                                                  style={{
                                                    color: "red",
                                                    cursor: "pointer",
                                                    fontSize: "16px",
                                                    marginBottom: 8,
                                                    alignSelf: "center",
                                                  }}
                                                />
                                              </div>
                                            )
                                          )}
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
                                      <Input.TextArea
                                        autoSize={{ minRows: 1, maxRows: 3 }}
                                        placeholder="Đáp án"
                                      />
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
                              {fields.length > 0 && (
                                <Pagination
                                  current={currentPage}
                                  total={fields.length}
                                  pageSize={questionsPerPage}
                                  onChange={paginate}
                                  className="pagination-bar pt-4"
                                  responsive={true}
                                />
                              )}
                            </>
                            )
                          }}
                        </Form.List>
                      ) : (
                        <Result
                          status="warning"
                          subTitle="Hãy liên hệ với admin qua email 247learn.vn@gmail.com để được nâng cấp tài khoản."
                          title="Bạn chỉ có thể tạo tối đa 3 bài tập."
                        />
                      )}
                    </div>
                    {!isQuizLimitReached ? (
                      <div className="pt-2 text-end">
                        {!isTemplateMode && (
                          <>
                            <Button
                              className="custom-button"
                              type="primary"
                              style={{ marginRight: 8 }}
                              onClick={() => {
                                form.validateFields().then((values) => {
                                  handleSaveQuiz(values, "save_draft");
                                });
                              }}
                            >
                              Lưu Bản Nháp
                            </Button>

                            <Button
                              type="primary"
                              className="custom-button"
                              onClick={() => {
                                form.validateFields().then((values) => {
                                  setShowStudentSelectModal(true);
                                });
                              }}
                            >
                              Giao Bài Tập
                            </Button>
                            <Modal
                              title="Chọn Học Viên"
                              visible={showStudentSelectModal}
                              onCancel={() => setShowStudentSelectModal(false)}
                              onOk={() => {
                                setShowStudentSelectModal(false); // Đóng modal chọn học viên
                                handleSaveQuiz(form.getFieldsValue(), "assign");
                              }}
                              okButtonProps={{ className: "custom-button" }}
                            >
                              <Form.Item
                                name="studentIds"
                                rules={isQuizLimitReached && []}
                                labelCol={{ span: 24 }}
                                wrapperCol={{ span: 24 }}
                              >
                                <Select
                                  mode="multiple"
                                  placeholder="Chọn học viên"
                                  onChange={handleStudentChange}
                                  value={selectedStudents}
                                  disabled={
                                    selectedCourse?.length > 1 ||
                                    isQuizLimitReached
                                  }
                                  style={{ width: "100%" }}
                                >
                                  {selectedCourse?.length > 1 ? (
                                    <Option key="all" value="all">
                                      Thêm tất cả
                                    </Option>
                                  ) : (
                                    <>
                                      <Option key="all" value="all">
                                        Chọn tất cả
                                      </Option>
                                      {studentsByCourse.map((student) => (
                                        <Option
                                          key={student._id}
                                          value={student._id}
                                        >
                                          {student?.lastName}{" "}
                                          {student?.firstName}
                                        </Option>
                                      ))}
                                    </>
                                  )}
                                </Select>
                              </Form.Item>
                            </Modal>
                          </>
                        )}

                        {isTemplateMode && (
                          <Button
                            className="custom-button"
                            onClick={() => {
                              form.validateFields().then((values) => {
                                handleSaveQuiz(values);
                              });
                            }}
                          >
                            Lưu Bài Mẫu
                          </Button>
                        )}
                      </div>
                    ) : null}
                  </>
                )}
              </>
            ) : (
              //Tự luận
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
