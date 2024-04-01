"use client";
import { Button, Layout, Result, Spin } from "antd";
import "../[id]/page.css";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";

import "react-quill/dist/quill.snow.css";

function addCustomClassesToHtml(htmlString) {
  return htmlString
    .replace("<ol>", '<ol class="custom-ol">')
    .replace(/<li>/g, '<li class="custom-li">');
}

export default function CourseDetails({ params }) {
  const dispatch = useDispatch();
  const [dataCourse, setDataCourse] = useState([]);
  const [isStudentOfCourse, setIsStudentOfCourse] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userState = useSelector((state) => state.user);
  const isLoggedIn =
    userState.user?.status === 200 ||
    !!userState.userName ||
    userState.isSuccess;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const userId =
      userState.user?._id || userState.user?.metadata?.account?._id;
    const userIdString = userId.toString();

    const roles =
      userState.user?.roles || userState.user?.metadata?.account?.roles;
    const isAdminState = roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );
    setIsAdmin(isAdminState);
    try {
      const res = await dispatch(getACourse(params.id)).then(unwrapResult);
      if (res.status) {
        let filteredQuizzes = res.metadata.quizzes || [];
        let filteredLessons = res.metadata.lessons || [];

        const isStudent = res.metadata.students.some(
          (student) => student._id === userId
        );
        setIsStudentOfCourse(isStudent);

        if (!isAdminState && !isStudent) {
          filteredQuizzes = [];
          filteredLessons = filteredLessons.map((lesson) => ({
            ...lesson,
            quizzes: [],
          }));
        } else if (!isAdminState) {
          filteredQuizzes = filteredQuizzes.filter((quiz) =>
            quiz.studentIds.includes(userIdString)
          );
          filteredLessons = filteredLessons.map((lesson) => ({
            ...lesson,
            quizzes: lesson.quizzes
              ? lesson.quizzes.filter((quiz) =>
                  quiz.studentIds.includes(userIdString)
                )
              : [],
          }));
        }
        setDataCourse({
          ...res.metadata,
          quizzes: filteredQuizzes,
          lessons: filteredLessons,
        });
      }
    } catch (error) {
      console.error("Error fetching course details:", error);
    } finally {
      setLoading(false);
    }
  }, [params.id, dispatch, isLoggedIn, userState.user]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    } else {
      fetchData();
    }
  }, [fetchData, isLoggedIn, router]);

  return (
    <div className="py-2">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : !dataCourse.showCourse && !(isStudentOfCourse || isAdmin) ? (
        <div className="flex justify-center items-center h-screen">
          <Result
            status="warning"
            title="Chỉ có học viên mới có thể xem thông tin bài học này"
            extra={
              <Button type="primary" key="console" href="/">
                Trang chủ
              </Button>
            }
          />
        </div>
      ) : (
        <div className="border-r border-gray-200 md:border-r-2">
          <h3 className="text-xl font-semibold text-[#13C57C]">
            Thông tin khóa học:
          </h3>
          <p
            className="mt-2 text-gray-600"
            dangerouslySetInnerHTML={{
              __html: addCustomClassesToHtml(dataCourse?.title),
            }}
          />
        </div>
      )}
    </div>
  );
}
