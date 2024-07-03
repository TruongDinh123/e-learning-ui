'use client';
import {Table} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import React from 'react';
import '../view-quiz/page.css';
import {columns, initData} from './setting';
import {updateNewCourseIdsQuizCreated} from '../../../../features/Quiz/quizSlice';
import SearchBlock from './searchBlock/page';
import UpdateQuizScoursePresent from './updateQuizScoursePresent/page';

const ViewQuiz = () => {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz.quiz);
  const isLoadingQuiz = useSelector((state) => state.quiz.isLoadingQuiz);

  const [data, setData] = useState([]);
  const [dataFilterd, setDataFiltered] = useState([]);

  useEffect(() => {
    quiz &&
      setData(
        initData({
          quiz,
        })
      );

    return () => dispatch(updateNewCourseIdsQuizCreated());
  }, [dispatch, quiz]);


  return (
    <div className='p-3'>
      <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
        Danh sách đề thi
      </h1>
      <SearchBlock quiz={quiz} setDataFiltered={setDataFiltered} />

      <UpdateQuizScoursePresent />
      
      <Table
        columns={columns}
        dataSource={dataFilterd || data}
        pagination={{pageSize: 5}}
        loading={isLoadingQuiz}
      />
    </div>
  );
};

export default ViewQuiz;
