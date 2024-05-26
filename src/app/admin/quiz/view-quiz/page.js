'use client';
import {Table, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {deleteQuiz, updateStateQuiz} from '@/features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import React from 'react';
import {useRouter} from 'next/navigation';
import '../view-quiz/page.css';
import {useMediaQuery} from 'react-responsive';
import {columns, initData} from './setting';

const ViewQuiz = () => {
  const dispatch = useDispatch();

  const quiz = useSelector((state) => state.quiz.quiz);
  // const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);

  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});

  const router = useRouter();

  useEffect(() => {
    !quiz ? setIsLoading(true) : setIsLoading(false);
  }, [dispatch, quiz]);

  const handleDeleteQuiz = useCallback(
    ({quizId}) => {
      const updatedQuizzes = quiz.filter((q) => q._id !== quizId);
      dispatch(updateStateQuiz(updatedQuizzes));

      dispatch(deleteQuiz({quizId}))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            dispatch(updateStateQuiz(quiz));
            message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
          }
        })
        .catch((error) => {
          dispatch(updateStateQuiz(quiz));
          message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
        });
    },
    [dispatch, quiz]
  );

  useEffect(() => {
    quiz &&
      setData(
        initData({
          quiz,
          isMobile,
          router,
          handleDeleteQuiz,
        })
      );
  }, [handleDeleteQuiz, isMobile, quiz, router]);

  return (
    <div className='p-3'>
      <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
        Danh sách đề thi
      </h1>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{pageSize: 5}}
        loading={isLoading}
      />
    </div>
  );
};

export default ViewQuiz;
