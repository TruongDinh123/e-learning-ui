import {memo, useEffect, useState} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {getTestCount} from '../../../../features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import { NUMBER_QUIZ_LIMIT } from '../../../../constants';

const CountdownNoti = ({testCount, setTestCount}) => {
  const dispatch = useDispatch();
  const userCurrent = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userCurrent) {
      const userId = userCurrent?.metadata?.account?._id || userCurrent?._id;

      userId &&
        dispatch(getTestCount({userId}))
          .then(unwrapResult)
          .then((res) => {
            if (res?.status) {
              const testCountInit = res.metadata.testCount;
              setTestCount(testCountInit);
            }
          });
    }
  }, [dispatch, setTestCount, userCurrent]);

  return (
    <div className='mt-4 lg:mt-8 text-lg lg:text-2xl text-[#002c6a] text-center'>
      <div className='bg-[#FFF4D9] w-fit py-3 px-12 mx-auto rounded-full'>
        {!userCurrent && 'Bạn cần đăng nhập để dự thi'}
        {testCount !== null && `Bạn có ${testCount}/${NUMBER_QUIZ_LIMIT} lượt thi`}
      </div>
    </div>
  );
};

export default memo(CountdownNoti);
