'use client';

import {Col, Input, Row} from 'antd';
import {memo, useEffect, useState} from 'react';
// import { initData } from '../setting';
import SelectQuizBlock from './selectQuizBlock';
import {refreshStatusInit} from '../setting';

const {Search} = Input;

const SearchBlock = ({
  textSearch,
  setTextSearch,
  quizsFilter,
  setQuizsFilter,
  setRefreshStatus,
}) => {
  const [textInit, setTextInit] = useState('');
  const onBlurHandle = (event) => {
    setTextSearch(event.target.value);
    setRefreshStatus(refreshStatusInit.textSearch);
  };

  useEffect(() => {
    setTextInit(textSearch);
  }, [textSearch]);

  return (
    <Row gutter={[230, 24]}>
      <Col sx={{span: 20}} lg={{span: 4}}>
        <Search
          value={textInit}
          placeholder='Nhập họ và tên'
          onBlur={onBlurHandle}
          onChange={(e) => setTextInit(e.target.value)}
          style={{
            width: 200,
          }}
        />
      </Col>
      <Col sx={{span: 20}} lg={{span: 16}}>
        <SelectQuizBlock
          quizsFilter={quizsFilter}
          setQuizsFilter={setQuizsFilter}
          setRefreshStatus={setRefreshStatus}
        />
      </Col>
    </Row>
  );
};

export default memo(SearchBlock);
