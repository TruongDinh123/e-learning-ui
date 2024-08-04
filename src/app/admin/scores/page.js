'use client';

import React, {useEffect} from 'react';
import {Button, Col, List, Row} from 'antd';
import ListItem from './listItem';
import {useSelector} from 'react-redux';
import TitleList from './titleList';
import SearchBlock from './searchBlock/page';
import ScoreCustom from './scoreCustom';
import {refreshStatusInit} from './setting';
import useScores from '../../../hooks/useScores';

const Scores = () => {
  const scoreHasUsersTested = useSelector(
    (state) => state.quiz.scoreHasUsersTested
  );
  const quizPresent = useSelector((state) => state.quiz.quizPresent);
  const numberUserInQuiz = useSelector((state) => state.quiz.numberUserInQuiz);

  const isScoresUsertestedLoading = useSelector(
    (state) => state.quiz.isScoresUsertestedLoading
  );
  const {
    refresh,
    quizsFilter,
    textSearch,
    pagination,
    setRefresh,
    setPagination,
    setQuizsFilter,
    setTextSearch,
    setRefreshStatus,
  } = useScores();

  useEffect(() => {
    quizPresent && quizPresent._id && setQuizsFilter([quizPresent?._id]);
  }, [quizPresent]);

  const handleRefresh = () => {
    setRefresh(refresh + 1);
  };

  const onChangeListScores = (page, pageSize) => {
    setPagination({
      limit: pageSize,
      skip: (page - 1) * pageSize,
      current: page,
    });
    setRefreshStatus(refreshStatusInit.pagination);
  };

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
        textSearch={textSearch}
        setTextSearch={setTextSearch}
        quizsFilter={quizsFilter}
        setQuizsFilter={setQuizsFilter}
        setRefreshStatus={setRefreshStatus}
      />

      <ScoreCustom handleRefresh={handleRefresh} />

      <List
        header={<TitleList />}
        bordered
        pagination={{
          position: 'bottom',
          align: 'start',
          pageSize: 10,
          onChange: onChangeListScores,
          total: numberUserInQuiz,
          current: pagination.current,
        }}
        loading={isScoresUsertestedLoading}
        dataSource={scoreHasUsersTested || []}
        renderItem={(item, index) => (
          <ListItem
            key={index}
            quizsFilter={quizsFilter}
            scoreHasUsersTestedItem={item}
          />
        )}
      />
    </div>
  );
};

export default Scores;
