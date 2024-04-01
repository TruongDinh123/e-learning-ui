"use client";
import { Button, Modal, Result, Spin, message } from "antd";
import "../page.css";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useRouter } from "next/navigation";
import { startQuiz } from "@/features/Quiz/quizSlice";
import "react-quill/dist/quill.snow.css";

export default function Quizzes({ params }) {
  const dispatch = useDispatch();
  const [dataCourse, setDataCourse] = useState([]);
  const [isStudentOfCourse, setIsStudentOfCourse] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [loadingQuizzes, setLoadingQuizzes] = useState({});
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

        const isStudent = res.metadata.students.some(
          (student) => student._id === userId
        );
        setIsStudentOfCourse(isStudent);

        if (!isAdminState && !isStudent) {
          filteredQuizzes = [];
        } else if (!isAdminState) {
          filteredQuizzes = filteredQuizzes.filter((quiz) =>
            quiz.studentIds.includes(userIdString)
          );
        }
        setDataCourse({
          ...res.metadata,
          quizzes: filteredQuizzes,
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

  const handleStartQuiz = async (quizId, quizType) => {
    Modal.confirm({
      title: "Vui lòng xác nhận bắt đầu làm bài thi",
      content:
        "Lưu ý, trong quá trình làm bài, nếu bạn có các hành vi như: đóng hoặc tải lại trình duyệt, hệ thống sẽ ghi nhận trạng thái là đã hoàn thành.",
      okText: "Xác nhận",
      cancelText: "Huỷ",
      onOk: async () => {
        try {
          setLoadingQuizzes((prev) => ({ ...prev, [quizId]: true }));
          const response = await dispatch(startQuiz({ quizId })).then(
            unwrapResult
          );
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
          if (error.response && error.response.data.message) {
            message.warning(`Lỗi: ${error.response.data.message}`);
          } else {
            message.error("Có lỗi xảy ra, vui lòng thử lại sau.");
          }
        } finally {
          setLoadingQuizzes((prev) => ({ ...prev, [quizId]: false }));
        }
      },
      okButtonProps: { className: "custom-button" },
    });
  };

  // Thêm hàm này để kiểm tra xem thời gian làm bài đã hết hay chưa
  const hasQuizTimeElapsed = (quiz) => {
    const currentTime = new Date();
    const submissionTime = new Date(quiz.submissionTime);
    const timeLimitInMilliseconds = quiz.timeLimit * 60 * 1000;
    return currentTime - submissionTime > timeLimitInMilliseconds;
  };

  return (
    <div className="text-black py-4">
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
          {isStudentOfCourse || isAdmin ? (
            <div>
              <h2 className="text-lg font-semibold text-[#002c6a] sm:text-base">
                Danh sách bài tập
              </h2>
              <ul className="pl-5 sm:pl-4 list-none">
                {dataCourse.quizzes.map((quiz, index) => {
                  // Kiểm tra xem thời gian làm bài đã hết hay chưa
                  const isTimeElapsed = hasQuizTimeElapsed(quiz);
                  return (
                    <li key={quiz._id} className="mb-2">
                      <div
                        className="flex flex-col sm:flex-row justify-between items-center p-3 bg-gray-50 rounded-lg shadow cursor-pointer"
                        onClick={() =>
                          !isAdmin &&
                          !quiz.isCompleted &&
                          !isTimeElapsed &&
                          handleStartQuiz(quiz._id, quiz.type)
                        }
                      >
                        <span className="font-medium sm:text-sm">
                          {index + 1}. {quiz.name}
                        </span>
                        <div className="flex flex-col sm:flex-row items-center sm:mt-0">
                          {!isAdmin && (
                            <>
                              {isTimeElapsed ? (
                                <span className="px-3 mt-2 py-1 rounded-full text-sm font-semibold bg-yellow-100 text-yellow-800 sm:mr-2">
                                  Đã hết hạn
                                </span>
                              ) : quiz.isCompleted ? (
                                <span className="px-3 mt-2 py-1 rounded-full text-sm font-semibold bg-green-100 text-green-800 sm:mr-2">
                                  Đã hoàn thành
                                </span>
                              ) : (
                                <span className="px-3 mt-2 py-1 rounded-full text-sm font-semibold bg-red-100 text-red-800 sm:mr-2">
                                  Chưa hoàn thành
                                </span>
                              )}
                              {!quiz.isCompleted && !isTimeElapsed && (
                                <Button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    handleStartQuiz(quiz._id, quiz.type);
                                  }}
                                  className="mt-2 sm:mt-0 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded sm:text-xs"
                                  loading={loadingQuizzes[quiz._id]}
                                  type="primary"
                                >
                                  Bắt đầu thi
                                </Button>
                              )}
                            </>
                          )}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
