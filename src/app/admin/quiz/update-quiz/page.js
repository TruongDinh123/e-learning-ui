'use client';
import {Form, message, Button} from 'antd';
import React, {useEffect, useState} from 'react';
import {useSelector} from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import dayjs from 'dayjs';
import 'react-quill/dist/quill.snow.css';
import ModalBlock from './modalBlock';

export default function UpdateQuiz(props) {
  const {quizId} = props;
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quizToUpdate, setQuizToUpdate] = useState(null);
  const quizToUpdateInit = useSelector((state) => {
    return state.quiz.quiz?.find((quizItem) => quizItem._id === quizId);
  });

  const showModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (isModalOpen && quizToUpdateInit) {
      quizToUpdateInit &&
        form.setFieldsValue({
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
  }, [form, isModalOpen, quizToUpdateInit]);

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
