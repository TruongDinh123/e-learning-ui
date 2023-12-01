"use client";
import React, { useCallback, useEffect, useState } from "react";
import { Card, Radio, message, Row, Col, Statistic } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import HandleSubmit from "../handle-submit/page";

export default function ListAssignment({ params }) {
  const dispatch = useDispatch();
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [assignment, setAssigment] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(null);
  const [startTime, setStartTime] = useState(null);

  const handleAnswer = useCallback((questionId, answer) => {
    console.log("handleAnswer function has started");
    setSelectedAnswers((prevAnswers) => ({
      ...prevAnswers,
      [questionId]: answer,
    }));
    console.log("handleAnswer function has finished");
  }, []);

  useEffect(() => {
    console.log("useEffect has started");
    setStartTime(Date.now());

    const fetchData = async () => {
      try {
        const resultAction = await dispatch(
          viewAssignmentByCourseId({ courseId: params?.id })
        );
        const res = unwrapResult(resultAction);
        if (res.status) {
          console.log("res has finished");
          setAssigment(res.metadata);
          setTimeLeft(res.metadata[0]?.timeLimit * 60);
          console.log("res has finished");
        } else {
          messageApi.error(res.message);
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();

    console.log("useEffect has finished");
  }, []);

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
          <h1>hi</h1>
        </Col>
      </Row>
    </div>
  );
}
