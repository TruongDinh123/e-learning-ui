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
  console.log("🚀 ~ quiz:", quiz);
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
              : router.push(
                  `/courses/view-details/handle-submit-essay/${i?._id}`
                )
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
          <div class="container mx-auto p-4">
            <div class="bg-teal-500 p-4 text-white text-5xl mb-6 rounded shadow-lg">
              Khóa học
            </div>

            <div class="flex mt-6 justify-center pb-40">
              <div class="p-2 mt-2 border-4 mr-36">
                <div class="bg-white p-4 rounded-lg card-shadow">
                  <div class="flex items-center">
                    <div class="ml-4">
                      <p class="text-sm">Sắp đến hạn</p>
                      <p class="text-xs text-gray-600">
                        Tuyệt vời, không có bài tập nào sắp đến hạn!
                      </p>
                    </div>
                  </div>
                  <div class="mt-4">
                    <a href="#" class="text-blue-500 text-sm">
                      Xem tất cả
                    </a>
                  </div>
                </div>
              </div>

              <div class="flex flex-wrap -mx-2 mt-4">
                <div class=" w-full p-2">
                  <div class="bg-white flex p-4 rounded-lg card-shadow border-t border-b border-l border-r">
                    <div class="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                      <i class="fas fa-book-open text-white"></i>
                    </div>
                    <textarea
                      class="w-full p-2 rounded border-gray-300"
                      rows="4"
                      placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                    ></textarea>
                  </div>
                </div>

                <div class="w-full p-2">
                  {data.map((item, index) => (
                    <>
                      <div class="bg-white rounded-lg card-shadow border-t border-b border-l border-r border-gray-300 w-full">
                        <div class="flex items-center justify-between p-4">
                          <div class="flex items-center">
                            <div class="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                              <i class="fas fa-book-open text-white"></i>
                            </div>
                            <div class="ml-4">
                              <p class="text-sm">
                                Giáo viên đã đăng một bài tập mới: {item.name}
                              </p>
                              <p class="text-xs text-gray-600">
                                Hạn nộp bài: {item.submissionTime}
                              </p>
                            </div>
                          </div>
                          <div class="text-gray-600">
                            <i class="fas fa-ellipsis-v"></i>
                          </div>
                        </div>
                        <div class="mt-4 border-t pt-4 p-4">
                          {item.questions}
                        </div>
                      </div>
                    </>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
