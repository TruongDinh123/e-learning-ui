'use client';

import React, {useEffect, useState} from 'react';
import {Col, List, Row, Space} from 'antd';
import ListItem from './listItem';
import {useDispatch, useSelector} from 'react-redux';
import {
  getScoreByQuizId,
  getUserTested,
} from '../../../features/Quiz/quizSlice';
import SelectQuizBlock from './selectQuizBlock';
import TitleList from './titleList';

const Scores = () => {
  const dispatch = useDispatch();
  const usersTested = useSelector((state) => state.quiz.usersTested);
  const quiz = useSelector((state) => state.quiz.quiz);

  const [quizCurrent, setQuizCurrent] = useState(
    quiz?.[0]?._id || '663a4d0430875358d4318fdc'
  );

  useEffect(() => {
    quizCurrent &&
      dispatch(
        getUserTested({
          quizId: quizCurrent,
        })
      );
  }, [dispatch, quizCurrent]);

  useEffect(() => {
    quizCurrent && dispatch(getScoreByQuizId({quizId: quizCurrent}));
  }, [dispatch, quizCurrent]);

  return (
    <div className='p-3'>
      <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
        Quản lý điểm thi
      </h1>

      <SelectQuizBlock
        quizCurrent={quizCurrent}
        setQuizCurrent={setQuizCurrent}
      />

      <List
        header={<TitleList />}
        bordered
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: 10,
        }}
        loading={!!!usersTested}
        dataSource={usersTested || []}
        renderItem={(item, index) => <ListItem key={index} userTested={item} />}
      />
    </div>
  );
};

export default Scores;
