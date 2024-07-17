import React, {memo, useEffect, useState} from 'react';
import {Select, Typography} from 'antd';
import {useSelector} from 'react-redux';
const {Title} = Typography;

const SelectQuizBlock = ({quizCurrent, courseCurrent, setQuizCurrent}) => {
  const quizPresent = useSelector((state) => state.quiz.quizPresent);
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);

  const handleChange = (value) => {
    setQuizCurrent(value);
  };

  useEffect(() => {
    if (quiz && courseCurrent) {
      let isExistQuizCurrent = false;
      const initData = quiz
        .filter(
          (quizItem) =>
            quizItem.courseIds.findIndex(
              (item) => item._id === courseCurrent
            ) !== -1
        )
        .map((quizItem) => {
          if (quizItem._id === quizPresent?._id) isExistQuizCurrent = true;
          return {
            label: quizItem.name,
            value: quizItem._id,
          };
        });

      setSelectData(initData);

      if (!initData.length) {
        setQuizCurrent('');
        return;
      }
      const findIndexCurrent = initData.findIndex(
        (item) => item.value === quizCurrent
      );
      if (!isExistQuizCurrent) {
        quizCurrent && findIndexCurrent !== -1
          ? setQuizCurrent(quizCurrent)
          : setQuizCurrent('');
        return;
      }

      if (isExistQuizCurrent) {
        (!quizCurrent || findIndexCurrent === -1) &&
          setQuizCurrent(quizPresent?._id);
      }
    }
  }, [courseCurrent, quiz, quizCurrent, quizPresent?._id, setQuizCurrent]);

  return (
    <div>
      <Title level={5} className='mb-2'>
        Chọn bài thi đại diện
      </Title>
      <Select
        showSearch
        style={{
          width: 300,
        }}
        defaultValue={quizCurrent}
        value={quizCurrent}
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
    </div>
  );
};
export default memo(SelectQuizBlock);
