import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useState } from 'react';
import quizSlice, { getSubmissionTimeLatestQuizByCourseId, viewInfoQuiz } from '../../../../features/Quiz/quizSlice';
import { unwrapResult } from '@reduxjs/toolkit';
import { getACourse } from '../../../../features/Courses/courseSlice';

const Countdown = ({params}) => {
  const [quizzes, setQuizzes] = useState([]);
  const submissionTimeLatestQuizByCourseId = useSelector((state) => state.quiz.submissionTimeLatestQuizByCourseId)
  const dispatch = useDispatch();

  useEffect(() => {
    const getACourseData = () => {
       dispatch(getSubmissionTimeLatestQuizByCourseId(params.id))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            console.log(res.metadata, 'gdsafdsafd');
            setQuizzes(res.metadata.quizzes);
            refresh();
          } else {
            messageApi.error(res.message);
          }
        })
        .catch((error) => {
          
        });
    };

    getACourseData();
  }, [dispatch, params.id]);

  console.log(submissionTimeLatestQuizByCourseId, 'submissionTimeLatestQuizByCourseId');

  
  return <h1>haha</h1>
}

export default Countdown;