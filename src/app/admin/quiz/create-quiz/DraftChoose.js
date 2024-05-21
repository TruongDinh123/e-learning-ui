'use client';
import {Col, Form, message, Row, Select, Badge} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {memo, useEffect, useMemo, useState} from 'react';
import {createSelector, unwrapResult} from '@reduxjs/toolkit';
import {getDraftQuiz} from '@/features/Quiz/quizSlice';
import 'react-quill/dist/quill.snow.css';
import moment from 'moment';
import {SELECTED_COURSE_ID} from '../../../../constants';

const DraftChoose = ({
  form,
  setInitialQuestions,
  setQuestionImages,
  setSelectedQuizTemplate,
  setSelectedQuizId,
}) => {
  const dispatch = useDispatch();
  const status = useMemo(
    () => ({
      loading: 'load',
      finish: 'finish',
    }),
    []
  );
  const [draftQuizzes, setDraftquiz] = useState([]);
  const [isLoadingDraft, setIsLoadingDraft] = useState(status.loading);
  const [messageApi] = message.useMessage();

  const selectDraftQuiz = createSelector(
    [(state) => state.quiz.getdraftQuiz],
    (getdraftQuiz) => getdraftQuiz
  );

  // const coursesFromStore = useSelector((state) => selectCourses(state));
  const draftQuizFromStore = useSelector((state) => selectDraftQuiz(state));

  //fetch the draft
  useEffect(() => {
    const courseId = SELECTED_COURSE_ID;
    const filteredDraftQuizzes = draftQuizFromStore?.filter((quiz) =>
      quiz?.courseIds?.includes(courseId)
    );

    if (isLoadingDraft === status.finish) return;

    if (filteredDraftQuizzes.length > 0) {
      setIsLoadingDraft(status.finish);
      setDraftquiz(filteredDraftQuizzes);
      setInitialQuestions(filteredDraftQuizzes[0].questions);
    } else {
      dispatch(getDraftQuiz())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setIsLoadingDraft(status.finish);
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
        })
        .catch(() => {
          setIsLoadingDraft(status.finish);
        })
        .finally(() => {
          setIsLoadingDraft(status.finish);
        });
    }
  }, [
    dispatch,
    draftQuizFromStore,
    isLoadingDraft,
    messageApi,
    setInitialQuestions,
    status,
  ]);

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
          options: question.options.map((option) => ({option})),
          answer: question.answer,
          image_url: question.image_url,
        })),
      });

      const newQuestionImages = selectedQuiz.questions.map((question) => {
        if (question.image_url) {
          const urlParts = question.image_url.split('/');
          const fileName = urlParts[urlParts.length - 1];
          return {
            uid: question._id,
            name: fileName,
            status: 'done',
            url: question.image_url,
          };
        }
        return null;
      });

      setQuestionImages(newQuestionImages);
    } else {
      form.resetFields([
        'name',
        'type',
        'questions',
        'submissionTime',
        'timeLimit',
      ]);
      setQuestionImages([]);
    }
    setSelectedQuizTemplate('');
    setSelectedQuizId(selectedQuizId);
  };

  return (
    <Row gutter={16} className=''>
      <Col xs={24} sm={12} md={8} lg={6}>
        <Form.Item
          name='quizIdDraft'
          label='Bài tập nháp'
          labelCol={{span: 24}}
          wrapperCol={{span: 24}}
        >
          <Badge count={draftQuizzes.length} offset={[10, 0]} showZero>
            <Select
              onChange={handleDraftQuizSelect}
              placeholder='Chọn bài tập nháp'
              loading={isLoadingDraft === status.loading}
            >
              <Select.Option value=''>Không chọn</Select.Option>
              {draftQuizzes.map((quiz) => (
                <Select.Option key={quiz._id} value={quiz._id}>
                  {quiz.name}
                </Select.Option>
              ))}
            </Select>
          </Badge>
        </Form.Item>
      </Col>
    </Row>
  );
};

export default memo(DraftChoose);
