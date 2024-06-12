import React, {memo, useEffect, useState} from 'react';
import {Button, Select, Space, Typography, message} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {activeQuizPresent} from '../../../../../features/Quiz/quizSlice';
import {activeCoursePresent} from '../../../../../features/Courses/courseSlice';
const {Title} = Typography;

const SelectQuizBlock = ({courseCurrent}) => {
  const dispatch = useDispatch();
  const quizPresent = useSelector((state) => state.quiz.quizPresent);
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [quizCurrent, setQuizCurrent] = useState(quizPresent?._id);
  const quiz = useSelector((state) => state.quiz.quiz);
  const [selectData, setSelectData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

      !isExistQuizCurrent && setQuizCurrent('');
      !quizCurrent && isExistQuizCurrent && setQuizCurrent(quizPresent?._id);
    }
  }, [courseCurrent, quiz, quizCurrent, quizPresent]);

  const activeQuizPresentHandle = () => {
    if (quizCurrent || courseCurrent !== coursePresent._id) setIsLoading(true);

    if (quizCurrent) {
      quizCurrent &&
        dispatch(
          activeQuizPresent({
            newQuizId: quizCurrent,
            oldQuizId: quizPresent?._id || null,
          })
        ).then(() => {
          message.success('Đã cập nhật bài thi đại diện!', 3);
          setIsLoading(false);
        });
    }
    if (courseCurrent !== coursePresent._id) {
      dispatch(
        activeCoursePresent({
          newCourseId: courseCurrent,
          oldCourseId: coursePresent?._id || null,
        })
      ).then(() => {
        message.success('Đã cập nhật cuộc thi đại diện!', 3);
        setIsLoading(false);
      });
    }
  };

  return (
    <tr>
      <td>
        <Title level={5} className='mb-0'>
          Chọn bài thi đại diện
        </Title>
      </td>
      <td>
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
          filterOption={(input, option) =>
            (option?.label ?? '').includes(input)
          }
          filterSort={(optionA, optionB) =>
            (optionA?.label ?? '')
              .toLowerCase()
              .localeCompare((optionB?.label ?? '').toLowerCase())
          }
          options={selectData}
        />
      </td>
      <td>
        <Button
          type='primary'
          onClick={activeQuizPresentHandle}
          className='me-3 custom-button'
          style={{width: '100%'}}
          loading={isLoading}
        >
          Cập nhật
        </Button>
      </td>
    </tr>
  );
};
export default memo(SelectQuizBlock);
