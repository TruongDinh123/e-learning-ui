"use client";
import React, { useEffect, useState } from "react";
import { Card, Radio, Button, message } from "antd";
import { submitQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";

export default function Quizs({ params }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quiz, setquiz] = useState([]);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  const idQuiz = quiz.map((item) => item._id);

  const handleSubmit = () => {
    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );
    dispatch(submitQuiz({ quizId: idQuiz, answer: formattedAnswers }))
      .then(unwrapResult)
      .then((res) => {
        console.log("🚀 ~ res:", res);
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
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
        // Xử lý lỗi (error)
        console.log(error);
      });
  };

  useEffect(() => {
    dispatch(viewQuiz({ lessonId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
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
      });
  }, []);

  return (
    <div>
      {contextHolder}
      {quiz.map((item, index) => (
        <Card key={item._id} title={item.name}>
          {item.questions.map((question, questionIndex) => {
            const isCorrectAnswer =
              selectedAnswers[question._id] === question.answer;
            const showAnswer = submitted && isCorrectAnswer;
            const showWrongAnswer = submitted && !isCorrectAnswer; // Thêm biến trạng thái showWrongAnswer
            return (
              <div key={question._id}>
                <h4
                  style={{
                    marginBottom: "10px",
                    color: showAnswer ? "green" : showWrongAnswer ? "red" : "black", // Sử dụng màu đỏ cho câu trả lời sai
                  }}
                >
                  Question {index + 1}.{questionIndex + 1}: {question.question}
                  {showAnswer && " ✔️"}
                  {showWrongAnswer && "❌"}
                </h4>
                <Radio.Group
                  onChange={(e) =>
                    handleAnswer(question._id, e.target.value)
                  }
                  disabled={submitted}
                >
                  {question.options.map((option) => (
                    <div key={option}>
                      <Radio value={option}>{option}</Radio>
                    </div>
                  ))}
                </Radio.Group>
              </div>
            );
          })}
        </Card>
      ))}
      <Button type="primary" onClick={handleSubmit}>
        Submit
      </Button>
    </div>
  );
}
