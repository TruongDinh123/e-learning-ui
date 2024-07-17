import {Button, message} from 'antd';
import {Fragment, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {activeQuizPresent} from '../../../../../features/Quiz/quizSlice';
import {activeCoursePresent} from '../../../../../features/Courses/courseSlice';

const ModalFooter = ({
  quizCurrent,
  courseCurrent,
  handleCancel,

  isLoading,
  setIsLoading,
}) => {
  const dispatch = useDispatch();
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const quizPresent = useSelector((state) => state.quiz.quizPresent);

  const showMessage = (text, type) => {
    const textInit = text ? text : 'Đã cập nhật bài thi đại diện!';
    const typeInit = type ? type : 'success';
    message.open({
      content: textInit,
      type: typeInit,
      duration: 3,
    });
    setIsLoading(false);
    type !== 'warning' && handleCancel();
  };

  const handleOk = () => {
    if (!quizCurrent)
      return showMessage('Chưa chọn bài thi đại diện', 'warning');
    if (quizCurrent && courseCurrent !== coursePresent._id) setIsLoading(true);

    if (quizCurrent === quizPresent?._id) {
      return showMessage();
    }
    dispatch(
      activeQuizPresent({
        newQuizId: quizCurrent,
        oldQuizId: quizPresent?._id || null,
      })
    ).then(() => {
      showMessage();
    });
    if (courseCurrent !== coursePresent._id) {
      dispatch(
        activeCoursePresent({
          newCourseId: courseCurrent,
          oldCourseId: coursePresent?._id || null,
        })
      ).then(() => {
        showMessage();
      });
    }
  };

  return (
    <Fragment>
      <Button key='cancle' type='default' onClick={handleCancel}>
        Hủy
      </Button>
      <Button
        key='ok'
        type='primary'
        onClick={handleOk}
        className='custom-button'
        loading={isLoading}
      >
        Cập nhật
      </Button>
    </Fragment>
  );
};

export default ModalFooter;
