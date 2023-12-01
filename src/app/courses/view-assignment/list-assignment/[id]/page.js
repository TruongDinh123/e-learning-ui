"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Radio, message, Row, Col, Statistic, Spin } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import {
  submitAssignment,
  viewAssignmentByCourseId,
} from "@/features/Assignment/assignmentSlice";
import { Button } from "@material-tailwind/react";

export default function ListAssignment({ params }) {
  const dispatch = useDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assignment, setAssigment] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  const handleAnswer = useCallback((questionId, answer) => {
    console.log("handleAnswer function has started");
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    console.log("handleAnswer function has finished");
  }, []);

  // useEffect(() => {
  //   console.log("useEffect has started");
  //   setIsLoading(true);
  //   setStartTime(Date.now());
  //   dispatch(viewAssignmentByCourseId({ courseId: params?.id }))
  //     .then(unwrapResult)
  //     .then((res) => {
  //       console.log("🚀 ~ res:", res);
  //       if (res.status) {
  //         setAssigment(res.metadata);
  //         setTimeLeft(res.metadata[0]?.timeLimit * 60);
  //       } else {
  //         messageApi.error(res.message);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setIsLoading(false);
  //     });
  //   console.log("useEffect has finished");
  // }, [dispatch, params?.id, messageApi]);

  const handleCountdownFinish = () => {
    if (!submitted) {
      handleSubmit();
    }
  };

  const assignmentId = assignment[0]?._id;

  const handleSubmit = async () => {
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
        console.log("submitAssignment response received");
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
        console.log("submitAssignment error:", error);
      });
  };

  return (
    <div>
      {contextHolder}
      <Row
        style={{
          paddingBottom: "200px",
          overflow: "auto",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Col xs={24} md={16}>
          {assignment?.map((item, index) => (
            <React.Fragment key={item._id}>
              <Card title={item.name}>
                <Statistic.Countdown
                  value={startTime + (timeLeft !== null ? timeLeft * 1000 : 0)}
                  onFinish={handleCountdownFinish}
                  format="mm:ss"
                />
                {item?.questions?.map((question, questionIndex) => {
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
          ))}
        </Col>
      </Row>
      <h1>hi</h1>
    </div>
  );
}
