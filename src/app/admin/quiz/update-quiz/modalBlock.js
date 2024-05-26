'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  Form,
  Modal,
  message,
  Button,
  DatePicker,
  Spin,
} from 'antd';
import React, {useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  updateQuiz,
  uploadFileQuiz,
  uploadQuestionImage,
} from '@/features/Quiz/quizSlice';
import {useRouter} from 'next/navigation';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import ModalEmptyContent from './modalEmptyContent';
import ModalContent from './modalContent';


const ModalBlock = ({
  form,
  quizId,
  quizToUpdate,
  isLoading,
  isModalOpen,
  setIsModalOpen,
  setIsLoading,
}) => {
  const dispatch = useDispatch();
  const [messageApi] = message.useMessage();
  const router = useRouter();
  const [file, setFile] = useState(null);
  const [fileQuestion, setFileQuestion] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);
  const quiz = useSelector((state) => state.quiz.oneQuizInfo);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateQuiz = (values) => {
    setIsLoading(true);
    let formattedValues;

    const quizToUpdate = quiz.find((quiz) => quiz._id === quizId);

    if (quizToUpdate.type === 'multiple_choice') {
      formattedValues = {
        ...values,
        submissionTime: values?.submissionTime?.toISOString(),
        timeLimit: values?.timeLimit,

        questions: values.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
      };
    } else if (quizToUpdate.type === 'essay') {
      formattedValues = {
        ...values,
        submissionTime: values?.submissionTime?.toISOString(),

        essay: {
          title: values.essayTitle,
          content: values.essayContent,
        },
      };
    }

    dispatch(updateQuiz({quizId: quizId, formattedValues}))
      .then(unwrapResult)
      .then((res) => {
        const questionIds = res.metadata?.questions?.map((q) => q._id);

        if (file) {
          dispatch(uploadFileQuiz({quizId: quizId, filename: file})).then(
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
                    'An error occurred while uploading the question image.',
                  3.5
                );
              });
            }
          });
        }
        messageApi
          .open({
            type: 'Thành công',
            content: 'Đang thực hiện...',
            duration: 2.5,
          })
          .then(() => {
            setIsModalOpen(false);
            message.success(res.message, 1.5);
            router.push(`/admin/quiz/view-list-question/${quizId}`);
          });
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
        setIsLoading(false);
      });
  };

  return (
    <Modal
      title='Cập nhật bài tập'
      open={isModalOpen}
      onCancel={handleCancel}
      footer={<>
       <div className='pt-4 text-end'>
            <Button type='default' className='mr-4' onClick={handleCancel}>
              Hủy
            </Button>
            <Button
              type='primary'
              htmlType='submit'
              className='custom-button'
              loading={isLoading}
            >
              Lưu
            </Button>
          </div></>}
      width={1000}
    >
      {isLoading ? (
        <div className='flex justify-center items-center h-screen'>
          <Spin />
        </div>
      ) : (
        <Form
          form={form}
          name='quiz_form'
          initialValues={{
            questions: [{}],
          }}
          onFinish={handleUpdateQuiz}
        >
          <Form.Item label='Thời hạn nộp' name='submissionTime'>
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
          {form.getFieldValue('type') === 'multiple_choice' ? (
            <ModalContent
              form={form}
              fileQuestion={fileQuestion}
              setFileQuestion={setFileQuestion}
              setQuestionImages={setQuestionImages}
            />
          ) : (
            <ModalEmptyContent
              file={file}
              quiz={quiz}
              quizToUpdate={quizToUpdate}
              setFile={setFile}
            />
          )}
         
        </Form>
      )}
    </Modal>
  );
};

export default ModalBlock;
