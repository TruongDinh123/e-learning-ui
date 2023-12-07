"use client";
import React, { useEffect, useState } from "react";
import { Card, Radio, Button, message, Row, Col } from "antd";
import { submitQuiz, viewAQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function Quizs({ params }) {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [quiz, setquiz] = useState([]);
  console.log("🚀 ~ quiz:", quiz);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  let submissionTime;
  if (quiz[0] && quiz[0].submissionTime) {
    submissionTime = new Date(quiz[0].submissionTime);
  }
  console.log("🚀 ~ submissionTime:", submissionTime);
  
  const currentTime = new Date();
  console.log("🚀 ~ currentTime:", currentTime);
  
  const isTimeExceeded = currentTime > submissionTime;

  return (
    <Row
      style={{
        paddingTop: "100px",
        paddingBottom: "200px",
        overflow: "auto",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "ButtonShadow",
      }}
    >
      {contextHolder}
      <Col xs={24} md={16}>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <React.Fragment>
            {quiz.map((item, index) => (
              <React.Fragment key={index}>
                <Card key={item._id} title={item.name}>
                  {item.questions.map((question, questionIndex) => {
                    const isCorrectAnswer =
                      selectedAnswers[question._id] === question.answer;
                    const showAnswer = submitted && isCorrectAnswer;
                    const showWrongAnswer = submitted && !isCorrectAnswer;
                    return (
                      <div key={question._id}>
                        <h4
                          style={{
                            marginBottom: "10px",
                            color: showAnswer
                              ? "green"
                              : showWrongAnswer
                              ? "red"
                              : "black",
                          }}
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
                <div style={{ padding: "1rem" }}>
                  <Button
                    type="primary"
                    onClick={handleSubmit}
                    disabled={isTimeExceeded}
                    className="button-container me-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                  >
                    Submit
                  </Button>
                  {isTimeExceeded && <div>Thời gian làm bài đã hết</div>}
                </div>
              </React.Fragment>
            ))}
          </React.Fragment>
        )}
      </Col>
    </Row>
  );
}
