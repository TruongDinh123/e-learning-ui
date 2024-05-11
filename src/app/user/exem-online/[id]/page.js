'use client';

import {
  getCourseById,
  updateCourseCurrent,
} from '@/features/Courses/courseSlice';
import { getSubmissionTimeLatestQuizByCourseId } from '../../../../features/Quiz/quizSlice';
import ContentExemplOnline from "../content-exem-online/page";
import HeaderExemplOnline from "../header-exem-online/page";
import {useEffect, useState} from "react";
import {unwrapResult} from "@reduxjs/toolkit";
import {useDispatch, useSelector} from "react-redux";
import {getAllUserFinishedCourse} from "@/features/Quiz/quizSlice";

export default function ExempleOnline({params}) {
    const [course, setCourse] = useState([]);
    const dispatch = useDispatch();
    const latestQuizByCourseId = useSelector(
        (state) => state.quiz.latestQuizByCourseId
    );
    const [userFinishedCourse, setUserFinishedCourse] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getCourseById(params.id)).then(unwrapResult);
        if (res.status === 200) {
          const desiredCourse = res.metadata;

          dispatch(getSubmissionTimeLatestQuizByCourseId({courseId: desiredCourse._id}))
          dispatch(updateCourseCurrent({courseCurrent: desiredCourse}));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, params?.id]);

    useEffect(() => {
        const getDataForRanking = async () => {
            try {
                const res = await dispatch(getAllUserFinishedCourse(latestQuizByCourseId)).then(unwrapResult);
                if (res.status === 200) {
                    setUserFinishedCourse(res.metadata);
                }
            } catch (error) {
                console.error(error);
            }
        };

        latestQuizByCourseId && getDataForRanking();
    }, [latestQuizByCourseId]);

  return (
    <>
      <HeaderExemplOnline/>
      <ContentExemplOnline userFinishedCourse={userFinishedCourse}/>
    </>
  );
}
