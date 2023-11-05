"use client";
import CustomCard from "@/components/comman/CustomCard";
import { getStudentCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function Course() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  //viewCourses api
  useEffect(() => {
    dispatch(getStudentCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 1.5,
            })
            .then(() => setCourse(res.metadata));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  return (
    <main className="py-5">
      {contextHolder}
      <div className="container-fluid">
        <div className="row">
          {course &&
            course.map((item, index) => {
              return (
                <div key={index} className="col-12 col-sm-6 col-md-4 col-lg-3">
                  <CustomCard
                    title={item?.title}
                    name={item?.name}
                    courseId={item?._id}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </main>
  );
}
