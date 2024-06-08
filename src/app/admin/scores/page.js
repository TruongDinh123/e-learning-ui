'use client';

import React, {useEffect, useState} from 'react';
import {Button, Col, List, Row, message} from 'antd';
import ListItem from './listItem';
import {useDispatch, useSelector} from 'react-redux';
import {getScoreByQuizIds} from '../../../features/Quiz/quizSlice';
import TitleList from './titleList';
import SearchBlock from './searchBlock/page';

const Scores = () => {
  const dispatch = useDispatch();
  const allUsersTested = useSelector((state) => state.quiz.allUsersTested);
  const isScoresUsertestedLoading = useSelector(
    (state) => state.quiz.isScoresUsertestedLoading
  );
  const quiz = useSelector((state) => state.quiz.quiz);
  const [refresh, setRefresh] = useState(false);
  const [dataFiltered, setDataFiltered] = useState(null);

  useEffect(() => {
    if (refresh && quiz && quiz.length) {
      const quizIds = quiz.map((item) => item._id);
      dispatch(getScoreByQuizIds({quizIds})).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
      });
    }
  }, [dispatch, quiz, refresh]);

  console.log(allUsersTested, 'usersTestedusersTested', dataFiltered);
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
            loading={isScoresUsertestedLoading}
            onClick={() => setRefresh(true)}
          >
            Làm mới dữ liệu
          </Button>
        </Col>
      </Row>

      <SearchBlock
        dataFiltered={dataFiltered}
        setDataFiltered={setDataFiltered}
      />

      <List
        header={<TitleList />}
        bordered
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: 10,
        }}
        loading={!!!allUsersTested}
        dataSource={dataFiltered || allUsersTested || []}
        renderItem={(item, index) => <ListItem key={index} userTested={item} />}
      />
    </div>
  );
};

export default Scores;
