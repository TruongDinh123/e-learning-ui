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
import { useDispatch } from "react-redux";
import Link from "next/link";

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
  const [submitting, setSubmitting] = useState(false);

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => {
      const newAnswers = { ...prevAnswers, [questionId]: answer };
      localStorage.setItem("quizAnswers", JSON.stringify(newAnswers));
      return newAnswers;
    });
  };

  useEffect(() => {
    const savedAnswers = JSON.parse(localStorage.getItem("quizAnswers"));
    if (savedAnswers) {
      setSelectedAnswers(savedAnswers);
    }

    const startTime =
      localStorage.getItem("quizStartTime") || new Date().toISOString();
    localStorage.setItem("quizStartTime", startTime);
    setStartTime(startTime);
  }, []);

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
      })
      .catch((error) => {});
  };

  useEffect(() => {
    const fetchQuizInfo = async () => {
      setLoading(true);
      try {
        const quizResult = await dispatch(
          viewAQuiz({ quizId: params?.id })
        ).then(unwrapResult);
        if (quizResult.status) {
          setquiz(quizResult.metadata);
        } else {
          messageApi.error(quizResult.message);
        }

        const scoreResult = await dispatch(getScore()).then(unwrapResult);
        if (scoreResult.status) {
          setStartTime(scoreResult.metadata[0]?.startTime);
          const completedQuiz = scoreResult.metadata.find(
            (quiz) => quiz.quiz?._id === params?.id
          );
          if (completedQuiz) {
            setIsComplete(completedQuiz.isComplete);
            const answersObject = completedQuiz.answers.reduce((obj, item) => {
              const [key, value] = Object.entries(item)[0];
              obj[key] = value;
              return obj;
            }, {});
            setStudentAnswers(answersObject);
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchQuizInfo();
  }, [params?.id, dispatch]);

  //countdount queries
  useEffect(() => {
    if (quiz.length > 0 && startTime) {
      const startTimeDate = new Date(startTime).getTime();
      const timeLimitMs = quiz[0]?.timeLimit * 60000;
      if (!isNaN(timeLimitMs) && timeLimitMs > 0) {
        const deadlineTime = startTimeDate + timeLimitMs;
        setDeadline(deadlineTime);
      } else {
        setDeadline(null);
      }
    }
  }, [quiz, startTime]);

//không cho copy
  useEffect(() => {
    const preventCopy = (event) => {
      event.preventDefault();
      message.error("Sao chép nội dung không được phép!");
    };

    const preventInspect = (event) => {
      if (
        event.keyCode === 123 ||
        (event.ctrlKey &&
          event.shiftKey &&
          (event.keyCode === 73 || event.keyCode === 74))
      ) {
        event.preventDefault();
        message.error("Không được phép kiểm tra!");
        return false;
      }
    };

    document.addEventListener("copy", preventCopy);
    document.addEventListener("contextmenu", preventCopy);
    document.addEventListener("keydown", preventInspect);

    return () => {
      document.removeEventListener("copy", preventCopy);
      document.removeEventListener("contextmenu", preventCopy);
      document.removeEventListener("keydown", preventInspect);
    };
  }, []);

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
                      <Statistic.Countdown
                        title="Thời gian còn lại"
                        value={deadline}
                        onFinish={handleSubmit}
                      />
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
                          </>
                        </>
                      )}
                      {isComplete && (
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
                      )}
                      {isTimeExceeded && (
                        <div className="font-bold text-sm">
                          Thời gian làm bài đã hết
                        </div>
                      )}
                    </div>
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
