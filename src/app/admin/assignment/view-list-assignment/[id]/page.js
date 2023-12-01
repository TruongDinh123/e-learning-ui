"use client";
import { Button, Popconfirm, Spin, Breadcrumb } from "antd";
import { useDispatch } from "react-redux";
import React, { useEffect, useState } from "react";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  deleteQuizAssignment,
  viewAssignmentByCourseId,
} from "@/features/Assignment/assignmentSlice";
import Link from "next/link";
import UpdateAssignment from "../../update-assignment/page";

export default function ViewAssignment({ params }) {
  const dispatch = useDispatch();
  const [assignment, setAssignment] = useState([]);
  const [updateQuiz, setUpdateAssignment] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    dispatch(viewAssignmentByCourseId({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setAssignment(res.metadata);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateQuiz]);

  const handleDeleteQuiz = ({ assignmentId, questionId }) => {
    setIsLoading(true);

    dispatch(deleteQuizAssignment({ assignmentId, questionId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateAssignment(updateQuiz + 1);
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
          {assignment.map((assignment, assignmentIndex) => {
            return (
              <React.Fragment key={assignmentIndex}>
                <Breadcrumb className="pb-2">
                  <Breadcrumb.Item>
                    <Link href="/admin/assignment/view-assignment">
                      assignment
                    </Link>
                  </Breadcrumb.Item>
                  <Breadcrumb.Item>
                    <Link
                      href={`/admin/assignment/view-list-assignment/${params?.id}`}
                    >
                      {assignment.name}
                    </Link>
                  </Breadcrumb.Item>
                </Breadcrumb>
                <div
                  className="flex flex-col items-center justify-center min-h-screen bg-gray-100"
                  key={assignmentIndex}
                >
                  <div className="p-6 m-5 bg-white rounded shadow-md w-full sm:w-1/2 lg:w-1/3">
                    <h2 className="text-2xl font-bold text-center mb-5">
                      List Assignment: {assignment.name}
                    </h2>
                    {assignment.questions?.map((question, questionIndex) => {
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
                              <UpdateAssignment
                                assignmentId={assignment?._id}
                                questionId={question?._id}
                                courseId={params?.id}
                                refresh={() =>
                                  setUpdateAssignment(updateQuiz + 1)
                                }
                              />
                              <Popconfirm
                                title="Delete the assignment"
                                description="Are you sure to delete this Assignment?"
                                okText="Yes"
                                cancelText="No"
                                okButtonProps={{
                                  style: { backgroundColor: "red" },
                                }}
                                onConfirm={() =>
                                  handleDeleteQuiz({
                                    assignmentId: assignment?._id,
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
