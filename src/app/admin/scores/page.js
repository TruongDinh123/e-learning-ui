'use client';

import React, {useEffect, useState} from 'react';
import {Button, Col, List, Row, message} from 'antd';
import ListItem from './listItem';
import {useDispatch, useSelector} from 'react-redux';
import {getScoreHasUsersTested} from '../../../features/Quiz/quizSlice';
import TitleList from './titleList';
import SearchBlock from './searchBlock/page';
import ScoreCustom from './scoreCustom';

const Scores = () => {
  const dispatch = useDispatch();
  const quizAndUserTested = useSelector(
    (state) => state.quiz.quizAndUserTested
  );
  const isScoresUsertestedLoading = useSelector(
    (state) => state.quiz.isScoresUsertestedLoading
  );
  const quiz = useSelector((state) => state.quiz.quiz);
  const [refresh, setRefresh] = useState(0);
  const [dataFiltered, setDataFiltered] = useState(null);
  const [quizsFilter, setQuizsFilter] = useState([]);

  useEffect(() => {
    if (refresh && quiz && quiz.length) {
      const quizIds = quiz.map((item) => item._id);
      dispatch(getScoreHasUsersTested({quizIds})).then((res) => {
        message.success('Đã làm mới dữ liệu!', 1.5);
      });
    }
  }, [dispatch, quiz, refresh]);

  const handleRefresh = () => {
    setRefresh(refresh + 1)
  }

  return (
    <div className='p-3 mb-80'>
      <Row gutter={[24, 0]}>
        <Col sx={{span: 12}} lg={{span: 6}}>
          <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
            Quản lý điểm thi
          </h1>
        </Col>
        <Col sx={{span: 12}} lg={{span: 12}}>
          <Button
            type='primary'
            htmlType='submit'
            className='custom-button mb-20'
            loading={isScoresUsertestedLoading}
            onClick={handleRefresh}
          >
            Làm mới dữ liệu
          </Button>
        </Col>
      </Row>

      <SearchBlock
        dataFiltered={dataFiltered}
        setDataFiltered={setDataFiltered}
        quizsFilter={quizsFilter}
        setQuizsFilter={setQuizsFilter}
      />

      <ScoreCustom handleRefresh={handleRefresh} />

      <List
        header={<TitleList />}
        bordered
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: 10,
        }}
        loading={!!!quizAndUserTested}
        dataSource={dataFiltered || quizAndUserTested || []}
        renderItem={(item, index) => (
          <ListItem key={index} quizsFilter={quizsFilter} userTested={item} />
        )}
      />
    </div>
  );
};

export default Scores;
