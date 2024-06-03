'use client';

import React, {useEffect, useState} from 'react';
import {Button, Col, List, Row, Space, message} from 'antd';
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
  const [refresh, setRefresh] = useState(true);

  const [quizCurrent, setQuizCurrent] = useState(
    quiz?.[0]?._id || '663a4d0430875358d4318fdc'
  );

  useEffect(() => {
    if (refresh) {
      quizCurrent &&
        dispatch(
          getUserTested({
            quizId: quizCurrent,
          }),
          dispatch(getScoreByQuizId({quizId: quizCurrent}))
        ).then(() => {
          message.success("Đã làm mới dữ liệu!", 1.5);
          setRefresh(false);
        });
    }
  }, [dispatch, quizCurrent, refresh]);

  return (
    <div className='p-3'>
      <Row gutter={2}>
        <Col className='gutter-row' span={6}>
          <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
            Quản lý điểm thi
          </h1>{' '}
        </Col>
        <Col className='gutter-row' span={6}>
          <Button
            type='primary'
            htmlType='submit'
            className='custom-button'
            loading={refresh}
            onClick={() => setRefresh(true)}
          >
            Làm mới dữ liệu
          </Button>
        </Col>
      </Row>

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
