import {useEffect} from 'react';
import useCoursesData from './useCoursesData';
import {useDispatch, useSelector} from 'react-redux';
import {viewCourses} from '../features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {viewInfoQuiz} from '../features/Quiz/quizSlice';
import {SELECTED_COURSE_ID} from '../constants';
import {getAllRole, getAllUser} from '../features/User/userSlice';

const useInitAdmin = () => {
  const dispatch = useDispatch();
  const coursesStore = useCoursesData();
  const quiz = useSelector((state) => state.quiz.quiz);
  const users = useSelector((state) => state?.user?.allUsers);
  const roles = useSelector((state) => state?.user?.allRoles);

  useEffect(() => {
    coursesStore.length === 0 && dispatch(viewCourses()).then(unwrapResult);
  }, [coursesStore, dispatch]);

  useEffect(() => {
    !quiz && dispatch(viewInfoQuiz({courseIds: SELECTED_COURSE_ID}));
  }, [dispatch, quiz]);

  useEffect(() => {
    !users && dispatch(getAllUser()).then(unwrapResult);
  }, [dispatch, users]);

  useEffect(() => {
    !roles && dispatch(getAllRole()).then(unwrapResult);
  }, [dispatch, roles]);
  useEffect(() => {}, []);
  useEffect(() => {}, []);

  return coursesStore;
};

export default useInitAdmin;
