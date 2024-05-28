import React, {memo, useEffect, useState} from 'react';
import {Select, Space, Typography} from 'antd';
import {useSelector} from 'react-redux';
const {Title} = Typography;

const SelectQuizBlock = ({quizCurrent, setQuizCurrent}) => {
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);

  const handleChange = (value) => {
    setQuizCurrent(value);
  };

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
    <Space
      direction='vertical'
      style={{
        marginBottom: '20px',
      }}
      size='middle'
    >
      <Title level={4}>Chọn bài thi</Title>
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
    </Space>
  );
};
export default memo(SelectQuizBlock);
