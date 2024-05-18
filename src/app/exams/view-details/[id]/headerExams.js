'use client';
import React from 'react';
import {Button, Modal} from 'antd';
import {useSelector} from 'react-redux';
import 'react-quill/dist/quill.snow.css';
const logo = '/images/logoimg.jpg';

const HeaderExams = ({
  quiz,
  isComplete,
  isTimeExceeded,
  submitted,
  submitting,
  predictAmount,
  predictAmountMaxScore,
  selectedAnswers,
  handleSubmit
}) => {
  const courseCurrent = useSelector((state) => state.course.courseInfo);
  console.log(courseCurrent, 'courseCurrentcourseCurrent');

  const completedAmount = () => {
    const predictedFirst = predictAmount.length !== 0;
    const predictedSecond = predictAmountMaxScore.length !== 0;

    return (
      Object.keys(selectedAnswers).length + predictedFirst + predictedSecond
    );
  };

  const showConfirmSubmit = () => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn nộp bài?',
      content: 'Một khi đã nộp, bạn không thể chỉnh sửa các câu trả lời.',
      okText: 'Nộp bài',
      cancelText: 'Hủy bỏ',
      onOk() {
        handleSubmit();
      },
      okButtonProps: {className: 'custom-button'},
    });
  };
  return (
    <div className='sticky top-16 z-40 bg-white shadow-md p-2 mb-4 flex items-center justify-between'>
      <div className='flex items-center'>
        <img
          src={courseCurrent?.image_url || logo}
          alt='School Logo'
          className='h-20 w-20 mr-3'
        />
        <h2 className='text-xl font-semibold text-gray-800 text-center'>
          {courseCurrent?.name}
        </h2>
      </div>
      <div className='flex items-center'>
        {!isComplete && (
          <div className='mr-4 text-lg font-semibold text-gray-700 text-center'>
            Số câu đã hoàn thành:
            <span className='text-black' style={{marginLeft: '5px'}}>
              {completedAmount()}
            </span>
            /
            <span className='text-black'>{quiz[0]?.questions?.length + 2}</span>
          </div>
        )}

        {!isTimeExceeded && !submitted && !isComplete && (
          <Button
            loading={submitting}
            onClick={showConfirmSubmit}
            size='large'
            className='mr-3 px-4 text-center bg-purple-500 text-white font-bold rounded hover:bg-purple-600 transition duration-300'
          >
            Nộp bài
          </Button>
        )}
      </div>
    </div>
  );
};

export default HeaderExams;
