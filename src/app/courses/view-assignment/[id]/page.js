"use client";
import React, { useEffect, useState } from "react";
import { Card, Radio, message, Row, Col, Statistic, Spin } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  submitAssignment,
  viewAssignmentByCourseId,
} from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import Link from "next/link";
import { Button } from "@material-tailwind/react";

export default function Assignment({ params }) {
  const dispatch = useDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assignment, setAssigment] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [started, setStarted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [score, setScore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnswer = (questionId, answer) => {
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
  };

  useEffect(() => {
    setIsLoading(true);

    Promise.all([
      dispatch(viewAssignmentByCourseId({ courseId: params?.id })),
      dispatch(getScore()),
    ])
      .then(([assignmentRes, scoreRes]) => {
        const assignmentResult = assignmentRes.payload;
        const scoreResult = scoreRes.payload;

        if (assignmentResult.status) {
          setAssigment(assignmentResult.metadata);
          setTimeLeft(assignmentResult.metadata[0]?.timeLimit * 60);
        } else {
          messageApi.error(assignmentResult.message);
        }

        if (scoreResult.status) {
          setScore(scoreResult.metadata);
        } else {
          messageApi.error(scoreResult.message);
        }

        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [dispatch, params?.id, messageApi]);

  const handleCountdownFinish = () => {
    if (!submitted) {
      handleSubmit();
    }
  };

  const handleStart = () => {
    setStarted(true);
    setStartTime(Date.now());
    dispatch(viewAssignmentByCourseId({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setAssigment(res.metadata);
          setTimeLeft(res.metadata[0].timeLimit * 60);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSubmit = () => {
    const expectedEndTime = startTime + timeLeft * 1000;
    const actualEndTime = Date.now();
    const endTime = Math.min(expectedEndTime, actualEndTime); // Use the earlier of the two times
    const timeTaken = Math.floor((endTime - startTime) / 1000); // in milliseconds

    const formattedAnswers = Object.entries(selectedAnswers).map(
      ([questionId, answer]) => ({
        [questionId]: answer,
      })
    );
    dispatch(
      submitAssignment({
        assignmentId: assignmentId,
        answer: formattedAnswers,
        timeLimit: timeTaken,
      })
    )
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
              router.push("/courses/view-course");
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

  const assignmentId = assignment[0]?._id;
  const currentScore = score.find((s) => s.assignment?._id === assignmentId);

  return (
    <div>
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <Row
          style={{
            paddingBottom: "200px",
            overflow: "auto",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Col xs={24} md={16}>
            {score?.some(
              (s) => s?.assignment?._id === assignmentId && s?.isComplete
            ) ? (
              <div className="flex items-center justify-center">
                <div className="rounded-lg bg-gray-50 px-16 py-14">
                  <div className="flex justify-center">
                    <div className="rounded-full bg-green-200 p-6">
                      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke-width="1.5"
                          stroke="currentColor"
                          className="h-8 w-8 text-white"
                        >
                          <path
                            stroke-linecap="round"
                            stroke-linejoin="round"
                            d="M4.5 12.75l6 6 9-13.5"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                  <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
                    Complete!!!
                  </h3>
                  <p className="w-[230px] text-center font-normal text-gray-600">
                    You finished with a score: {currentScore?.score}
                  </p>
                  <div>
                    <Link href="/courses/view-course">
                      <div className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300">
                        Home
                      </div>
                    </Link>
                  </div>
                </div>
              </div>
            ) : started ? (
              assignment.map((item, index) => (
                <React.Fragment key={item._id}>
                  <Card title={item.name}>
                    <Statistic.Countdown
                      value={
                        startTime + (timeLeft !== null ? timeLeft * 1000 : 0)
                      }
                      onFinish={handleCountdownFinish}
                      format="mm:ss"
                    />
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
                      className="button-container me-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                    >
                      Submit
                    </Button>
                  </div>
                </React.Fragment>
              ))
            ) : (
              <div className="flex items-center justify-center">
                <div className="rounded-lg bg-gray-50 px-16 py-14 items-center justify-center">
                  <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
                    Test!!!
                  </h3>
                  <p className="w-[230px] text-center font-bold text-red-600">
                    Please do not exit at the beginning of the test!!!
                  </p>
                  <Button
                    type="primary"
                    onClick={handleStart}
                    className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300"
                  >
                    Start
                  </Button>
                </div>
              </div>
            )}
          </Col>
        </Row>
      )}
    </div>
  );
}
