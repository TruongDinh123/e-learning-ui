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
    if (quizAndUserTested && (textSearch || quizsFilter.length)) {
      const result = [];
      let dataFiltered = JSON.parse(JSON.stringify(quizAndUserTested));

      if (textSearch) {
        dataFiltered = quizAndUserTested.filter(
          (userTested) =>
            userTested.firstName
              .toLowerCase()
              .includes(textSearch.toLowerCase()) ||
            userTested.lastName.toLowerCase().includes(textSearch.toLowerCase())
        );
      }

      if (quizsFilter.length) {
        const cloneDataFilterd = JSON.parse(JSON.stringify(dataFiltered));
        let usersInQuizsFilter = [];
        quizsFilter.forEach((quizId) => {
          if (usersTested[quizId]) {
            usersInQuizsFilter = usersInQuizsFilter.concat(
              usersTested[quizId].usersTested
            );
          }
        });

        cloneDataFilterd.forEach((cloneDataFilterdItem, index) => {
          const resultIndex = usersInQuizsFilter.findIndex(
            (item) =>
              item._id === cloneDataFilterdItem._id &&
              cloneDataFilterdItem.quizId === item.quizId
          );
          if (resultIndex !== -1) {
            result.push(cloneDataFilterdItem);
          }
        });

        dataFiltered = result;
      }
      setDataFiltered(dataFiltered.reverse());
    } else {
      setDataFiltered(null);
    }
  }, [
    quizAndUserTested,
    quizsFilter,
    setDataFiltered,
    textSearch,
    usersTested,
  ]);

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
