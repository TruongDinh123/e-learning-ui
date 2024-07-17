import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {unwrapResult} from '@reduxjs/toolkit';
import {useRouter} from 'next/navigation';
import {Modal} from 'antd';
import {NUMBER_QUIZ_LIMIT} from '../../../../constants';
import {getInfoCommonScoreByUserId} from '../../../../features/Quiz/quizSlice';

const CountdownFooter = ({testCount, timeSubmission}) => {
  const dispatch = useDispatch();
  const userCurrent = useSelector((state) => state.user.user);
  const quizCurrent = useSelector((state) => state.course.courseInfo);
  const activeQuizByCourseId = useSelector(
    (state) => state.quiz.activeQuizByCourseId
  );
  const router = useRouter();
  const [isCompleted, setIsCompleted] = useState(false);

  const confirmStartQuiz = useCallback(() => {
    if (!isCompleted) {
      Modal.confirm({
        title: 'Vui lòng xác nhận bắt đầu làm bài thi',
        content:
          'Lưu ý, trong quá trình làm bài, nếu bạn có các hành vi như: đóng hoặc tải lại trình duyệt, hệ thống sẽ ghi nhận trạng thái là đã hoàn thành.',
        okText: 'Xác nhận',
        cancelText: 'Huỷ',
        onOk() {
          router.push(`/exams/view-details/${activeQuizByCourseId._id}`);
        },
        okButtonProps: {className: 'custom-button'},
      });
    } else {
      Modal.warning({
        title: 'Không thể thi lại',
        content:
          'Lưu ý, mỗi thí sinh chỉ có thể thi 5 lần, bạn không thể thi lại bài thi này.',
        okText: 'Xác nhận',
        okButtonProps: {className: 'custom-button'},
      });
    }
  }, [isCompleted, activeQuizByCourseId, router]);

  useEffect(() => {
    const isFullData = userCurrent && quizCurrent && quizCurrent._id;

    isFullData &&
      dispatch(getInfoCommonScoreByUserId())
        .then(unwrapResult)
        .then((res) => {
          if (res?.status) {
            const completedQuiz = res?.metadata;
            if (completedQuiz) {
              setIsCompleted(completedQuiz.isComplete);
            }
          }
        });
  }, [quizCurrent, dispatch, userCurrent]);

  return (
    testCount !== undefined && testCount < NUMBER_QUIZ_LIMIT && (
      <div className='mt-4 lg:mt-8 flex items-center justify-center gap-4 lg:gap-8'>
        <button
          type='button'
          className='inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]'
          onClick={() => {
            if (userCurrent && timeSubmission.checkTime) confirmStartQuiz();
            if (!userCurrent) router.push('/login');
          }}
          disabled={!timeSubmission.checkTime && true}
        >
          Tham gia
        </button>
      </div>
    )
  );
};

export default CountdownFooter;
