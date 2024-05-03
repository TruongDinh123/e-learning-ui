"use client";

import ContentExemplOnline from "../content-exem-online/page";
import HeaderExemplOnline from "../header-exem-online/page";
import {useEffect, useState} from "react";
import {getCourseById} from "@/features/Courses/courseSlice";
import {unwrapResult} from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export default function ExempleOnline({params}) {
    const [course, setCourse] = useState([]);
    const dispatch = useDispatch();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await dispatch(getCourseById(params.id)).then(unwrapResult);
                console.log(res);
                if (res.status === 200) {
                    const desiredCourse = res.metadata
                    setCourse(desiredCourse);
                }
            } catch (error) {
                console.error(error);
            }
        };

        fetchData();
    }, [dispatch, params?.id]);

  return (
    <>
      <HeaderExemplOnline title={course.name} logoOrg={course.image_url} bannerUrl={course.banner_url}/>
      <ContentExemplOnline contest={course} />
    </>
  );
}
