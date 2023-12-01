"use client";
import { Button, Popconfirm, Spin, Breadcrumb } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteQuizQuestion, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import Link from "next/link";
import UpdateQuiz from "../../update-quiz/page";

export default function ViewListQuestion({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(viewQuiz({ lessonId: params?.id }))
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
          {quiz.map((quiz, quizIndex) => {
            return (
              <React.Fragment key={quizIndex}>
                <Breadcrumb>
                  <Breadcrumb.Item>
                    <Link href="/admin/quiz/view-quiz">quiz</Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link href={`/admin/quiz/view-list-question/${params?.id}`}>
                      {quiz.name}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <UpdateQuiz
                  lessonId={params?.id}
                  quizId={quiz?._id}
                  refresh={() => setUpdateQuiz(updateQuiz + 1)}
                />
                <div
                  className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
                  key={quizIndex}
                >
                  <div className="p-6 m-5 bg-white rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
                    <h2 className="text-2xl font-bold text-center mb-5">
                      List Quiz: {quiz.name}
                    </h2>
                    {quiz.questions?.map((question, questionIndex) => {
                      return (
                        <ul key={questionIndex}>
                          <li className="border p-3 mb-2">
                            <div className="mb-2">
                              <span className="font-bold">
                                Quiz {questionIndex + 1}: {question.question}
                              </span>
                            </div>
                            {question.options.map((option, optionIndex) => (
                              <label className="block mb-2" key={optionIndex}>
                                <span>
                                  {optionIndex + 1}: {option}
                                </span>
                              </label>
                            ))}
                            <span className="text-sm text-green-700 font-bold text-center mb-5">
                              Anwser: {question.answer}
                            </span>
                            <div className="mt-3">
                              <UpdateQuiz
                                lessonId={params?.id}
                                quizId={quiz?._id}
                                questionId={question?._id}
                                refresh={() => setUpdateQuiz(updateQuiz + 1)}
                              />
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
                                <Button danger>Delete</Button>
                              </Popconfirm>
                            </div>
                          </li>
                        </ul>
                      );
                    })}
                  </div>
                </div>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
}
