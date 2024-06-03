'use client';
import {Form, message, Button} from 'antd';
import React, {useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {viewAQuiz} from '@/features/Quiz/quizSlice';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';
import ModalBlock from './modalBlock';

export default function UpdateQuiz(props) {
  const {quizId} = props;
  const dispatch = useDispatch();
  const [form] = Form.useForm();

  const quiz = useSelector((state) => state.quiz.oneQuizInfo);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizToUpdate, setQuizToUpdate] = useState(null);
  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (!quiz) {
      setIsLoading(true);
      dispatch(viewAQuiz({quizId: quizId})).then(() => {
        setIsLoading(false);
      });
    }
  }, [dispatch, quiz, quizId]);

  useEffect(() => {
    if (isModalOpen && quiz) {
      const quizToUpdateInit = quiz.find((quiz) => quiz._id === quizId);

      quizToUpdateInit && form.setFieldsValue({
        name: quizToUpdateInit.name,
        type: quizToUpdateInit.type,
        courseIds: quizToUpdateInit.courseIds,
        studentIds: quizToUpdateInit.studentIds,
        essayTitle: quizToUpdateInit.essay?.title,
        essayContent: quizToUpdateInit.essay?.content,
        attachment: quizToUpdateInit.essay?.attachment,
        questions: quizToUpdateInit.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => ({
            option: option,
          })),
          answer: question.answer,
          image: question?.image_url,
        })),
        submissionTime: quizToUpdateInit?.submissionTime
          ? dayjs(quizToUpdateInit.submissionTime)
          : undefined,
        timeLimit: quizToUpdateInit.timeLimit,
      });
      setQuizToUpdate(quizToUpdateInit);
    }
  }, [form, isModalOpen, quiz, quizId]);

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type='primary'
        onClick={showModal}
        className='me-3 custom-button'
        style={{width: '100%'}}
      >
        Cập nhật
      </Button>

      {isModalOpen && (
        <ModalBlock
          form={form}
          quizId={quizId}
          quizToUpdate={quizToUpdate}
          isLoading={isLoading}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
          setIsLoading={setIsLoading}
        />
      )}
    </React.Fragment>
  );
}
