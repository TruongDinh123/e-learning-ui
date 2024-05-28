import React, {useEffect, useState} from 'react';
import {Select} from 'antd';
import {useSelector} from 'react-redux';
const SelectQuizBlock = ({quizCurrent, setQuizCurrent}) => {
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);

  const handleChange = (value) => {
    setQuizCurrent(value);
  }

  useEffect(() => {
    if (quiz) {
      const initData = quiz.map((quizItem) => ({
        label: quizItem.name,
        value: quizItem._id,
      }));

      setSelectData(initData);
    }
  }, [quiz, quizCurrent]);

  return (
    <Select
      showSearch
      style={{
        width: 200,
      }}
      defaultValue={quizCurrent}
      onChange={handleChange}
      placeholder='Search to Select'
      optionFilterProp='children'
      filterOption={(input, option) => (option?.label ?? '').includes(input)}
      filterSort={(optionA, optionB) =>
        (optionA?.label ?? '')
          .toLowerCase()
          .localeCompare((optionB?.label ?? '').toLowerCase())
      }
      options={selectData}
    />
  );
};
export default SelectQuizBlock;
