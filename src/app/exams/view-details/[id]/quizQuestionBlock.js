'use client';
import React, {useMemo} from 'react';
import 'react-quill/dist/quill.snow.css';
import {CheckOutlined, CloseOutlined} from '@ant-design/icons';
import {QUESTION_PER_PAGE} from '../../../../constants';

const QuizQuestionBlock = ({
  quiz,
  submitted,
  selectedAnswers,
  isComplete,
  setSelectedAnswers,
  indexOfLastQuestion,
  quizSubmission,
}) => {
  const indexOfFirstQuestion = useMemo(
    () => indexOfLastQuestion - QUESTION_PER_PAGE,
    [indexOfLastQuestion]
  );

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = {...prevAnswers, [questionId]: answer};
      localStorage.setItem('quizAnswers', JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  const currentQuestions = useMemo(
    () => quiz?.questions?.slice(indexOfFirstQuestion, indexOfLastQuestion),
    [indexOfFirstQuestion, indexOfLastQuestion, quiz?.questions]
  );

  const calculateAnswersStatus = () => {
    let answersStatus = {};
    quiz?.questions?.forEach((question) => {
      const studentAnswer = quizSubmission?.answers?.find(
        (answer) => answer[question._id]
      );
      answersStatus[question._id] =
        studentAnswer && studentAnswer[question._id] === question.answer;
    });
    return answersStatus;
  };

  // Khi hiển thị thông tin cho người dùng
  const answersStatus = useMemo(calculateAnswersStatus, [
    quiz?.questions,
    quizSubmission?.answers,
  ]);

  return currentQuestions?.map((question, questionIndex) => {
    const actualQuestionIndex = indexOfFirstQuestion + questionIndex + 1;
    const studentAnswer = !isComplete && selectedAnswers[question._id];

    return (
      <div
        key={questionIndex}
        className='border-t border-gray-200 pt-4 mt-4 first:border-t-0 first:mt-0'
      >
        <div className='mb-2'>
          <span className='font-medium text-black'>
            Câu {actualQuestionIndex}:{' '}
          </span>
          <span
            dangerouslySetInnerHTML={{
              __html: `${question.question}`,
            }}
          />
        </div>
        {question.image_url && (
          <div className='mb-2'>
            <img
              src={question.image_url}
              alt={`Câu hỏi ${actualQuestionIndex}`}
              className='max-w-full h-auto rounded-lg shadow'
              style={{
                maxWidth: '50%',
              }}
            />
          </div>
        )}
        <div className='space-y-2 pb-2'>
          {question.options.map((option) => (
            <label
              key={option}
              className={`flex items-center pl-4 ${
                submitted || isComplete
                  ? answersStatus[question._id] === true &&
                    option === studentAnswer
                    ? 'text-green-500'
                    : answersStatus[question._id] === false &&
                      option === studentAnswer
                    ? 'text-red-500'
                    : ''
                  : ''
              }`}
            >
              <input
                type='radio'
                name={`question-${question._id}`}
                value={option}
                onChange={(e) => handleAnswer(question._id, e.target.value)}
                checked={option === studentAnswer}
                disabled={submitted || isComplete}
              />
              <span className='ml-2 text-gray-700'>{option}</span>
              {submitted || isComplete ? (
                <span className='form-radio-icon'>
                  {answersStatus[question._id] === true &&
                  option === studentAnswer ? (
                    <CheckOutlined style={{marginLeft: '8px'}} />
                  ) : (
                    answersStatus[question._id] === false &&
                    option === studentAnswer && (
                      <CloseOutlined style={{marginLeft: '8px'}} />
                    )
                  )}
                </span>
              ) : (
                <span className='form-radio-placeholder'></span>
              )}
            </label>
          ))}
        </div>
        <div className='text-blue-500'>
          Câu trả lời của bạn: {studentAnswer || 'Chưa trả lời'}
        </div>
      </div>
    );
  });
};

export default QuizQuestionBlock;
