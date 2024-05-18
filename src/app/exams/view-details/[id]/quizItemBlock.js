'use client';
import React, {useState} from 'react';
import 'react-quill/dist/quill.snow.css';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import HeaderExams from './headerExams';
import QuizItemFooter from './quizItemFooter';
import QuizQuestionBlock from './quizQuestionBlock';
import { QUESTION_PER_PAGE } from '../../../../constants';

const QuizItemBlock = ({
  index,
  quiz,
  quizItem,
  submitted,
  submitting,
  selectedAnswers,
  deadline,
  showCountdown,
  predictAmount,
  onChangePredictAmount,
  predictAmountMaxScore,
  onChangePredictAmountMaxScore,
  quizSubmission,
  isComplete,
  setSelectedAnswers,
  handleSubmit
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const indexOfLastQuestion = currentPage * QUESTION_PER_PAGE;
  const currentTime = new Date();

  let submissionTime;
  if (quiz[0] && quiz[0]?.submissionTime) {
    submissionTime = new Date(quiz[0]?.submissionTime);
  }

  const isTimeExceeded = currentTime > submissionTime;

  return (
    <React.Fragment key={index}>
      <HeaderExams
        quiz={quiz}
        isComplete={isComplete}
        isTimeExceeded={isTimeExceeded}
        submitted={submitted}
        submitting={submitting}
        predictAmount={predictAmount}
        predictAmountMaxScore={predictAmountMaxScore}
        selectedAnswers={selectedAnswers}
        handleSubmit={handleSubmit}
      />
      <div className='card bg-white shadow-lg rounded-lg p-6 mb-4'>
        <h2 className='text-xl font-semibold text-gray-800 mb-4'>
          {quizItem.name}
        </h2>
        {showCountdown && !isComplete && deadline && (
          <div className='text-red-500 mb-4'>
            <p>
              Lưu ý: Đừng thoát ra khỏi trang khi thời gian làm bài chưa kết
              thúc.
            </p>
            <p>Khi hết thời gian sẽ tự động nộp bài.</p>
          </div>
        )}

        <QuizQuestionBlock
          quiz={quiz}
          submitted={submitted}
          selectedAnswers={selectedAnswers}
          isComplete={isComplete}
          setSelectedAnswers={setSelectedAnswers}
          indexOfLastQuestion={indexOfLastQuestion}
          quizSubmission={quizSubmission}
        />

        <QuizItemFooter
          quiz={quiz}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          onChangePredictAmount={onChangePredictAmount}
          onChangePredictAmountMaxScore={onChangePredictAmountMaxScore}
          predictAmount={predictAmount}
          predictAmountMaxScore={predictAmountMaxScore}
          submitted={submitted}
          isComplete={isComplete}
          indexOfLastQuestion={indexOfLastQuestion}
        />
      </div>
    </React.Fragment>
  );
};

export default QuizItemBlock;
