'use client';

import {useSelector} from 'react-redux';
import SelectCourseBlock from './selectCourseBlock';
import SelectQuizBlock from './selectQuizBlock';
import {useState} from 'react';
import {Modal} from 'antd';
import ModalFooter from './modalFooter';

const ModalBlock = ({isOpen, handleCancel, isLoading, setIsLoading}) => {
  const [quizCurrent, setQuizCurrent] = useState('');
  const coursePresent = useSelector((state) => state.course.coursePresent);
  const [courseCurrent, setCourseCurrent] = useState(coursePresent?._id);

  return (
    <Modal
      title='Cập nhật bài thi đại diện'
      open={isOpen}
      onCancel={handleCancel}
      maskClosable={false}
      width={'fit-content'}
      footer={
        <ModalFooter
          quizCurrent={quizCurrent}
          courseCurrent={courseCurrent}
          handleCancel={handleCancel}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
        />
      }
    >
      <SelectCourseBlock
        courseCurrent={courseCurrent}
        setCourseCurrent={setCourseCurrent}
      />
      <SelectQuizBlock
        quizCurrent={quizCurrent}
        courseCurrent={courseCurrent}
        setQuizCurrent={setQuizCurrent}
      />
    </Modal>
  );
};

export default ModalBlock;
