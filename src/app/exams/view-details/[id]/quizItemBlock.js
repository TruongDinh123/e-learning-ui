'use client';
import React, {useMemo, useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import HeaderExams from './headerExams';
import QuizItemFooter from './quizItemFooter';
import QuizQuestionBlock from './quizQuestionBlock';
import {QUESTION_PER_PAGE} from '../../../../constants';
import {Spin} from 'antd';

const QuizItemBlock = ({
  quiz,
  submitted,
  submitting,
  selectedAnswers,
  deadline,
  showCountdown,
  predictAmount,
  onChangePredictAmount,
  quizSubmission,
  isComplete,
  setSelectedAnswers,
  handleSubmit,
  loading,
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastQuestion = useMemo(
    () => currentPage * QUESTION_PER_PAGE,
    [currentPage]
  );

  const isTimeExceeded = useMemo(() => {
    const currentTime = new Date();
    let submissionTime;
    if (quiz && quiz.submissionTime) {
      submissionTime = new Date(quiz.submissionTime);
    }

    return currentTime > submissionTime;
  }, [quiz]);

  return (
    <React.Fragment>
      <HeaderExams
        quiz={quiz}
        isComplete={isComplete}
        isTimeExceeded={isTimeExceeded}
        submitted={submitted}
        submitting={submitting}
        predictAmount={predictAmount}
        selectedAnswers={selectedAnswers}
        handleSubmit={handleSubmit}
        loading={loading}
      />
      <div className='card bg-white shadow-lg rounded-lg p-6 mb-4'>
        {quiz && (
          <h2 className='text-xl font-semibold text-gray-800 mb-4'>
            {quiz.name}
          </h2>
        )}
        {showCountdown && !isComplete && deadline && (
          <div className='text-red-500 mb-4'>
            <p>
              Lưu ý: Đừng thoát ra khỏi trang khi thời gian làm bài chưa kết
              thúc.
            </p>
            <p>Khi hết thời gian sẽ tự động nộp bài.</p>
          </div>
        )}
        {loading ? (
          <div className='flex justify-center items-center'>
            <Spin size='small' />
          </div>
        ) : (
          <QuizQuestionBlock
            quiz={quiz}
            submitted={submitted}
            selectedAnswers={selectedAnswers}
            isComplete={isComplete}
            setSelectedAnswers={setSelectedAnswers}
            indexOfLastQuestion={indexOfLastQuestion}
            quizSubmission={quizSubmission}
          />
        )}
        <QuizItemFooter
          quiz={quiz}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onChangePredictAmount={onChangePredictAmount}
          predictAmount={predictAmount}
          submitted={submitted}
          isComplete={isComplete}
          indexOfLastQuestion={indexOfLastQuestion}
        />
      </div>
    </React.Fragment>
  );
};

export default QuizItemBlock;
