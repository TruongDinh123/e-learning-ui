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
  getAllQuizNotDraft,
  getScoreHasUsersTested,
} from '../features/Quiz/quizSlice';
import {getAllRole, getAllUser} from '../features/User/userSlice';
import {isAdmin} from '@/middleware';

const useInitAdmin = () => {
  const isAdminCheck = isAdmin();
  const dispatch = useDispatch();
  const coursesStore = useCoursesData();
  const quiz = useSelector((state) => state.quiz.quiz);
  const allscoreQuiz = useSelector((state) => state.quiz.allscoreQuiz);
  const users = useSelector((state) => state?.user?.allUsers);
  const roles = useSelector((state) => state?.user?.allRoles);
  const quizPresent = useSelector((state) => state.quiz.quizPresent);

  useEffect(() => {
    isAdminCheck &&
      coursesStore.length === 0 &&
      dispatch(viewCourses()).then(unwrapResult);
  }, [coursesStore, isAdminCheck, dispatch]);

  useEffect(() => {
    isAdminCheck && !quiz && dispatch(getAllQuizNotDraft());
  }, [dispatch, isAdminCheck, quiz]);

  useEffect(() => {
    if (isAdminCheck && !allscoreQuiz && quizPresent) {
      dispatch(getScoreHasUsersTested({quizsFilter: [quizPresent?._id]}));
    }
  }, [allscoreQuiz, dispatch, isAdminCheck, quizPresent]);

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
