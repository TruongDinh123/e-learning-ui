'use client';
import {Table, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {deleteQuiz} from '@/features/Quiz/quizSlice';
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
  const isLoading = useSelector((state) => state.quiz.isLoadingQuiz);
  const [data, setData] = useState([]);

  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});

  const router = useRouter();

  const handleDeleteQuiz = useCallback(
    ({quizId}) => {
      dispatch(deleteQuiz({quizId}))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
          } else {
            message.success('Đã xoá thành công!', 1.5);
          }
        })
        .catch((error) => {
          console.log(error);
          message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
        });
    },
    [dispatch]
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
