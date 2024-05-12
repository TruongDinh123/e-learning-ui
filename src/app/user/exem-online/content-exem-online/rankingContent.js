import {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getAllUserFinishedCourse} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';

const RankingContent = () => {
  const dispatch = useDispatch();
  const {latestQuizByCourseId, allUserFinishedCourse} = useSelector(
    (state) => state.quiz
  );
  const [rankingCalculatorState, setRankingCalculatorState] = useState([]);

  useEffect(() => {
    const getDataForRanking = async () => {
      try {
        dispatch(getAllUserFinishedCourse(latestQuizByCourseId)).then(
          unwrapResult
        );
      } catch (error) {
        console.error(error);
      }
    };

    latestQuizByCourseId && getDataForRanking();
  }, [dispatch, latestQuizByCourseId]);

  useEffect(() => {
    if (allUserFinishedCourse && allUserFinishedCourse.length) {
      let rankingCalculator = [];
      const completeCaps = {
        'Cấp xã': 0,
        'Cấp huyện': 0,
        'Cấp tỉnh': 0,
        'Đơn vị khác': 0,
      };

      allUserFinishedCourse.forEach((user) => {
        const cap = user.cap || 'Đơn vị khác'; // Default to 'Đơn vị khác' if no 'cap' is defined
        if (completeCaps.hasOwnProperty(cap)) {
          completeCaps[cap] += 1;
        } else {
          completeCaps['Đơn vị khác'] += 1;
        }
      });

      // If ranking is necessary, then sort the entries
      rankingCalculator = Object.entries(completeCaps)
        .sort((a, b) => b[1] - a[1])
        .map(([cap, count]) => ({cap, count}));

      setRankingCalculatorState(rankingCalculator);
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
              <div className='col-span-6 flex items-center gap-4'>
                <div className='shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]'>
                  {index + 1}
                </div>
              </div>
              <div className='col-span-6 flex items-center'>
                <span>
                  <div>{item.cap}</div>
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
