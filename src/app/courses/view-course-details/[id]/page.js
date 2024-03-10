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
import "react-quill/dist/quill.snow.css";

const avatar = "/images/imagedefault.jpg";

export default function CourseDetails({ params }) {
  const dispatch = useDispatch();
  const [dataCourse, setDataCourse] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [isStudentOfCourse, setIsStudentOfCourse] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const userState = useSelector((state) => state.user);
  const isLoggedIn = userState.user?.status === 200 || !!userState.userName;

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

  const [showFullTitle, setShowFullTitle] = useState(false);

  const toggleTitleDisplay = () => {
    setShowFullTitle(!showFullTitle);
  };

  const renderCourseTitle = (title) => {
    if (!showFullTitle && title.length > 100) {
      return (
        <>
          {`${title.substring(0, 400)}... `}
          <span
            className="text-blue-500 cursor-pointer"
            onClick={toggleTitleDisplay}
          >
            Xem thêm
          </span>
        </>
      );
    }
    return (
      <>
        {title}{" "}
        {title.length > 100 && (
          <span
            className="text-blue-500 cursor-pointer"
            onClick={toggleTitleDisplay}
          >
            Rút gọn
          </span>
        )}
      </>
    );
  };

  return (
    <div
      className="flex flex-col md:h-[130vh] h-full text-black overflow-auto pt-4"
      style={{ minHeight: "150vh" }}
    >
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
              <h1 className="text-3xl text-[#002c6a]">
                {" "}
                <span className="font-medium">{dataCourse?.name}</span>
              </h1>
            </div>
            <div className="md:flex-row justify-between items-center p-4 md:p-6">
              <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
                {dataCourse?.teacher ? (
                  <img
                    alt="Teacher's avatar"
                    className="rounded-full"
                    src={dataCourse?.teacher?.image_url || avatar}
                    style={{
                      width: "64px",
                      height: "64px",
                      objectFit: "cover",
                    }}
                  />
                ) : null}
                <div className="flex flex-col justify-center">
                  <div className="text-lg font-medium">
                    {dataCourse?.teacher?.lastName}{" "}
                    {dataCourse?.teacher?.firstName}
                  </div>
                  <div className="text-gray-500">
                    {dataCourse?.teacher?.email}
                  </div>
                </div>
              </div>
              <div className="pt-4">
                {dataCourse.quizzes.length && (
                  <Link
                    href={`/courses/view-details/${dataCourse?._id}`}
                    className="text-white bg-[#002c6a] hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:bg-[#002c6a] dark:hover:bg-blue-600 dark:focus:ring-blue-800 shadow-lg"
                  >
                    Đi tới danh sách bài tập
                  </Link>
                )}
              </div>
            </div>
          </header>
          <div
            className="md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 md:p-6 border-b-2"
            style={{
              background:
                "linear-gradient(180deg, rgba(201, 144, 30, 0) 0%, rgba(255, 192, 67, 0.108) 100%)",
            }}
          >
            <div className="flex flex-col md:w-1/2 space-y-2 border-gray-200 dark:border-gray-300 my-2">
              <h3 className="text-3xl text-[#002c6a]">Thông tin khóa học:</h3>
            </div>
            <p
              className=""
              dangerouslySetInnerHTML={{
                __html: `${dataCourse?.title}`,
              }}
            ></p>
          </div>
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
