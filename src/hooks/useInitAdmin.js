import {useEffect} from 'react';
import useCoursesData from './useCoursesData';
import {useDispatch, useSelector} from 'react-redux';
import {
  getActiveCoursePresent,
  viewCourses,
} from '../features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {
  getActiveQuizPresent,
  getScoreByQuizIds,
  viewInfoQuiz,
} from '../features/Quiz/quizSlice';
import {SELECTED_COURSE_ID} from '../constants';
import {getAllRole, getAllUser} from '../features/User/userSlice';
import {isAdmin} from '@/middleware';

const useInitAdmin = () => {
  const isAdminCheck = isAdmin();
  const dispatch = useDispatch();
  const coursesStore = useCoursesData();
  const quiz = useSelector((state) => state.quiz.quiz);
  const users = useSelector((state) => state?.user?.allUsers);
  const roles = useSelector((state) => state?.user?.allRoles);

  useEffect(() => {
    isAdminCheck &&
      coursesStore.length === 0 &&
      dispatch(viewCourses()).then(unwrapResult);
  }, [coursesStore, isAdminCheck, dispatch]);

  useEffect(() => {
    isAdminCheck &&
      !quiz &&
      dispatch(viewInfoQuiz({courseIds: SELECTED_COURSE_ID})).then((res) => {
        if (res.payload.status === 200) {
          const quizIds = res.payload.metadata.map((item) => item._id);
          console.log(quizIds, 'quizIdsquizIdsquizIds');
          dispatch(getScoreByQuizIds({quizIds}));
        }
      });
  }, [dispatch, isAdminCheck, quiz]);

  useEffect(() => {
    isAdminCheck && !users && dispatch(getAllUser()).then(unwrapResult);
  }, [dispatch, isAdminCheck, users]);

  useEffect(() => {
    isAdminCheck && !roles && dispatch(getAllRole()).then(unwrapResult);
  }, [dispatch, isAdminCheck, roles]);

  useEffect(() => {
    isAdminCheck &&
      !roles &&
      dispatch(getActiveCoursePresent()).then(unwrapResult);
  }, [dispatch, isAdminCheck, roles]);

  useEffect(() => {
    isAdminCheck &&
      !roles &&
      dispatch(getActiveQuizPresent()).then(unwrapResult);
  }, [dispatch, isAdminCheck, roles]);

  useEffect(() => {}, []);

  return coursesStore;
};

export default useInitAdmin;
