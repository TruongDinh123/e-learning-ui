import {Col, Input, Row} from 'antd';
import SelectCourseBlock from './selectCourseBlock';
import {memo, useEffect, useState} from 'react';
import {initData} from '../setting';

const {Search} = Input;

const SearchBlock = ({quiz, setDataFiltered}) => {
  const [textSearch, setTextSearch] = useState('');
  const [coursesFilter, setCoursesFilter] = useState([]);

  const onChange = (event) => {
    console.log(event.target.value, 'gasdfs');
    setTextSearch(event.target.value);
  };
  console.log(quiz, 'datadata');
  useEffect(() => {
    if (quiz && quiz.length && (textSearch || coursesFilter.length)) {
      let dataSearch = [];
      console.log(coursesFilter, quiz, textSearch, 'otuoutoutoutout');
      quiz.forEach((quizItem) => {
        const checkCourseFilter =
          coursesFilter.length &&
          quizItem?.courseIds.find((item) => coursesFilter?.includes(item._id));
        const checkTextSearch =
          textSearch &&
          quizItem.name.toLowerCase().includes(textSearch.toLowerCase());

        let checkCondition = false;

        if (coursesFilter.length && textSearch)
          checkCondition = checkCourseFilter && checkTextSearch;
        else if (textSearch) checkCondition = checkTextSearch;
        else if (coursesFilter.length) checkCondition = checkCourseFilter;

        console.log(checkCondition, 'checkConditioncheckCondition');

        checkCondition && dataSearch.push(quizItem);
      });

      console.log(dataSearch, 'gasdfs');
      dataSearch = initData({quiz: dataSearch});
      setDataFiltered(dataSearch);
    } else {
      setDataFiltered(null);
    }
  }, [coursesFilter, quiz, setDataFiltered, textSearch]);

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
        <SelectCourseBlock
          coursesFilter={coursesFilter}
          setCoursesFilter={setCoursesFilter}
        />
      </Col>
    </Row>
  );
};

export default memo(SearchBlock);
