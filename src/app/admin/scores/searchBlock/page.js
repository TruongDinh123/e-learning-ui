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
    console.log(event.target.value, 'gasdfs');
    setTextSearch(event.target.value);
  };
  console.log(allUsersTested, 'datadata', quizsFilter, usersTested);

  useEffect(() => {
    if (allUsersTested && (textSearch || quizsFilter.length)) {
      let dataFiltered = JSON.parse(JSON.stringify(allUsersTested));

      if (textSearch) {
        dataFiltered = allUsersTested.filter((userTested) => 
          userTested.firstName
            .toLowerCase()
            .includes(textSearch.toLowerCase()) ||
            userTested.lastName
              .toLowerCase()
              .includes(textSearch.toLowerCase())
        );
      }
      console.log(dataFiltered, 'dataFiltereddataFiltered', quizsFilter);
      if (quizsFilter.length) {
        const closeQuizsFilter = JSON.parse(JSON.stringify(dataFiltered));
        quizsFilter.forEach((quizId) => {
          closeQuizsFilter.forEach((dataFilteredItem) => {
            const resultIndex = usersTested[quizId].usersTested.findIndex(
              (item) => item._id === dataFilteredItem._id
            );
            if (resultIndex === -1) {
              dataFiltered.splice(resultIndex, 1);
            }
          });
        });
      }

      setDataFiltered(dataFiltered);
    } else {
      setDataFiltered(null)
    };
  }, [allUsersTested, quizsFilter, setDataFiltered, textSearch, usersTested]);

  return (
    <Row>
      <Col span={4}>
        <Search
          placeholder='Nhập tên đề thi'
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
