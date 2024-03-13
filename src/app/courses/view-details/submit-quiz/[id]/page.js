"use client";
import React, { useEffect, useState } from "react";
import {
  Card,
  Radio,
  Button,
  message,
  Spin,
  Statistic,
  Breadcrumb,
} from "antd";
import { getScore, submitQuiz, viewAQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import Link from "next/link";
import "react-quill/dist/quill.snow.css";
import { useMediaQuery } from "react-responsive";

const logo = "/images/logoimg.jpg";

export default function Quizs({ params }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quiz, setquiz] = useState([]);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [quizSubmission, setQuizSubmission] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [questionsPerPage] = useState(10);

  const quizzesByStudentState = useSelector(
    (state) => state.quiz.getQuizzesByStudentAndCourse.metadata
  );

  const isDesktop = useMediaQuery({ minWidth: 992 });
  //fetch API
  useEffect(() => {
    const fetchQuizInfo = async () => {
      setLoading(true);
      try {
        const storedQuiz = quizzesByStudentState?.find(
          (quiz) => quiz._id === params?.id
        );
        if (storedQuiz) {
          setquiz([storedQuiz]); // Đảm bảo dữ liệu được đặt trong một mảng
        } else {
          // Nếu không có trong store, fetch từ API
          const quizResult = await dispatch(
            viewAQuiz({ quizId: params?.id })
          ).then(unwrapResult);
          if (quizResult.status) {
            setquiz(quizResult.metadata);
          } else {
            messageApi.error(quizResult.message);
          }
        }

        const scoreResult = await dispatch(getScore()).then(unwrapResult);
        if (scoreResult.status) {
          const completedQuiz = scoreResult?.metadata?.find(
            (quiz) => quiz.quiz?._id === params?.id
          );
          if (completedQuiz) {
            setStartTime(completedQuiz.startTime);
            setIsComplete(completedQuiz.isComplete);
            const answersObject = completedQuiz.answers.reduce((obj, item) => {
              const [key, value] = Object.entries(item)[0];
              obj[key] = value;
              return obj;
            }, {});
            setStudentAnswers(answersObject);
          }
          setLoading(false);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizInfo();
  }, [params?.id, dispatch]);

  const indexOfLastQuestion = currentPage * questionsPerPage;
  const indexOfFirstQuestion = indexOfLastQuestion - questionsPerPage;
  const currentQuestions = quiz[0]?.questions?.slice(
    indexOfFirstQuestion,
    indexOfLastQuestion
  );

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePreviousPage = () => {
    setCurrentPage(currentPage - 1);
  };

  useEffect(() => {
    const savedAnswers = localStorage.getItem("quizAnswers");
    if (savedAnswers) {
      setSelectedAnswers(JSON.parse(savedAnswers));
    }
  }, []);

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers, [questionId]: answer };
      localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  useEffect(() => {
    if (isComplete) {
      localStorage.removeItem("quizStartTime");
    } else {
      const startTime =
        localStorage.getItem("quizStartTime") || new Date().toISOString();
      localStorage.setItem("quizStartTime", startTime);
      setStartTime(startTime);
    }
  }, [isComplete]);

  const idQuiz = quiz.map((item) => item._id);

  const handleSubmit = async () => {
    let savedAnswers = selectedAnswers;
    if (Object.keys(savedAnswers).length === 0) {
      const savedAnswersStr = localStorage.getItem("quizAnswers");
      if (savedAnswersStr) {
        savedAnswers = JSON.parse(savedAnswersStr) || {};
      }
    }

    const formattedAnswers = Object.entries(savedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );

    setSubmitting(true);
    try {
      const res = await dispatch(
        submitQuiz({ quizId: idQuiz, answer: formattedAnswers })
      ).then(unwrapResult);
      if (res.status) {
        await messageApi.open({
          type: "Thành công",
          content: "Đang nộp bài...",
        });
        setQuizSubmission(res.metadata);
        setSubmitted(true);
        setShowCountdown(false);
        localStorage.removeItem("quizAnswers");
        localStorage.removeItem("quizStartTime");
      } else {
        messageApi.error(res.message);
      }
    } catch (error) {
      console.error("Error submitting quiz:", error);
      messageApi.error("Lỗi khi nộp bài.");
    } finally {
      setSubmitting(false);
    }
  };

  //countdount queries
  useEffect(() => {
    if (quiz.length > 0 && startTime && !isComplete) {
      const startTimeDate = new Date(startTime).getTime();
      const timeLimitMs = quiz[0]?.timeLimit * 60000;
      if (!isNaN(timeLimitMs) && timeLimitMs > 0) {
        const deadlineTime = startTimeDate + timeLimitMs;
        const currentTime = new Date().getTime();
        const remainingTime = deadlineTime - currentTime;
        if (remainingTime > 0) {
          setDeadline(deadlineTime);
        } else {
          setDeadline(null);
          setShowCountdown(false);
          messageApi.error(
            "Thời gian làm bài đã hết. Bài quiz của bạn sẽ được tự động nộp."
          );
          handleSubmit();
        }
      } else {
        setDeadline(null);
      }
    }
  }, [quiz, startTime, isComplete]);

  //không cho copy
  // useEffect(() => {
  //   const preventCopy = (event) => {
  //     event.preventDefault();
  //     message.error("Sao chép nội dung không được phép!");
  //   };

  //   const preventInspect = (event) => {
  //     if (
  //       event.keyCode === 123 ||
  //       (event.ctrlKey &&
  //         event.shiftKey &&
  //         (event.keyCode === 73 || event.keyCode === 74))
  //     ) {
  //       event.preventDefault();
  //       message.error("Không được phép kiểm tra!");
  //       return false;
  //     }
  //   };

  //   document.addEventListener("copy", preventCopy);
  //   document.addEventListener("contextmenu", preventCopy);
  //   document.addEventListener("keydown", preventInspect);

  //   return () => {
  //     document.removeEventListener("copy", preventCopy);
  //     document.removeEventListener("contextmenu", preventCopy);
  //     document.removeEventListener("keydown", preventInspect);
  //   };
  // }, []);

  let submissionTime;
  if (quiz[0] && quiz[0]?.submissionTime) {
    submissionTime = new Date(quiz[0]?.submissionTime);
  }

  const calculateCorrectAnswers = () => {
    let correctCount = 0;
    quiz[0]?.questions?.forEach((question) => {
      const studentAnswer = quizSubmission?.answers?.find(
        (answer) => answer[question._id]
      );
      if (studentAnswer && studentAnswer[question?._id] === question?.answer) {
        correctCount += 1;
      }
    });
    return correctCount;
  };

  // Khi hiển thị thông tin cho người dùng
  const correctAnswersCount = calculateCorrectAnswers();
  const totalQuestions = quiz[0]?.questions?.length;

  const currentTime = new Date();

  const isTimeExceeded = currentTime > submissionTime;

  return (
    <div className="bg-blue-200 p-4">
      {loading ? null : (
        <>
          {showCountdown && !isComplete && deadline && (
            <>
              <a className="fixedButton flex" href="javascript:void(0)">
                <div className="roundedFixedBtn flex">
                  <Statistic.Countdown
                    style={{ color: "white" }}
                    value={deadline}
                    onFinish={handleSubmit}
                  />
                </div>
              </a>
            </>
          )}
        </>
      )}

      <Breadcrumb className="pb-2">
        <Breadcrumb.Item>
          <Link href="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/courses/view-course">Khóa học của bạn</Link>
        </Breadcrumb.Item>
        {quiz?.map((quiz, quizIndex) => (
          <>
            <Breadcrumb.Item key={quizIndex}>
              <Link
                className="font-bold"
                href={`/courses/view-course-details/${
                  quiz.courseIds[0]?._id || quiz.lessonId?.courseId?._id
                }`}
              >
                {quiz.courseIds[0]?.name || quiz.lessonId?.courseId?.name}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="font-bold"> {quiz.name}</span>
            </Breadcrumb.Item>
          </>
        ))}
      </Breadcrumb>
      <div className="pt-24 pb-48 flex justify-center items-center bg-blue-200">
        <div className="w-full md:w-2/3 lg:w-1/2">
          {contextHolder}
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <Spin />
            </div>
          ) : (
            <React.Fragment>
              {quiz.map((item, index) => (
                <React.Fragment key={index}>
                  <div className="sticky top-16 z-40 bg-white shadow-md p-2 mb-4 flex items-center">
                    <img src={logo} alt="School Logo" className="h-24 w-auto" />
                    <h2 className="text-xl font-semibold text-gray-800">
                      Trung tâm giáo dục Tường Ân - TƯỜNG ÂN EDUCATION
                    </h2>
                  </div>
                  <div className="card bg-white shadow-lg rounded-lg p-6 mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 mb-4">
                      {item.name}
                    </h2>
                    {showCountdown && !isComplete && deadline && (
                      <div className="text-red-500 mb-4">
                        <p>
                          Lưu ý: Đừng thoát ra khỏi trang khi thời gian làm bài
                          chưa kết thúc.
                        </p>
                        <p>Khi hết thời gian sẽ tự động nộp bài.</p>
                      </div>
                    )}
                    {currentQuestions.map((question, questionIndex) => {
                      const actualQuestionIndex =
                        indexOfFirstQuestion + questionIndex + 1;
                      const studentAnswer = isComplete
                        ? studentAnswers[question._id]
                        : selectedAnswers[question._id];
                      return (
                        <div
                          key={questionIndex}
                          className="border-t border-gray-200 pt-4 mt-4 first:border-t-0 first:mt-0"
                        >
                          <div className="mb-2">
                            <span className="font-medium text-black">
                              Câu {actualQuestionIndex}:{" "}
                            </span>
                            <span
                              dangerouslySetInnerHTML={{
                                __html: `${question.question}`,
                              }}
                            />
                          </div>
                          {question.image_url && (
                            <div className="mb-2">
                              <img
                                src={question.image_url}
                                alt={`Câu hỏi ${actualQuestionIndex}`}
                                className="max-w-full h-auto rounded-lg shadow"
                              />
                            </div>
                          )}
                          <div className="space-y-2 pb-2">
                            {question.options.map((option) => (
                              <label
                                key={option}
                                className="flex items-center pl-4"
                              >
                                <input
                                  type="radio"
                                  name={`question-${question._id}`}
                                  value={option}
                                  onChange={(e) =>
                                    handleAnswer(question._id, e.target.value)
                                  }
                                  checked={option === studentAnswer}
                                  disabled={submitted || isComplete}
                                  className="form-radio h-5 w-5 text-blue-600 transition duration-150 ease-in-out"
                                />
                                <span className="ml-2 text-gray-700">
                                  {option}
                                </span>
                              </label>
                            ))}
                          </div>
                          <div className="text-blue-500">
                            Câu trả lời của bạn:{" "}
                            {studentAnswer || "Chưa trả lời"}
                          </div>
                        </div>
                      );
                    })}
                    <div className="flex justify-between mt-4">
                      {currentPage > 1 && (
                        <button
                          onClick={handlePreviousPage}
                          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded hover:bg-blue-600 transition duration-300"
                        >
                          Previous
                        </button>
                      )}
                      {quiz[0]?.questions?.length > indexOfLastQuestion && (
                        <button
                          onClick={handleNextPage}
                          className="px-4 py-2 bg-green-500 text-white font-semibold rounded hover:bg-green-600 transition duration-300"
                        >
                          Next
                        </button>
                      )}
                    </div>
                    <div className="mt-4">
                      {!isTimeExceeded && !submitted && !isComplete && (
                        <button
                          onClick={handleSubmit}
                          className="mr-3 px-4 py-2 bg-purple-500 text-white font-bold rounded hover:bg-purple-600 transition duration-300"
                        >
                          Nộp bài
                        </button>
                      )}
                      {isComplete && (
                        <div className="text-center text-sm text-blue-500">
                          <p className="py-4">Bạn đã hoàn thành bài kiểm tra</p>
                          {quiz.map((quiz, quizIndex) => (
                            <a
                              key={quizIndex}
                              href={`/courses/view-details/${
                                quiz.courseIds[0]?._id ||
                                quiz.lessonId?.courseId?._id
                              }`}
                              className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                            >
                              Danh sách bài tập
                            </a>
                          ))}
                        </div>
                      )}
                      {submitted && (
                        <div className="text-center">
                          {quiz.map((quiz, quizIndex) => (
                            <a
                              key={quizIndex}
                              href={`/courses/view-details/${
                                quiz.courseIds[0]?._id ||
                                quiz.lessonId?.courseId?._id
                              }`}
                              className="inline-block bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded mr-2"
                            >
                              Danh sách bài tập
                            </a>
                          ))}
                          <a
                            href="/courses/view-score"
                            className="inline-block bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          >
                            Xem điểm
                          </a>
                        </div>
                      )}
                      {isTimeExceeded && !isComplete && (
                        <div className="font-bold text-sm text-red-500">
                          Thời gian làm bài đã hết
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
