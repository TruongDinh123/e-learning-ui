"use client";
import { Breadcrumb, Button, Empty, Result, Spin, message } from "antd";
import "../[id]/page.css";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { FolderOpenOutlined } from "@ant-design/icons";
import { startQuiz } from "@/features/Quiz/quizSlice";
const avatar = "/images/imagedefault.jpg";

export default function CourseDetails({ params }) {
  const dispatch = useDispatch();
  const [dataCourse, setDataCourse] = useState([]);
  console.log("🚀 ~ dataCourse:", dataCourse);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userState = useSelector((state) => state.user);
  const isLoggedIn = userState.user?.status === 200 || !!userState.userName;

  const fetchData = useCallback(async () => {
    setLoading(true);
    const userId = userState.user?._id || userState.user?.metadata?.account?._id;
    // Chuyển userId sang chuỗi để so sánh
    const userIdString = userId.toString();
    console.log("🚀 ~ userId:", userId);
  
    const roles = userState.user?.roles || userState.user?.account?.roles;
    const isAdminState = roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );
    try {
      const res = await dispatch(getACourse(params.id)).then(unwrapResult);
      console.log("🚀 ~ res:", res);
      if (res.status) {
        let filteredQuizzes = res.metadata.quizzes || [];
        let filteredLessons = res.metadata.lessons || [];
  
        const isStudentOfCourse = res.metadata.students.some(
          (student) => student._id === userId
        );
        console.log("🚀 ~ isStudentOfCourse:", isStudentOfCourse)
  
        if (!isAdminState && !isStudentOfCourse) {
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

  const handleSelectLesson = (lesson) => {
    const user = userState.user;
    const userId = user?.metadata?.account?._id || user?._id;
    const roles = user?.roles || user?.metadata?.account?.roles;
    const isAdminOrMentor = roles?.some(
      (role) => role.name === "Admin" || role.name === "Mentor"
    );
    const isStudent = dataCourse.students.some(
      (student) => student._id === userId
    );

    if (!isStudent && !isAdminOrMentor) {
      message.warning(
        "Chỉ có học viên mới có thể xem thông tin bài học này",
        3
      );
    } else {
      setSelectedLesson(lesson);
    }
  };

  const handleStartQuiz = async (quizId, quizType) => {
    try {
      const response = await dispatch(startQuiz({ quizId })).then(unwrapResult);
      if (response.status) {
        const quizPage =
          quizType === "multiple_choice"
            ? "submit-quiz"
            : "handle-submit-essay";
        const path = `/courses/view-details/${quizPage}/${quizId}`;
        router.push(path);
      } else {
        console.error("Không thể bắt đầu quiz");
      }
    } catch (error) {
      console.error("Lỗi khi bắt đầu quiz:", error);
    }
  };

  return (
    <div className="flex flex-col md:h-[130vh] h-full text-black overflow-auto pt-4">
      {loading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : !dataCourse.showCourse ? (
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
        <>
          <Breadcrumb className="pl-4">
            <Breadcrumb.Item>
              <Link href="/">Trang chủ</Link>
            </Breadcrumb.Item>
            {isLoggedIn && (
              <Breadcrumb.Item>
                <Link href="/courses/view-course">Khóa học của bạn</Link>
              </Breadcrumb.Item>
            )}
            <Breadcrumb.Item>
              <span className="font-medium">{dataCourse?.name}</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <header
            className="flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 md:p-6"
            style={{
              background:
                "linear-gradient(180deg, rgba(201, 144, 30, 0) 0%, rgba(255, 192, 67, 0.108) 100%)",
            }}
          >
            <div className="flex flex-col md:w-1/2 space-y-2 border-gray-200 dark:border-gray-300">
              <h1 className="text-3xl font-bold">{dataCourse?.name}</h1>
              <p className="text-gray-500 dark:text-gray-400">
                {dataCourse?.title}
              </p>
            </div>
            <div className="flex flex-col md:w-1/2 space-y-4 md:space-y-2 mt-4 md:mt-0 pl-2 justify-center items-center">
              <div className="flex items-center gap-3">
                {dataCourse?.teacher ? (
                  <img
                    alt="Teacher's avatar"
                    className="rounded-full"
                    height="64"
                    src={dataCourse?.teacher?.image_url || avatar}
                    style={{
                      aspectRatio: "64/64",
                      objectFit: "cover",
                    }}
                    width="64"
                  />
                ) : null}
                <div className="grid gap-0.5 text-xs">
                  <div className="font-medium">
                    {dataCourse?.teacher?.lastName}{" "}
                    {dataCourse?.teacher?.firstName}
                  </div>
                  <div className="text-gray-500 dark:text-gray-400">
                    {dataCourse?.teacher?.email}
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <ul className="list-disc list-inside space-y-1">
                  {isLoggedIn && (
                    <>
                      {dataCourse.quizzes.slice(0, 3).map((quiz, index) => (
                        <li key={index}>
                          <a
                            className="text-blue-500 hover:no-underline cursor-pointer"
                            onClick={() =>
                              handleStartQuiz(quiz?._id, quiz?.type)
                            }
                          >{`Bài tập chung ${index + 1}: ${quiz.name}`}</a>
                        </li>
                      ))}
                      {dataCourse.quizzes.length > 3 && (
                        <Link
                          href={`/courses/view-details/${dataCourse?._id}`}
                          className="pl-4 text-blue-500"
                        >
                          Xem tất cả
                        </Link>
                      )}
                    </>
                  )}
                </ul>
              </div>
            </div>
          </header>
          <main className="flex flex-col md:flex-row flex-1 overflow-auto">
            <div className="flex flex-col w-full md:w-1/3 border-r md:border-r border-gray-200 dark:border-gray-200 p-4 overflow-auto">
              <h2 className="font-semibold mb-4">Bài học:</h2>
              <div className="space-y-4">
                {dataCourse?.lessons?.length > 0 ? (
                  dataCourse.lessons.map((lesson, index) => (
                    <a
                      className="block p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => handleSelectLesson(lesson)}
                      key={index}
                    >
                      <h3 className="font-semibold">
                        Bài học {index + 1}: {lesson.name}
                      </h3>
                      {lesson.quizzes && lesson.quizzes.length > 0 ? (
                        <ul className="list-disc pl-5 mt-2">
                          {lesson.quizzes.map((quiz, quizIndex) => (
                            <li
                              key={quizIndex}
                              className="text-sm text-gray-500 dark:text-gray-400"
                            >
                              Bài tập bài {quizIndex + 1}: {quiz.name}
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Chưa có bài tập
                        </p>
                      )}
                    </a>
                  ))
                ) : (
                  <div className="text-center text-gray-500 dark:text-gray-400">
                    Không có bài học
                  </div>
                )}
              </div>
            </div>
            <div className="flex flex-col w-full md:w-2/3 p-4">
              {selectedLesson?.videos?.length > 0 ? (
                selectedLesson.videos.map((video, index) => (
                  <div className="space-y-4 overflow-auto" key={index}>
                    <div className="aspect-[16/9] bg-gray-200 dark:bg-gray-800 rounded overflow-hidden items-center justify-center">
                      <video controls src={video.url} className="w-full h-full">
                        Your browser does not support the video tag.
                      </video>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {selectedLesson.content}
                    </p>
                    <div
                      className="flex items-center gap-x-1 text-gray-500 cursor-pointer"
                      onClick={() =>
                        handleStartQuiz(
                          selectedLesson?.quizzes[0]?._id,
                          selectedLesson?.quizzes?.type
                        )
                      }
                    >
                      <FolderOpenOutlined className="text-sky-500" />
                      <span className="hover:text-blue-500">
                        Bài tập: {selectedLesson.quizzes?.length}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="aspect-[16/9] bg-gray-200 rounded overflow-hidden flex items-center justify-center">
                  <Empty description="Hãy chọn bài học để xem video nếu có." />
                </div>
              )}
            </div>
          </main>
        </>
      )}
    </div>
  );
}
