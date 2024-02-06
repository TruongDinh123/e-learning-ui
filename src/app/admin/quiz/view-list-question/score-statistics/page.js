"use client";
import { getScoreByQuizId } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Empty, Table, message } from "antd";
import moment from "moment";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ScoreStatisticsCourse(props) {
  const { quizId } = props;

  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    dispatch(getScoreByQuizId({ quizId: quizId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
      })
      .catch((error) => {
        messageApi.error(error);
      });
  }, []);

  const columns = [
    {
      title: "Tên học viên",
      dataIndex: ["user", "firstName"],
      key: "firstName",
    },
    {
      title: "Email",
      dataIndex: ["user", "email"],
      key: "email",
    },
    {
      title: "Hoàn thành",
      dataIndex: "isComplete",
      key: "isComplete",
      render: (isComplete) => (isComplete ? "Hoàn thành" : "Chưa hoàn thành"),
    },
    {
      title: "Thời gian hoàn thành",
      dataIndex: "submitTime",
      render: (submitTime) => moment(submitTime).format("DD/MM/YYYY HH:mm:ss"),
    },
    {
      title: "Số điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

  return (
    <div>
      {contextHolder}
      {score.length === 0 ? (
        <div
          className="flex justify-center items-center"
          style={{ height: "100%" }}
        >
          <Empty description="Hiện tại chưa có học viên nộp bài" />
        </div>
      ) : (
        <Table
          dataSource={score}
          columns={columns}
          rowKey={(record) => record._id}
        />
      )}
    </div>
  );
}