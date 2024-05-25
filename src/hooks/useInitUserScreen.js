import {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {
  getCourseById,
  updateCourseCurrent,
} from '../features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  getSubmissionTimeLatestQuizByCourseId,
  viewAQuizForUserScreen,
} from '../features/Quiz/quizSlice';
import {message} from 'antd';

const useInitUserScreen = ({idCourse}) => {
  const dispatch = useDispatch();
  const [messageApi] = message.useMessage();
  const latestQuizByCourseId = useSelector(
    (state) => state.quiz.latestQuizByCourseId
  );

  const quiz = useSelector(
    (state) => state.quiz.quizsExisted[latestQuizByCourseId?._id]
  );
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getCourseById(idCourse)).then(unwrapResult);
        if (res.status === 200) {
          const desiredCourse = res.metadata;

          dispatch(
            getSubmissionTimeLatestQuizByCourseId({courseId: desiredCourse._id})
          );
          dispatch(updateCourseCurrent({courseCurrent: desiredCourse}));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, idCourse]);

  useEffect(() => {
    const fetchQuizInfo = () => {
      dispatch(viewAQuizForUserScreen({quizId: latestQuizByCourseId._id}))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            messageApi.error(res.message);
          }
        });
    };
    !quiz && latestQuizByCourseId?._id && user && fetchQuizInfo();
  }, [dispatch, latestQuizByCourseId, messageApi, quiz, user]);
};

export default useInitUserScreen;
