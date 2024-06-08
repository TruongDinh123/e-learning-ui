"use client"

import {Col, Input, Row} from 'antd';
import {memo, useEffect, useState} from 'react';
// import { initData } from '../setting';
import SelectQuizBlock from './selectQuizBlock';
import {useSelector} from 'react-redux';

const {Search} = Input;

const SearchBlock = ({dataFiltered, setDataFiltered}) => {
  const usersTested = useSelector((state) => state.quiz.usersTested);
  const allUsersTested = useSelector((state) => state.quiz.allUsersTested);
  const [textSearch, setTextSearch] = useState('');
  const [quizsFilter, setQuizsFilter] = useState([]);
  const onChange = (event) => {
    setTextSearch(event.target.value);
  };

  useEffect(() => {
    if (allUsersTested && (textSearch || quizsFilter.length)) {
      let dataFiltered = JSON.parse(JSON.stringify(allUsersTested));

      if (textSearch) {
        dataFiltered = allUsersTested.filter(
          (userTested) =>
            userTested.firstName
              .toLowerCase()
              .includes(textSearch.toLowerCase()) ||
            userTested.lastName.toLowerCase().includes(textSearch.toLowerCase())
        );
      }

      if (quizsFilter.length) {
        const cloneQuizsFilter = JSON.parse(JSON.stringify(dataFiltered));
        let usersInQuizsFilter = [];
        quizsFilter.forEach((quizId) => {
          if (usersTested[quizId]) {
            usersInQuizsFilter = usersInQuizsFilter.concat(
              usersTested[quizId].usersTested
            );
          }
        });

        cloneQuizsFilter.forEach((dataFilteredItem, index) => {
          const resultIndex = usersInQuizsFilter.findIndex(
            (item) => item._id === dataFilteredItem._id
          );
          if (resultIndex === -1) {
            dataFiltered.splice(index, 1, null);
          }
        });

        dataFiltered = dataFiltered.filter((item) => item);
      }
      setDataFiltered(dataFiltered);
    } else {
      setDataFiltered(null);
    }
  }, [allUsersTested, quizsFilter, setDataFiltered, textSearch, usersTested]);

  return (
    <Row>
      <Col span={4}>
        <Search
          placeholder='Nhập họ và tên'
          onChange={onChange}
          style={{
            width: 200,
          }}
        />
      </Col>
      <Col span={16}>
        <SelectQuizBlock
          quizsFilter={quizsFilter}
          setQuizsFilter={setQuizsFilter}
        />
      </Col>
    </Row>
  );
};

export default memo(SearchBlock);
