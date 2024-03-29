"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { BookOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Image, Spin } from "antd";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function CoursePublic() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  //viewCourses api
  useEffect(() => {
    setIsLoading(true);

    dispatch(getCoursePublic())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourse(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        
        setIsLoading(false);
      });
  }, []);

  return (
    <div className="flex">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3">
          {course &&
            course.map((item, index) => (
              <React.Fragment key={index}>
                <Link href={`/courses/lessons/${item?._id}`} key={index}>
                  <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        fill
                        className="object-cover"
                        alt="course image"
                        src="https://www.codewithantonio.com/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F7b009b26-3dd8-4947-a3d6-c3f7e7420990-c91s7l.png&w=1920&q=75"
                      />
                    </div>
                    <div className="flex flex-col pt-2">
                      <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {item.name}
                      </div>
                      <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {item.title}
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Teacher: {item.teacher?.lastName}
                      </p>
                      <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                          <BookOutlined />
                          <span>lessons: {item.lessons.length}</span>
                        </div>
                        <div className="flex items-center gap-x-1 text-slate-500"></div>
                      </div>
                    </div>
                  </div>
                </Link>
              </React.Fragment>
            ))}
        </div>
      )}
    </div>
  );
}
