'use client';
import {unwrapResult} from '@reduxjs/toolkit';
import {Form, Modal, message, Button} from 'antd';
import React, {useState} from 'react';
import {useDispatch} from 'react-redux';
import {
  updateQuiz,
  uploadFileQuiz,
  uploadQuestionImage,
} from '@/features/Quiz/quizSlice';
import 'react-quill/dist/quill.snow.css';
import 'react-quill/dist/quill.snow.css';
import ModalEmptyContent from './modalEmptyContent';
import ModalContent from './modalContent';
import TimeSubmit from './timeSubmit';

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
  const [file, setFile] = useState(null);
  const [fileQuestion, setFileQuestion] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleUpdateQuiz = (values) => {
    setIsLoading(true);
    let formattedValues;

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
    message.info('Đang thực hiện...');

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

        message.success(res.message, 1.5);

        setIsModalOpen(false);
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
      footer={<></>}
      width={1000}
      loading={isLoading}
      maskClosable={false}
    >
      <Form
        form={form}
        name='quiz_form'
        initialValues={{
          questions: [{}],
        }}
        onFinish={handleUpdateQuiz}
        
      >
        <TimeSubmit quizId={quizId} form={form} />

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
            quiz={quizToUpdate}
            quizToUpdate={quizToUpdate}
            setFile={setFile}
          />
        )}

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
        </div>
      </Form>
    </Modal>
  );
};

export default ModalBlock;
