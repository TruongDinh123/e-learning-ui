'use client';
import {Form, message, Spin, Result} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  DeldraftQuiz,
  createQuiz,
  deleteQuestionImage,
  draftQuiz,
  addQuizStore,
  uploadFileQuiz,
  uploadQuestionImage,
} from '@/features/Quiz/quizSlice';
import {useRouter} from 'next/navigation';
import './page.css';
import {refreshAUser} from '@/features/User/userSlice';
import 'react-quill/dist/quill.snow.css';
import Questions from './QuestionsBlock/Questions';
import QuestionHead from './QuestionsBlock/QuestionHead';
import EssayBlock from './EssayBlock';
import HeaderBlock from './headerBlock/page';
import useCoursesData from '../../../../hooks/useCoursesData';

export default function QuizCreator() {
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const coursesStore = useCoursesData();
  const [messageApi, contextHolder] = message.useMessage();
  const [selectedCourse, setSelectedCourse] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [studentsByCourse, setStudentsByCourse] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [isTemplateMode, setIsTemplateMode] = useState(false);
  const [selectedQuizTemplate, setSelectedQuizTemplate] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  // const [quizType, setQuizType] = useState("multiple_choice");
  const [selectedQuizId, setSelectedQuizId] = useState(null);
  const [initialQuestions, setInitialQuestions] = useState([]);
  const [deletedQuestionIds, setDeletedQuestionIds] = useState([]);
  const quizType = 'multiple_choice';
  // const selectedCourse = '6634fc03bf25515f1e563504';
  const [file, setFile] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);
  const coursePresent = useSelector((state) => state.course.coursePresent);

  const questionsAreEqual = (q1, q2) => {
    // So sánh nội dung câu hỏi và câu trả lời
    if (q1.question.trim() !== q2.question.trim() || q1.answer !== q2.answer) {
      return false;
    }
    // Đảm bảo rằng cả hai đều có options là mảng các chuỗi
    const options1 = q1.options
      .map((opt) => (typeof opt === 'object' ? opt.option : opt))
      .map((opt) => opt.trim());
    const options2 = q2.options
      .map((opt) => (typeof opt === 'object' ? opt.option : opt))
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

  //hàm xử lý save quiz
  const handleSaveQuiz = (values, action) => {
    if (!values?.submissionTime?.toISOString()) {
      message.error('Thời hạn nộp bài là bắt buộc', 3.5);
      return;
    }

    if (!selectedCourse.length) {
      message.error('Khoá học là bắt buộc', 3.5);
      return;
    }

    if (!values?.name) {
      message.error('Tên bài tập là bắt buộc', 3.5);
      return;
    }

    setIsLoading(true);

    // Chuẩn bị dữ liệu câu hỏi
    const currentQuestions = form.getFieldValue('questions') || [];

    const normalizedCurrentQuestions = currentQuestions.map((q) => ({
      ...q,
      options: q?.options?.map((opt) =>
        typeof opt === 'object' ? opt.option : opt
      ),
    }));

    // Lọc và chuẩn bị câu hỏi để lưu
    const questionsToSave = normalizedCurrentQuestions.filter((q) => {
      if (!q._id) return true;
      const originalQuestion = initialQuestions.find((iq) => iq._id === q._id);
      // Câu hỏi đã chỉnh sửa có _id và nội dung khác với normalizedInitialQuestions
      return originalQuestion ? !questionsAreEqual(q, originalQuestion) : false;
    });

    if (quizType === 'multiple_choice') {
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
      studentIds: action === 'assign' ? selectedStudents : [],
      questions: questionsToSave,
      isDraft: action === 'save_draft',
      isTemplateMode: action === 'assign' ? isTemplateMode : false,
      deletedQuestionIds: deletedQuestionIds,
    };

    // Thêm isDraft vào formattedValues dựa trên action
    if (action === 'save_draft') {
      formattedValues.isDraft = true;
      if (selectedQuizId) {
        formattedValues.quizIdDraft = selectedQuizId;
      }
    }

    let studentIds = selectedStudents;
    if (selectedStudents.includes('all')) {
      studentIds = studentsByCourse.map((student) => student._id);
    }

    let questions = form.getFieldValue('questions') || [];
    const apiAction = action === 'save_draft' ? draftQuiz : createQuiz;

    if (selectedQuizTemplate) {
      formattedValues = {
        type: quizType,
        name: values.name,
        courseIds: selectedCourse,
        studentIds: studentIds,
        questions: questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
        submissionTime: values?.submissionTime?.toISOString(),
        timeLimit: values?.timeLimit,
      };
    } else {
      // Xử lý cho trường hợp không sử dụng bài tập mẫu
      if (apiAction === createQuiz && quizType === 'multiple_choice') {
        formattedValues = {
          ...formattedValues,
          type: quizType,
          submissionTime: values?.submissionTime?.toISOString(),
          courseIds: selectedCourse,
          studentIds: studentIds,
          timeLimit: values?.timeLimit,
          questions: questions.map((question) => ({
            ...question,
            options: question.options.map((option) => option.option),
          })),
        };
      } else if (apiAction === createQuiz && quizType === 'essay') {
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

      if (selectedLesson && selectedLesson !== '') {
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
        let courseIdsInfo = [];
        coursesStore.forEach(course => {
          if(selectedCourse.includes(course._id)) {
            courseIdsInfo.push({
              _id: course._id,
              name: course.name
            })
          }
        })
        res.metadata.courseIds = courseIdsInfo;
        dispatch(addQuizStore(res.metadata));

        setIsLoadingApi(true);
        const quizId = res.metadata?._id;
        const questionIds = res.metadata?.questions?.map((q) => q._id);
        const userId = localStorage?.getItem('x-client-id');
        let uploadPromises = [];
        if (file) {
          const fileUploadPromise = dispatch(
            uploadFileQuiz({quizId: quizId, filename: file})
          ).then((res) => {
            if (res.status) {
              setFile(null);
            }
          });
          uploadPromises.push(fileUploadPromise);
        }

        if (apiAction === createQuiz || apiAction === draftQuiz) {
          if (questionImages) {
            questionImages.forEach((imageFile, index) => {
              if (
                imageFile &&
                imageFile.uploaded === false &&
                questionIds[index]
              ) {
                const imageUploadPromise = dispatch(
                  uploadQuestionImage({
                    quizId: quizId,
                    questionId: questionIds[index],
                    filename: imageFile.file,
                    isTemplateMode,
                  })
                );
                uploadPromises.push(imageUploadPromise);
                imageFile.uploaded = true;
              } else if (imageFile && imageFile.deleteQuestionImage) {
                const imageDeletePromise = dispatch(
                  deleteQuestionImage({
                    quizId: quizId,
                    questionId: questionIds[index],
                    isTemplateMode,
                  })
                );
                uploadPromises.push(imageDeletePromise);
              }
            });
          }
          if (action !== 'save_draft') {
            const deleteDraftPromise = dispatch(
              DeldraftQuiz({quizIdDraft: selectedQuizId})
            );
            uploadPromises.push(deleteDraftPromise);
          }
        }

        Promise.all(uploadPromises).then(() => {
          setIsLoadingApi(false);
          if (apiAction === draftQuiz) {
            message.success('Tạo bài nháp thành công', 2.5);
            router.push('/admin/courses');
          }
          dispatch(refreshAUser(userId));
        });
      })
      .catch((error) => {
        setIsLoading(false);
        if (error.status === 403 && error.name === 'BadRequestError') {
          message.error('A quiz for this lesson already exists.', 3.5);
          setIsLoading(false);
        } else {
          message.error(
            error.response?.data?.message ||
              'An error occurred while saving the quiz.',
            3.5
          );
          setIsLoading(false);
        }
      })
      .finally(() => {
        setIsLoadingApi(false);
      });

    if (isTemplateMode) {
      router.push('/admin/quiz/template-quiz');
    } else if (apiAction === createQuiz) {
      router.push(`/admin/quiz/view-quiz`);
    }
  };

  const handleFinishFailed = () => {
    // Kiểm tra nếu người dùng chưa chọn khóa học và không phải là tạo bài tập mẫu
    if (!selectedCourse?.length && !isTemplateMode) {
      message.warning(
        'Vui lòng chọn ít nhất một khóa học trước khi tiếp tục.',
        3.5
      );
    }
    if (!selectedStudents?.length && !isTemplateMode) {
      message.warning(
        'Vui lòng chọn ít nhất một học viên trước khi tiếp tục.',
        3.5
      );
    }
  };

 

  return (
    <div className='p-3'>
      {contextHolder}
      <div className='overflow-y-auto h-screen pb-28 scrollbar-thin justify-center items-center grid-container'>
        <h1 className='text-2xl mb-5'>
          {isTemplateMode ? 'Tạo bài tập mẫu' : 'Tạo bài tập'}
        </h1>
        {isLoading || isLoadingApi ? (
          <div className='flex justify-center items-center h-screen'>
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            name='quiz_form'
            initialValues={{
              questions: [{}],
              courseIds: coursePresent ? [coursePresent._id] : []
            }}
            onFinish={handleSaveQuiz}
            onFinishFailed={handleFinishFailed}
          >
            <HeaderBlock
              form={form}
              setInitialQuestions={setInitialQuestions}
              setQuestionImages={setQuestionImages}
              setSelectedQuizTemplate={setSelectedQuizTemplate}
              setSelectedQuizId={setSelectedQuizId}
              selectedCourse={selectedCourse}
              setSelectedCourse={setSelectedCourse}
            />

            {quizType === 'multiple_choice' ? (
              <>
                <QuestionHead isTemplateMode={isTemplateMode} />
                {isTemplateMode || true ? (
                  <Questions
                    form={form}
                    setQuestionImages={setQuestionImages}
                    questionImages={questionImages}
                    selectedQuizTemplate={selectedQuizTemplate}
                    isTemplateMode={isTemplateMode}
                    handleSaveQuiz={handleSaveQuiz}
                    setDeletedQuestionIds={setDeletedQuestionIds}
                    deletedQuestionIds={deletedQuestionIds}
                  />
                ) : (
                  <Result
                    status='warning'
                    subTitle='Hãy liên hệ với admin qua email gdpl.stp@bentre.gov.vn để được nâng cấp tài khoản.'
                    title='Bạn chỉ có thể tạo tối đa 3 bài tập.'
                  />
                )}
              </>
            ) : (
              //Tự luận
              <EssayBlock setFile={setFile} file={file} isLoading={isLoading} />
            )}
          </Form>
        )}
      </div>
    </div>
  );
}
