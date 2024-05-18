'use client';
import React, {useEffect, useState, useRef} from 'react';
import {message, Spin} from 'antd';
import {getScore, submitQuiz, viewAQuiz} from '@/features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch, useSelector} from 'react-redux';
import 'react-quill/dist/quill.snow.css';
import debounce from 'lodash.debounce';
import {useRouter} from 'next/navigation';
import QuizItemBlock from './quizItemBlock';
import BreadCrumbBlock from './breadCrumbBlock';

export default function Quizs({params}) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quiz, setquiz] = useState([]);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [deadline, setDeadline] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [quizSubmission, setQuizSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [predictAmount, onChangePredictAmount] = useState('');
  const [predictAmountMaxScore, onChangePredictAmountMaxScore] = useState('');
  const [initialSize, setInitialSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const [hasWarned, setHasWarned] = useState(false);
  const resizeTimeoutRef = useRef(null);
  const router = useRouter();

  const quizzesByStudentState = useSelector(
    (state) => state.quiz.getQuizzesByStudentAndCourse.metadata
  );
  const infoCommonScoreByUserId = useSelector(
    (state) => state.quiz.infoCommonScoreByUserId
  );

  console.log(
    infoCommonScoreByUserId,
    'infoCommonScoreByUserIdinfoCommonScoreByUserId'
  );

  // lấy tên khóa học

  useEffect(() => {
    setInitialSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    const tolerance = 1;

    const sizeWithinTolerance = (current, initial) => {
      return Math.abs(current - initial) > tolerance;
    };

    const handleResize = debounce(() => {
      const widthChangeWithinTolerance = sizeWithinTolerance(
        window.innerWidth,
        initialSize.width
      );
      const heightChangeWithinTolerance = sizeWithinTolerance(
        window.innerHeight,
        initialSize.height
      );

      const isSizeChanged =
        widthChangeWithinTolerance || heightChangeWithinTolerance;

      if (isSizeChanged) {
        if (hasWarned) {
          // do nothing
        } else {
          setHasWarned(true);
          if (!resizeTimeoutRef.current) {
            messageApi.error(
              'Bạn có dấu hiệu vi phạm. Vui lòng resize như cũ. Nếu 10s nữa bạn chưa thực hiện, bài thi sẽ kết thúc.'
            );
            resizeTimeoutRef.current = setTimeout(() => {
              const widthChangeWithinTolerance = sizeWithinTolerance(
                window.innerWidth,
                initialSize.width
              );
              const heightChangeWithinTolerance = sizeWithinTolerance(
                window.innerHeight,
                initialSize.height
              );

              if (widthChangeWithinTolerance || heightChangeWithinTolerance) {
                messageApi.error(
                  'Bạn vẫn chưa trả màn hình như cũ. Hệ thống sẽ nộp bài trong 10s nữa.'
                );
                setTimeout(() => {
                  handleSubmit();
                }, 10000);
              } else {
                messageApi.success(
                  'Bạn đã trả về màn hình như cũ. Tiếp tục thi.'
                );
              }
              resizeTimeoutRef.current = null;
              setHasWarned(false);
            }, 10000);
          }
        }
      }
    }, 100);

    window.addEventListener('resize', handleResize);
  }, []);

  //fetch API
  useEffect(() => {
    const fetchQuizInfo = async () => {
      setLoading(true);
      try {
        const storedQuiz = quizzesByStudentState?.find(
          (quiz) => quiz._id === params?.id
        );
        if (storedQuiz) {
          setquiz([storedQuiz]); // Đảm bảo dữ liệu được đặt trong một mảng
        } else {
          // Nếu không có trong store, fetch từ API
          const quizResult = await dispatch(
            viewAQuiz({quizId: params?.id})
          ).then(unwrapResult);
          if (quizResult.status) {
            setquiz(quizResult.metadata);
          } else {
            messageApi.error(quizResult.message);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizInfo();
  }, [params?.id, dispatch, quizzesByStudentState, messageApi]);

  useEffect(() => {
    if (infoCommonScoreByUserId) {
      if (infoCommonScoreByUserId.isComplete) {
        onChangePredictAmount(
          infoCommonScoreByUserId.predictAmount
            ? infoCommonScoreByUserId.predictAmount.toString()
            : '0'
        );
        onChangePredictAmountMaxScore(
          infoCommonScoreByUserId.predictAmountMaxScore
            ? infoCommonScoreByUserId.predictAmountMaxScore.toString()
            : '0'
        );
      }
      setStartTime(infoCommonScoreByUserId.startTime);
      setIsComplete(infoCommonScoreByUserId.isComplete);
    }
  }, [infoCommonScoreByUserId]);

  useEffect(() => {
    const savedAnswers = localStorage.getItem('quizAnswers');
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  useEffect(() => {
    if (isComplete) {
      localStorage.removeItem('quizStartTime');
    } else {
      const startTime =
        localStorage.getItem('quizStartTime') || new Date().toISOString();
      localStorage.setItem('quizStartTime', startTime);
      setStartTime(startTime);
    }
  }, [isComplete]);

  const idQuiz = quiz.map((item) => item._id);

  const handleSubmit = async () => {
    let savedAnswers = selectedAnswers;
    if (Object.keys(savedAnswers).length === 0) {
      const savedAnswersStr = localStorage.getItem('quizAnswers');
      if (savedAnswersStr) {
        savedAnswers = JSON.parse(savedAnswersStr) || {};
      }
    }

    const formattedAnswers = Object.entries(savedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );

    setSubmitting(true);
    try {
      await messageApi.open({
        type: 'Thành công',
        content: 'Đang nộp bài...',
        style: {fontSize: '25px'},
        key: "submit"
      });

      const res = await dispatch(
        submitQuiz({
          quizId: idQuiz,
          answer: formattedAnswers,
          predictAmount,
          predictAmountMaxScore,
        })
      ).then(unwrapResult);

      if (res.status) {
        // setQuizSubmission(res.metadata);
        // setSubmitted(true);
        // setShowCountdown(false);
        localStorage.removeItem('quizAnswers');
        localStorage.removeItem('quizStartTime');
        router.push('/');
      } else {
        messageApi.destroy('submit')
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      messageApi.error('Lỗi khi nộp bài.');
    } finally {
      setSubmitting(false);
    }
  };

  //countdount queries
  useEffect(() => {
    if (quiz.length > 0 && startTime && !isComplete) {
      const startTimeDate = new Date(startTime).getTime();
      const timeLimitMs = quiz[0]?.timeLimit * 60000;
      if (!isNaN(timeLimitMs) && timeLimitMs > 0) {
        const deadlineTime = startTimeDate + timeLimitMs;
        const currentTime = new Date().getTime();
        const remainingTime = deadlineTime - currentTime;
        if (remainingTime > 0) {
          setDeadline(deadlineTime);
        } else {
          setDeadline(null);
          setShowCountdown(false);
          messageApi.error(
            'Thời gian làm bài đã hết. Bài quiz của bạn sẽ được tự động nộp.'
          );
          handleSubmit();
        }
      } else {
        setDeadline(null);
      }
    }
  }, [quiz, startTime, isComplete]);

  return (
    <div className='bg-blue-200 p-4'>
      <BreadCrumbBlock
        quiz={quiz}
        isComplete={isComplete}
        handleSubmit={handleSubmit}
        loading={loading}
        showCountdown={showCountdown}
        deadline={deadline}
      />
      <div className='pb-48 flex justify-center items-center bg-blue-200'>
        <div className='w-full md:w-2/3 lg:w-1/2'>
          {contextHolder}
          {loading ? (
            <div className='flex justify-center items-center h-screen'>
              <Spin />
            </div>
          ) : (
            <React.Fragment>
              {quiz.map((item, index) => (
                <QuizItemBlock
                  key={index}
                  index={index}
                  quiz={quiz}
                  quizItem={item}
                  submitted={submitted}
                  submitting={submitting}
                  selectedAnswers={selectedAnswers}
                  deadline={deadline}
                  showCountdown={showCountdown}
                  predictAmount={predictAmount}
                  onChangePredictAmount={onChangePredictAmount}
                  predictAmountMaxScore={predictAmountMaxScore}
                  onChangePredictAmountMaxScore={onChangePredictAmountMaxScore}
                  quizSubmission={quizSubmission}
                  isComplete={isComplete}
                  setSelectedAnswers={setSelectedAnswers}
                  handleSubmit={handleSubmit}
                />
              ))}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
