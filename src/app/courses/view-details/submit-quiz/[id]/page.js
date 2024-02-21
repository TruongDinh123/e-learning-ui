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

export default function Quizs({ params }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quiz, setquiz] = useState([]);
  console.log("🚀 ~ quiz:", quiz);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [deadline, setDeadline] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [showCountdown, setShowCountdown] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const quizzesByStudentState = useSelector(
    (state) => state.quiz.getQuizzesByStudentAndCourse.metadata
  );
  //fetch API
  useEffect(() => {
    const fetchQuizInfo = async () => {
      setLoading(true);
      try {
        const storedQuiz = quizzesByStudentState.find(
          (quiz) => quiz._id === params?.id
        );
        if (storedQuiz) {
          console.log("Lấy dữ liệu quiz từ store");
          setquiz([storedQuiz]); // Đảm bảo dữ liệu được đặt trong một mảng
        } else {
          // Nếu không có trong store, fetch từ API
          console.log("Gọi API để lấy dữ liệu quiz");
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
          const completedQuiz = scoreResult.metadata.find(
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
      const startTime = localStorage.getItem("quizStartTime") || new Date().toISOString();
      localStorage.setItem("quizStartTime", startTime);
      setStartTime(startTime);
    }
  }, [isComplete]);

  const idQuiz = quiz.map((item) => item._id);

  const handleSubmit = () => {
    const savedAnswers =
      Object.keys(selectedAnswers).length === 0
        ? JSON.parse(localStorage.getItem("quizAnswers")) || {}
        : selectedAnswers;

    const formattedAnswers = Object.entries(savedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );
    setSubmitting(true);
    dispatch(submitQuiz({ quizId: idQuiz, answer: formattedAnswers }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang nộp bài...",
            })
            .then(() => {
              setSubmitted(true);
              setShowCountdown(false);
              localStorage.removeItem("quizAnswers");
              localStorage.removeItem("quizStartTime");
            });
        } else {
          messageApi.error(res.message);
        }
      });
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

  const currentTime = new Date();

  const isTimeExceeded = currentTime > submissionTime;

  return (
    <div className="bg-gray-200 p-4">
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
      <div className="pt-24 pb-48 flex justify-center items-center overflow-auto bg-gray-200 noCopy">
        <div className="w-full md:w-2/3">
          {contextHolder}
          {loading ? (
            <div className="flex justify-center items-center h-screen">
              <Spin />
            </div>
          ) : (
            <React.Fragment>
              {quiz.map((item, index) => (
                <React.Fragment key={index}>
                  <Card
                    key={item._id}
                    title={item.name}
                    className="border-2 border-blue-500"
                  >
                    {showCountdown && !isComplete && deadline && (
                      <>
                        <Statistic.Countdown
                          title="Thời gian còn lại"
                          value={deadline}
                          onFinish={handleSubmit}
                        />
                        <span className="text-red-500 block mt-2">
                          Lưu ý: Đừng thoát ra khỏi trang khi thời gian làm bài
                          chưa kết thúc.
                        </span>
                        <span className="text-red-500 block mt-2">
                          Khi hết thời gian sẽ tự động nộp bài.
                        </span>
                      </>
                    )}
                    {item.questions.map((question, questionIndex) => {
                      const studentAnswer = isComplete
                        ? studentAnswers[question._id]
                        : selectedAnswers[question._id];
                      const isCorrectAnswer = studentAnswer === question.answer;
                      const showAnswer = submitted && isCorrectAnswer;
                      const showWrongAnswer = submitted && !isCorrectAnswer;
                      return (
                        <div key={questionIndex} className="border p-4 mb-4">
                          <div key={question._id} className="mb-4 p-2">
                            <h4
                              className={`mb-2 font-medium ${
                                showAnswer
                                  ? "text-green-500"
                                  : showWrongAnswer
                                  ? "text-red-500"
                                  : "text-black"
                              }`}
                            >
                              Câu {questionIndex + 1}: {question.question}
                              {showAnswer && " ✔️"}
                              {showWrongAnswer && "❌"}
                            </h4>
                            {question.image_url && (
                              <div className="mb-2">
                                <img
                                  src={question.image_url}
                                  alt={`Câu hỏi ${questionIndex + 1}`}
                                  className="max-w-auto h-64"
                                />
                              </div>
                            )}
                            <Radio.Group
                              onChange={(e) =>
                                handleAnswer(question._id, e.target.value)
                              }
                              value={studentAnswer}
                              disabled={submitted || isComplete}
                              className="space-y-2"
                            >
                              {question.options.map((option) => (
                                <div key={option} className="pl-4">
                                  <Radio
                                    value={option}
                                    checked={option === studentAnswer}
                                  >
                                    {option}
                                  </Radio>
                                </div>
                              ))}
                            </Radio.Group>
                          </div>
                          <span className="text-blue-500 text-lg px-2">
                            Câu trả lời của bạn: {studentAnswer}
                          </span>
                        </div>
                      );
                    })}
                    <div className="p-4">
                      {!isTimeExceeded && !submitted && !isComplete && (
                        <>
                          <Button
                            type="primary"
                            onClick={handleSubmit}
                            loading={submitting}
                            className="mr-3 custom-button text-white font-bold px-4 rounded"
                          >
                            Nộp bài
                          </Button>
                        </>
                      )}
                      {isComplete ? (
                        <div className="font-bold text-sm text-blue-500">
                          Bạn đã hoàn thành bài kiểm tra
                          {quiz?.map((quiz, quizIndex) => (
                            <Link
                              key={quizIndex}
                              className="ml-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                              href={`/courses/view-details/${
                                quiz.courseIds[0]?._id ||
                                quiz.lessonId?.courseId?._id
                              }`}
                            >
                              Danh sách bài tập
                            </Link>
                          ))}
                        </div>
                      ) : (
                        <>
                          {submitted && (
                            <>
                              {quiz?.map((quiz, quizIndex) => (
                                <Link
                                  key={quizIndex}
                                  className="mr-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                                  href={`/courses/view-details/${
                                    quiz.courseIds[0]?._id ||
                                    quiz.lessonId?.courseId?._id
                                  }`}
                                >
                                  Danh sách bài tập
                                </Link>
                              ))}
                              <Link
                                href="/courses/view-score"
                                className="mr-3 custom-button text-white font-bold py-2 px-4 rounded"
                              >
                                Xem điểm
                              </Link>
                            </>
                          )}
                        </>
                      )}
                      {isTimeExceeded && (
                        <div className="font-bold text-sm">
                          Thời gian làm bài đã hết
                        </div>
                      )}
                    </div>
                  </Card>
                </React.Fragment>
              ))}
            </React.Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
