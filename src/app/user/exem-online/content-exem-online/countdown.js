import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getSubmissionTimeLatestQuizByCourseId} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {getACourse} from '../../../../features/Courses/courseSlice';
import {getTimePeriod} from './utils';
import {useRouter} from 'next/navigation';

const Countdown = ({params}) => {
  const router = useRouter();
  const [timeSubmission, setTimeSubmission] = useState({
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    timeRefund: null,
    checkTime: false
  });
  const latestQuizByCourseId = useSelector(
    (state) => state.quiz.latestQuizByCourseId
  );

  const userCurrent = useSelector((state) => state.user.user);

  const dispatch = useDispatch();

  useEffect(() => {
    const getACourseData = () => {
      dispatch(getSubmissionTimeLatestQuizByCourseId({courseId: params.id}))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            refresh();
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {});
    };
    getACourseData();
  }, [dispatch, params.id]);

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
          if(!timeInit.days && !timeInit.hours && !timeInit.minutes && !timeInit.seconds) {
            setTimeSubmission({
              ...timeInit,
              checkTime: false
            });
            clearInterval(timeRun);
          } else {
            setTimeSubmission({
              ...timeInit,
              checkTime: true
            });
          }
        }, 1000);
      }
    }

    return () => {
      timeRun && clearInterval(timeRun);
    };
  }, [latestQuizByCourseId]);

  return (
    <section>
      <div className='mx-auto py-6 lg:py-16'>
        <div className='text-center text-[#002c6a] text-xl lg:text-4xl font-bold uppercase'>
          {timeSubmission.checkTime
            ? ' CUỘC THI KẾT THÚC TRONG'
            : 'CUỘC THI ĐÃ KẾT THÚC'}
          <br />
        </div>
        <div className='mt-4 lg:mt-8'>
          <div className='flex items-center justify-center gap-4 lg:gap-8'>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {timeSubmission.days || '--'}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Ngày</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {timeSubmission.hours || '--'}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giờ</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {timeSubmission.minutes || '--'}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Phút</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {timeSubmission.seconds || '--'}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giây</div>
            </div>
          </div>
        </div>

        <div className='mt-4 lg:mt-8 flex items-center justify-center gap-4 lg:gap-8'>
          <button
            type='button'
            className='inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]'
            onClick={() => {
              if (userCurrent && timeSubmission.checkTime)
                router.push(
                  `/courses/view-details/submit-quiz/${latestQuizByCourseId._id}`
                );
              if(!userCurrent) router.push('/login');
            }}
          >
            Tham gia
          </button>
          <button
            type='button'
            className='inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]'
          >
            Thể lệ
          </button>
        </div>
        {!userCurrent && (
          <div className='mt-4 lg:mt-8 text-lg lg:text-2xl text-[#002c6a] text-center'>
            <div className='bg-[#FFF4D9] w-fit py-3 px-12 mx-auto rounded-full'>
              Bạn cần đăng nhập để dự thi
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Countdown;
