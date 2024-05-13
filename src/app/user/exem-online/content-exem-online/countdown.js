import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getScore} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {getTimePeriod} from './utils';
import {useRouter} from 'next/navigation';
import {Modal} from 'antd';
import CountdownNoti from './countdownNoti';
import {NUMBER_QUIZ_LIMIT} from '../../../../constants';

const Countdown = () => {
  const router = useRouter();
  const userCurrent = useSelector((state) => state.user.user);
  const [isCompleted, setIsCompleted] = useState(false);
  const [testCount, setTestCount] = useState(null);
  const [timeSubmission, setTimeSubmission] = useState({
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    timeRefund: null,
    checkTime: null,
  });
  const latestQuizByCourseId = useSelector(
    (state) => state.quiz.latestQuizByCourseId
  );

  const dispatch = useDispatch();

  const confirmStartQuiz = () => {
    if (!isCompleted) {
      Modal.confirm({
        title: 'Vui lòng xác nhận bắt đầu làm bài thi',
        content:
          'Lưu ý, trong quá trình làm bài, nếu bạn có các hành vi như: đóng hoặc tải lại trình duyệt, hệ thống sẽ ghi nhận trạng thái là đã hoàn thành.',
        okText: 'Xác nhận',
        cancelText: 'Huỷ',
        onOk() {
          router.push(
            `/exams/view-details/${latestQuizByCourseId._id}`
          );
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
  };

  useEffect(() => {
    let timeRun = null;

    if (latestQuizByCourseId && latestQuizByCourseId.submissionTime) {
      const timeMoment = moment(latestQuizByCourseId.submissionTime);
      const now = moment();
      const momentDiff = timeMoment.diff(now);

      if (momentDiff > 0) {
        timeRun = setInterval(() => {
          const timeInit = getTimePeriod({
            submissionTime: latestQuizByCourseId.submissionTime,
          });
          if (
            !timeInit.days &&
            !timeInit.hours &&
            !timeInit.minutes &&
            !timeInit.seconds
          ) {
            setTimeSubmission({
              ...timeInit,
              checkTime: false,
            });
            clearInterval(timeRun);
          } else {
            setTimeSubmission({
              ...timeInit,
              checkTime: true,
            });
          }
        }, 1000);
        return;
      }
      setTimeSubmission({
        checkTime: false,
      });
    }

    return () => {
      timeRun && clearInterval(timeRun);
    };
  }, [latestQuizByCourseId]);

  useEffect(() => {
    userCurrent &&
      latestQuizByCourseId &&
      latestQuizByCourseId._id &&
      dispatch(getScore())
        .then(unwrapResult)
        .then((res) => {
          if (res?.status) {
            const completedQuiz = res?.metadata?.find(
              (quiz) => quiz.quiz?._id === latestQuizByCourseId._id
            );
            if (completedQuiz) {
              setIsCompleted(completedQuiz.isComplete);
            }
          }
        });
  }, [dispatch, latestQuizByCourseId, userCurrent]);

  return (
    <section>
      <div className='mx-auto py-6 lg:py-16'>
        <div className='text-center text-[#002c6a] text-xl lg:text-4xl font-bold uppercase'>
          {timeSubmission.checkTime === null
            ? '...'
            : timeSubmission.checkTime
            ? ' CUỘC THI KẾT THÚC TRONG'
            : 'CUỘC THI ĐÃ KẾT THÚC'}
          <br />
        </div>
        <div className='mt-4 lg:mt-8'>
          <div className='flex items-center justify-center gap-4 lg:gap-8'>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.days ? '00' : `${timeSubmission.days}`.length < 2 ? `0${timeSubmission.days}` : timeSubmission.days }
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Ngày</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.hours ? '00' : `${timeSubmission.hours}`.length < 2 ? `0${timeSubmission.hours}` : timeSubmission.hours }
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giờ</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.minutes ? '00' : `${timeSubmission.minutes}`.length < 2 ? `0${timeSubmission.minutes}` : timeSubmission.minutes }
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Phút</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.seconds ? '00' : `${timeSubmission.seconds}`.length < 2 ? `0${timeSubmission.seconds}` : timeSubmission.seconds }
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giây</div>
            </div>
          </div>
        </div>

        {testCount < NUMBER_QUIZ_LIMIT && (
          <div className='mt-4 lg:mt-8 flex items-center justify-center gap-4 lg:gap-8'>
            <button
              type='button'
              className='inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]'
              onClick={() => {
                if (userCurrent && timeSubmission.checkTime) confirmStartQuiz();
                if (!userCurrent) router.push('/login');
              }}
            >
              Tham gia
            </button>
          </div>
        )}

        <CountdownNoti testCount={testCount} setTestCount={setTestCount} />
      </div>
    </section>
  );
};

export default Countdown;
