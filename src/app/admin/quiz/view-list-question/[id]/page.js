"use client";
import { Button, Popconfirm, Spin, Breadcrumb, Tabs, Empty } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import {
  deleteQuizQuestion,
  getScoreByQuizId,
  viewAQuiz,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import Link from "next/link";
import TabPane from "antd/es/tabs/TabPane";
import ViewListScore from "../score-trainee/page";
import "../[id]/page.css";
import moment from "moment";

export default function ViewListQuestion({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  console.log("🚀 ~ quiz:", quiz);
  const [score, setScore] = useState([]);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(viewAQuiz({ quizId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
        } else {
        }
      })
      .catch((error) => {});
  }, [updateQuiz]);

  useEffect(() => {
    dispatch(getScoreByQuizId({ quizId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
      })
      .catch((error) => {});
  }, []);

  const handleDeleteQuiz = ({ quizId, questionId }) => {
    setIsLoading(true);
    dispatch(deleteQuizQuestion({ quizId, questionId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateQuiz(updateQuiz + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {});
  };

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <Breadcrumb>
            <Breadcrumb.Item>
              <Link href="/admin/quiz/view-quiz">Bài tập</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className="font-medium">Chi tiết</span>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Tabs defaultActiveKey="0">
            {quiz?.map((quiz, quizIndex) => (
              <>
                <TabPane tab={`Câu hỏi`} key={quizIndex}>
                  <div className="mb-4 bg-blue-100 p-4 rounded-md shadow-md">
                    <h2 className="text-2xl font-bold text-blue-700">
                      Tên khóa học: {quiz.courseIds[0]?.name}
                    </h2>
                    <p className="text-blue-600">
                      Thời gian hoàn thành:{" "}
                      {moment(quiz.submissionTime).format("DD/MM/YYYY HH:mm")}
                    </p>
                    <p className="text-blue-600">
                      Loại bài tập:{" "}
                      {quiz.type === "multiple_choice"
                        ? "Trắc nghiệm"
                        : "Tự luận"}
                    </p>
                  </div>
                  {quiz.type === "multiple_choice" ? (
                    <div className="grid-container">
                      <div className="flex flex-col sm:flex-row justify-between items-center">
                        <div className="border-gray-300">
                          <span className="pr-4 text-green-600 block sm:inline">
                            Đã nộp: {score.filter((s) => s.isComplete).length}
                          </span>
                          <span className="pr-4 border-gray-300 text-yellow-600 block sm:inline">
                            Chưa nộp:{" "}
                            {quiz.studentIds.length -
                              score.filter((s) => s.isComplete).length}
                          </span>
                          <span className=" text-red-600 block sm:inline">
                            Đã giao: {quiz.studentIds.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center min-h-screen">
                        <div className="p-6 m-5 bg-white rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
                          <h2 className="text-2xl font-bold text-center mb-5">
                            Danh sách: {quiz.name}
                          </h2>
                          {quiz.questions?.map((question, questionIndex) => (
                            <ul key={questionIndex}>
                              <li className="border p-3 mb-2">
                                <div className="mb-2">
                                  <span className="font-bold">
                                    Câu {questionIndex + 1}: {question.question}
                                  </span>
                                </div>
                                {question.options.map((option, optionIndex) => (
                                  <label
                                    className="block mb-2"
                                    key={optionIndex}
                                  >
                                    <span>
                                      Câu {optionIndex + 1}: {option}
                                    </span>
                                  </label>
                                ))}
                                <span className="text-sm text-green-700 font-bold text-center mb-5">
                                  Đáp án: {question.answer}
                                </span>
                                <div className="mt-3">
                                  <Popconfirm
                                    title="Xóa bài tập"
                                    description="Bạn có chắc muốn xóa bài tập?"
                                    okText="Có"
                                    cancelText="Không"
                                    okButtonProps={{
                                      style: { backgroundColor: "red" },
                                    }}
                                    onConfirm={() =>
                                      handleDeleteQuiz({
                                        quizId: quiz?._id,
                                        questionId: question?._id,
                                      })
                                    }
                                  >
                                    <Button danger>Xóa</Button>
                                  </Popconfirm>
                                </div>
                              </li>
                            </ul>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="grid-container bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="border-2 border-gray-300 p-4 rounded-md">
                        <div className="flex items-center space-x-4">
                          <div>
                            <h2 className="text-2xl font-bold mb-5 text-blue-600">
                              {quiz.essay.title}
                            </h2>
                            <div
                              className="mb-5 text-gray-700"
                              dangerouslySetInnerHTML={{
                                __html: quiz.essay.content,
                              }}
                            />
                          </div>
                        </div>
                        <div className="border-l-2 border-gray-300 pl-4">
                          <span className="pr-4 text-green-600">
                            Đã nộp: {score.filter((s) => s.isComplete).length}
                          </span>
                          <span className="px-4 border-l-2 border-gray-300 text-yellow-600">
                            Chưa nộp:{" "}
                            {quiz.studentIds.length -
                              score.filter((s) => s.isComplete).length}
                          </span>
                          <span className="pl-4 text-red-600">
                            Đã giao: {quiz.studentIds.length}
                          </span>
                        </div>
                      </div>
                      {quiz.essay.attachment && (
                        <div>
                          <h3 className="text-lg font-bold mb-2">
                            File đính kèm:
                          </h3>
                          <a
                            href={quiz.essay.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Download File
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </TabPane>
                <TabPane tab={`Điểm học viên`} key={quizIndex + 1}>
                  <ViewListScore quizId={params?.id} />
                </TabPane>
              </>
            ))}
          </Tabs>
        </React.Fragment>
      )}
    </div>
  );
}
