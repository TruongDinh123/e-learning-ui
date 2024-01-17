"use client";
import { completeLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import {
  FaCheckCircle as CheckCircle,
  FaTimesCircle as XCircle,
} from "react-icons/fa";
import { message } from "antd";
import { useState } from "react";
import { Button } from "react-bootstrap";

export default function CompleteLesson(props) {
  const { lessonId, refresh, isCompleted } = props;
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();

  const onClick = async () => {
    try {
      setIsLoading(true);

      await dispatch(completeLesson({ lessonId: lessonId }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            messageApi
              .open({
                type: "Thành công",
                content: "Update...",
                duration: 2.5,
              })
              .then(() => {
                message.success(res.message, 1.5);
                refresh();
              });
          }
        });
    } catch {
      message.error("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  const Icon = isCompleted ? XCircle : CheckCircle;

  return (
    <div>
      {contextHolder}
      <Button
        onClick={onClick}
        disabled={isLoading}
        type="button"
        className={`w-full md:w-auto ${
          isCompleted
            ? "bg-slate-400 hover:bg-gray-200"
            : "bg-green-500 hover:bg-green-700"
        }`}
      >
        {isCompleted ? "Chưa hoàn thành" : "Hoàn thành bài học"}
        <Icon
          className={`h-4 w-4 ml-2 ${
            isCompleted ? "text-black" : "text-white"
          }`}
        />
      </Button>
    </div>
  );
}
