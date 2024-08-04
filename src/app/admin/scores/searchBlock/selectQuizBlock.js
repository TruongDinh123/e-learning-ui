import React, {memo, useEffect, useState} from 'react';
import {Select, Space} from 'antd';
import {useSelector} from 'react-redux';
import {refreshStatusInit} from '../setting';

const SelectQuizBlock = ({
  quizsFilter,
  setQuizsFilter,
  setRefreshStatus,
}) => {
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);

  const handleChange = (value) => {
    setQuizsFilter(value);
    setRefreshStatus(refreshStatusInit.quizsFilter);
  };

  useEffect(() => {
    if (quiz) {
      const initData = quiz.map((quizItem) => ({
        label: quizItem.name,
        value: quizItem._id,
      }));

      setSelectData(initData);
    }
  }, [quiz, quizsFilter]);

  return (
    <Space
      direction='vertical'
      style={{
        marginBottom: '20px',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'end',
      }}
      size='middle'
    >
      <Select
        mode={'multiple'}
        showSearch
        style={{
          width: 300,
        }}
        defaultValue={quizsFilter}
        value={quizsFilter}
        onChange={handleChange}
        placeholder='Chọn đề thi'
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
