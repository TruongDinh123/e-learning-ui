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
        console.log("🚀 ~ res:", res);
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

  console.log("🚀 ~ course:", course);

  return (
    <main className="py-5">
      {contextHolder}
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            {course &&
              course.map((item, index) => {
                return (
                  <CustomCard
                    key={index}
                    title={item?.title}
                    name={item?.name}
                    courseId={item?._id}
                  />
                );
              })}
          </div>
        </div>
      </div>
    </main>
  );
}
