import moment from 'moment';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import quizSlice, {
  getSubmissionTimeLatestQuizByCourseId,
  viewInfoQuiz,
} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {getACourse} from '../../../../features/Courses/courseSlice';

const Countdown = ({params}) => {
  const [timeSubmission, setTimeSubmission] = useState(null);
  const submissionTimeLatestQuizByCourseId = useSelector(
    (state) => state.quiz.submissionTimeLatestQuizByCourseId
  );
  const dispatch = useDispatch();

  useEffect(() => {
    const getACourseData = () => {
      dispatch(getSubmissionTimeLatestQuizByCourseId({courseId: params.id}))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            console.log(res.metadata, 'gdsafdsafd');
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
    if (submissionTimeLatestQuizByCourseId) {
      const timeMoment = moment(submissionTimeLatestQuizByCourseId);
      const now = moment();

      const momentDiff = timeMoment.diff(now);
      if (!momentDiff) return;

      const timeInit = {
        days: null,
        hours: null,
        minutes: null,
        seconds: null,
      };
      timeInit.days = Math.floor(momentDiff / 86400000);
      const millisecondRefundDay = momentDiff % (86400000 * timeInit.days);
      if (millisecondRefundDay) {
        console.log(millisecondRefundDay, 'millisecondRefundDay');
        timeInit.hours = Math.floor(millisecondRefundDay / 3600000);
        const millisecondRefundHour = timeInit.hours ? millisecondRefundDay % (3600000 * timeInit.hours) : millisecondRefundDay % 3600000 ;
        if (millisecondRefundHour) {
        console.log(millisecondRefundHour, 'millisecondRefundHour');
        timeInit.minutes = Math.floor(millisecondRefundHour / 60000);
          const millisecondRefundMinute = timeInit.minutes ? millisecondRefundHour % (60000* timeInit.minutes): millisecondRefundHour % 60000;
          if (millisecondRefundMinute) {
            timeInit.seconds = Math.floor(millisecondRefundMinute / 1000);
          }
        }
      }

      console.log(
        'timeInittimeInit',
        timeInit
      );
      
    }
  }, [submissionTimeLatestQuizByCourseId]);

  console.log(
    submissionTimeLatestQuizByCourseId,
    'submissionTimeLatestQuizByCourseId',
    timeSubmission
  );

  return (
    <div className='mt-4 lg:mt-8'>
      <div className='flex items-center justify-center gap-4 lg:gap-8'>
        <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
          <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>--</div>
          <div className='lg:text-xl mt-2 text-[#686868]'>Ngày</div>
        </div>
        <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
          <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>--</div>
          <div className='lg:text-xl mt-2 text-[#686868]'>Tháng</div>
        </div>
        <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
          <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>--</div>
          <div className='lg:text-xl mt-2 text-[#686868]'>Năm</div>
        </div>
      </div>
    </div>
  );
};

export default Countdown;
