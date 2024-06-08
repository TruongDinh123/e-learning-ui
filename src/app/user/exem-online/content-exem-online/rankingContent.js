import {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUserFinishedCourse} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';

const RankingContent = () => {
  const dispatch = useDispatch();
  const {activeQuizByCourseId, allUserFinishedCourse} = useSelector(
    (state) => state.quiz
  );
  const [rankingCalculatorState, setRankingCalculatorState] = useState([]);
  

  useEffect(() => {
    const getDataForRanking = async () => {
      try {
        dispatch(getAllUserFinishedCourse(activeQuizByCourseId)).then(
          unwrapResult
        );
      } catch (error) {
        console.error(error);
      }
    };

    !allUserFinishedCourse && activeQuizByCourseId && getDataForRanking();
  }, [dispatch, activeQuizByCourseId, allUserFinishedCourse]);

  useEffect(() => {
    if (allUserFinishedCourse && allUserFinishedCourse.length) {
      const capCount = allUserFinishedCourse.reduce((acc, user) => {
        const donvi = user.donvi || "";
        const donvicon = user.donvicon || "";
        let key = "";
        if (user.cap === "Cấp tỉnh") {
          key = `${user.cap} ${donvi}`;
        } else if (user.cap === "Cấp huyện") {
          key = `${user.donvi} ${donvicon}`
        }
        else if (user.cap === "Cấp xã") {
          key = `${user.donvi} ${donvicon}`
        }
        else {
          key = "Đơn vị khác"
        }
        acc[key] = (acc[key] || 0) + 1;
        return acc;
      }, {});

      const sortedCaps = Object.entries(capCount).sort((a, b) => b[1] - a[1]);
      const rankedResults = sortedCaps.map((item, index) => ({
        rank: index + 1,
        description: item[0],
        count: item[1]
      }));

      setRankingCalculatorState(rankedResults.slice(0, 5));
    }
  }, [allUserFinishedCourse]);

  return (
    <div>
      <div className='min-h-[550px]'>
        {!allUserFinishedCourse ||
        (allUserFinishedCourse && rankingCalculatorState.length === 0) ? (
          <div>
            <div className='text-center py-4 mt-4 typewriter'>
              {' '}
              Chưa có dữ liệu thống kê{' '}
              <span className='elipsis-blink'>...</span>
            </div>
          </div>
        ) : (
          rankingCalculatorState.map((item, index) => (
            <div
              key={index}
              className='grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md grid'
            >
              <div className='col-span-3 flex items-center gap-4'>
                <div className='shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]'>
                  {item.rank}
                </div>
              </div>
              <div className='col-span-6 flex items-center'>
                <span>
                  <div>{item.description}</div>
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default memo(RankingContent);
