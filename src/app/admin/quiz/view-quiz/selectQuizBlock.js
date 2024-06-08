import React, {memo, useEffect, useState} from 'react';
import {Button, Select, Space, Typography, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {activeQuizPresent} from '../../../../features/Quiz/quizSlice';
const {Title} = Typography;

const SelectQuizBlock = () => {
  const dispatch = useDispatch();
  const quizPresent = useSelector((state) => state.quiz.quizPresent);
  const [quizCurrent, setQuizCurrent] = useState(quizPresent?._id);
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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
  }, [quiz]);

  const activeQuizPresentHandle = () => {
    if (quizCurrent) {
      setIsLoading(true);
      quizCurrent &&
        dispatch(
          activeQuizPresent({
            newQuizId: quizCurrent,
            oldQuizId: quizPresent?._id || null,
          })
        ).then(() => {
          message.success('Đã cập nhật bài thi đại diện!', 1.5);
          setIsLoading(false);
        });
    }
  };

  useEffect(() => {
    quizPresent && setQuizCurrent(quizPresent._id);
  }, [quizPresent, setQuizCurrent]);
  console.log(quizPresent, 'quizPresentquizPresent', quizCurrent, quiz);

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
      <Title level={5} className='mb-0'>
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

      <Button
        type='primary'
        onClick={activeQuizPresentHandle}
        className='me-3 custom-button'
        style={{width: '100%'}}
        loading={isLoading}
      >
        Cập nhật
      </Button>
    </Space>
  );
};
export default memo(SelectQuizBlock);
