"use client";
import { Button, Table, Spin } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  getQuizzesByStudentAndCourse,
  getScore,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

export default function ViewQuiz({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    dispatch(getQuizzesByStudentAndCourse({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name Quiz",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Thời gian nộp",
      dataIndex: "createdAt",
      onFilter: (value, record) => record.createdAt.indexOf(value) === 0,
      sorter: (a, b) => a.createdAt.length - b.createdAt.length,
      sortDirections: ["descend"],
    },
    {
      title: "Hạn nộp bài",
      dataIndex: "submissionTime",
      onFilter: (value, record) => record.submissionTime.indexOf(value) === 0,
      sorter: (a, b) => a.submissionTime.length - b.submissionTime.length,
      sortDirections: ["descend"],
    },
    {
      title: "Trạng thái",
      dataIndex: "isComplete",
      onFilter: (value, record) => record.isComplete.indexOf(value) === 0,
      sorter: (a, b) => a.isComplete.length - b.isComplete.length,
      sortDirections: ["descend"],
    },
    {
      title: "Hình thức",
      dataIndex: "type",
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      sorter: (a, b) => a.type.length - b.type.length,
      sortDirections: ["descend"],
    },
    {
      title: "Questions",
      dataIndex: "questions",
      onFilter: (value, record) => record.questions.indexOf(value) === 0,
      sorter: (a, b) => a.questions.length - b.questions.length,
      sortDirections: ["descend"],
    },
  ];

  let data = [];
  quiz?.forEach((i, index) => {
    const correspondingScore = score.find((s) => s.quiz?._id === i?._id);

    data.push({
      key: index + 1,
      name: i?.name,
      submissionTime: format(
        new Date(i?.submissionTime),
        "dd/MM/yyyy HH:mm:ss"
      ),
      createdAt: format(new Date(i?.createdAt), "dd/MM/yyyy HH:mm:ss"),
      isComplete: correspondingScore
        ? correspondingScore.isComplete
          ? "Đã hoàn thành"
          : "Chưa hoàn thành"
        : "Chưa hoàn thành",
      type: i?.type,
      questions: (
        <Button
        className="me-3"
        style={{ width: "100%" }}
        onClick={() =>
          i?.type === "multiple_choice"
            ? router.push(`/courses/view-details/submit-quiz/${i?._id}`)
            : router.push(`/courses/view-details/handle-submit-essay/${i?._id}`)
        }
      >
        Xem chi tiết
      </Button>
      ),
    });
  });

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <Table columns={columns} dataSource={data} />
        </React.Fragment>
      )}
    </div>
  );
}
