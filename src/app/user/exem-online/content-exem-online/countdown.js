import moment from 'moment';
import {useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {getTimePeriod} from './utils';
import CountdownNoti from './countdownNoti';
import CountdownFooter from './countdownFooter';

const Countdown = () => {
  const [testCount, setTestCount] = useState(null);
  const [timeSubmission, setTimeSubmission] = useState({
    days: null,
    hours: null,
    minutes: null,
    seconds: null,
    timeRefund: null,
    checkTime: null,
  });
  const activeQuizByCourseId = useSelector(
    (state) => state.quiz.activeQuizByCourseId
  );


  useEffect(() => {
    let timeRun = null;

    if (activeQuizByCourseId && activeQuizByCourseId.submissionTime) {
      const timeMoment = moment(activeQuizByCourseId.submissionTime);
      const now = moment();
      const momentDiff = timeMoment.diff(now);

      if (momentDiff > 0) {
        timeRun = setInterval(() => {
          const timeInit = getTimePeriod({
            submissionTime: activeQuizByCourseId.submissionTime,
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
  }, [activeQuizByCourseId]);

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
                {!timeSubmission.days
                  ? '00'
                  : `${timeSubmission.days}`.length < 2
                  ? `0${timeSubmission.days}`
                  : timeSubmission.days}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Ngày</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.hours
                  ? '00'
                  : `${timeSubmission.hours}`.length < 2
                  ? `0${timeSubmission.hours}`
                  : timeSubmission.hours}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giờ</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.minutes
                  ? '00'
                  : `${timeSubmission.minutes}`.length < 2
                  ? `0${timeSubmission.minutes}`
                  : timeSubmission.minutes}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Phút</div>
            </div>
            <div className='px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg'>
              <div className='text-xl lg:text-4xl text-[#002c6a] font-bold'>
                {!timeSubmission.seconds
                  ? '00'
                  : `${timeSubmission.seconds}`.length < 2
                  ? `0${timeSubmission.seconds}`
                  : timeSubmission.seconds}
              </div>
              <div className='lg:text-xl mt-2 text-[#686868]'>Giây</div>
            </div>
          </div>
        </div>

        <CountdownFooter
          testCount={testCount}
          timeSubmission={timeSubmission}
        />

        <CountdownNoti testCount={testCount} setTestCount={setTestCount} />
      </div>
    </section>
  );
};

export default Countdown;
