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

export default function HandleSubmit(props) {
  const { assignmentId, selectedAnswers, startTime, timeLeft } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

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
    <div style={{ padding: "1rem" }}>
      {contextHolder}
      <Button
        type="primary"
        onClick={handleSubmit}
        className="button-container me-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Submit
      </Button>
    </div>
  );
}
