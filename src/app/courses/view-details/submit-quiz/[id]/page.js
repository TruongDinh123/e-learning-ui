"use client";
import React, { useEffect, useState } from "react";
import { Card, Radio, Button, message } from "antd";
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
  const [score, setScore] = useState([]);
  const [isComplete, setIsComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [studentAnswers, setStudentAnswers] = useState({});
  console.log("🚀 ~ studentAnswers:", studentAnswers);

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const idQuiz = quiz.map((item) => item._id);

  const handleSubmit = () => {
    const totalQuestions = quiz.reduce((totalQuestions, item) => totalQuestions + item.questions.length, 0);
    if (Object.keys(selectedAnswers).length < totalQuestions) {
      message.error('Vui lòng trả lời tất cả các câu hỏi trước khi nộp bài.');
      return;
    }


    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );
    dispatch(submitQuiz({ quizId: idQuiz, answer: formattedAnswers }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => {
              setSubmitted(true);
            })
            .then(() => message.success(res.message, 1.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(viewAQuiz({ quizId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 2.5,
            })
            .then(() => setquiz(res.metadata))
            .then(() => message.success(res.message, 1.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        console.log("🚀 ~ res:", res);
        if (res.status) {
          setScore(res.metadata);
          const completedQuiz = res.metadata.find(
            (quiz) => quiz.quiz?._id === params?.id
          );
          console.log("🚀 ~ completedQuiz:", completedQuiz);
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
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  let submissionTime;
  if (quiz[0] && quiz[0]?.submissionTime) {
    submissionTime = new Date(quiz[0]?.submissionTime);
  }

  const currentTime = new Date();

  const isTimeExceeded = currentTime > submissionTime;

  return (
    <div className="pt-24 pb-48 flex justify-center items-center overflow-auto bg-gray-200">
      {contextHolder}
      <div className="w-full md:w-2/3">
        {loading ? (
          <div>Loading...</div>
        ) : (
          <React.Fragment>
            {quiz.map((item, index) => (
              <React.Fragment key={index}>
                <Card
                  key={item._id}
                  title={item.name}
                  className="border-2 border-blue-500"
                >
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
                            className={`mb-2 ${
                              showAnswer
                                ? "text-green-500"
                                : showWrongAnswer
                                ? "text-red-500"
                                : "text-black"
                            }`}
                          >
                            Question {index + 1}.{questionIndex + 1}:{" "}
                            {question.question}
                            {showAnswer && " ✔️"}
                            {showWrongAnswer && "❌"}
                          </h4>
                          <Radio.Group
                            onChange={(e) =>
                              handleAnswer(question._id, e.target.value)
                            }
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
                    <Button
                      type="default"
                      onClick={handleSubmit}
                      disabled={isTimeExceeded || submitted || isComplete}
                      className="mr-3 bg-blue-500 hover:bg-blue-700 text-black font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </Button>
                    {isComplete && (
                      <div>Bạn đã hoàn thành bài kiểm tra này</div>
                    )}
                    {isTimeExceeded && <div>Thời gian làm bài đã hết</div>}
                  </div>
                  {submitted && (
                    <Link
                      href="/courses/view-details"
                      className="mr-3 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Trở về trang chủ
                    </Link>
                  )}
                </Card>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
