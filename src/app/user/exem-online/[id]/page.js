'use client';

import ContentExemplOnline from '../content-exem-online/page';
import HeaderExemplOnline from '../header-exem-online/page';
import {useEffect, useState} from 'react';
import {
  getCourseById,
  updateCourseCurrent,
} from '@/features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {useDispatch} from 'react-redux';

export default function ExempleOnline({params}) {
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getCourseById(params.id)).then(unwrapResult);
        if (res.status === 200) {
          const desiredCourse = res.metadata;
          dispatch(updateCourseCurrent({courseCurrent: desiredCourse}));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, params?.id]);

  return (
    <>
      <HeaderExemplOnline
      />
      <ContentExemplOnline />
    </>
  );
}
