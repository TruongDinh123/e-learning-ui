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

export default function ViewListQuestion({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
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
      .catch((error) => {
        console.log(error);
      });
  }, [updateQuiz]);

  useEffect(() => {
    dispatch(getScoreByQuizId({ quizId: params?.id }))
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
      .catch((error) => {
        console.log(error);
      });
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
              <Link href={`/admin/quiz/view-list-question`}>Chi tiết</Link>
            </Breadcrumb.Item>
          </Breadcrumb>
          <Tabs defaultActiveKey="0">
            {quiz?.map((quiz, quizIndex) => (
              <>
                <TabPane tab={`Câu hỏi`} key={quizIndex}>
                  {quiz.type === "multiple_choice" ? (
                    <>
                      <div className="flex justify-between items-center">
                        <div className="flex justify-start font-semibold">
                          <span className="pr-4 border-r border-gray-700">
                            Đã nộp: {score.filter((s) => s.isComplete).length}
                          </span>
                          <span className="px-4 border-r border-gray-700">
                            Chưa nộp:
                          </span>
                          <span className="pl-4">
                            Đã giao: {quiz.studentIds.length}
                          </span>
                        </div>
                      </div>
                      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
                        <div className="p-6 m-5 bg-white rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
                          <h2 className="text-2xl font-bold text-center mb-5">
                            List Quiz: {quiz.name}
                          </h2>
                          {quiz.questions?.map((question, questionIndex) => (
                            <ul key={questionIndex}>
                              <li className="border p-3 mb-2">
                                <div className="mb-2">
                                  <span className="font-bold">
                                    Quiz {questionIndex + 1}:{" "}
                                    {question.question}
                                  </span>
                                </div>
                                {question.options.map((option, optionIndex) => (
                                  <label
                                    className="block mb-2"
                                    key={optionIndex}
                                  >
                                    <span>
                                      {optionIndex + 1}: {option}
                                    </span>
                                  </label>
                                ))}
                                <span className="text-sm text-green-700 font-bold text-center mb-5">
                                  Answer: {question.answer}
                                </span>
                                <div className="mt-3">
                                  <Popconfirm
                                    title="Delete the quiz"
                                    description="Are you sure to delete this Quiz?"
                                    okText="Yes"
                                    cancelText="No"
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
                    </>
                  ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
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
                            Chưa nộp:
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
