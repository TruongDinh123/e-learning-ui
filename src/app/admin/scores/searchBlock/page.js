'use client';

import {Col, Input, Row} from 'antd';
import {memo, useEffect, useState} from 'react';
// import { initData } from '../setting';
import SelectQuizBlock from './selectQuizBlock';
import {useSelector} from 'react-redux';

const {Search} = Input;

const SearchBlock = ({setDataFiltered, quizsFilter, setQuizsFilter}) => {
  const usersTested = useSelector((state) => state.quiz.usersTested);
  const quizAndUserTested = useSelector(
    (state) => state.quiz.quizAndUserTested
  );
  const [textSearch, setTextSearch] = useState('');
  const onChange = (event) => {
    setTextSearch(event.target.value);
  };

  useEffect(() => {
    if (quizAndUserTested && textSearch) {
      let dataFiltered = JSON.parse(JSON.stringify(quizAndUserTested));

      if (textSearch) {
        dataFiltered = quizAndUserTested.filter((userTested) => {
          const textSearchLowerCase = textSearch.toLowerCase();

          return (
            userTested.firstName.toLowerCase().includes(textSearchLowerCase) ||
            userTested.lastName.toLowerCase().includes(textSearchLowerCase)
          );
        });
      }

      setDataFiltered(dataFiltered.reverse());
    } else {
      setDataFiltered(null);
    }
  }, [quizAndUserTested, setDataFiltered, textSearch, usersTested]);

  return (
    <Row gutter={[230, 24]}>
      <Col sx={{span: 20}} lg={{span: 4}}>
        <Search
          placeholder='Nhập họ và tên'
          onChange={onChange}
          style={{
            width: 200,
          }}
        />
      </Col>
      <Col sx={{span: 20}} lg={{span: 16}}>
        <SelectQuizBlock
          quizsFilter={quizsFilter}
          setQuizsFilter={setQuizsFilter}
        />
      </Col>
    </Row>
  );
};

export default memo(SearchBlock);
