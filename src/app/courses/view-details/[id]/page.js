"use client";
import { Button, Table, Spin } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getQuizsByCourse,
  getQuizzesByStudentAndCourse,
  getScore,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { createNotification, getACourse } from "@/features/Courses/courseSlice";

export default function ViewQuiz({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  const [dataCourse, setDataCourse] = useState([]);
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

  useEffect(() => {
    setLoading(true);
    dispatch(getACourse(params?.id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setDataCourse(res?.metadata);
          setLoading(false);
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const userState = useSelector((state) => state?.user?.user);

  useEffect(() => {
    if (
      userState?.metadata?.account?.roles.includes("Admin") ||
      userState?.metadata?.account?.roles.includes("Mentor")
    ) {
      setLoading(true);
      dispatch(getQuizsByCourse({ courseId: params?.id }))
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
    }
  }, [userState]);

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

  const handleNoti = ({ message }) => {
    dispatch(createNotification({ courseId: params?.id, message }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setDataCourse((prevDataCourse) => ({
            ...prevDataCourse,
            notifications: [
              ...prevDataCourse.notifications,
              { message, date: new Date() },
            ],
          }));
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  let data = [];
  quiz?.forEach((i, index) => {
    const correspondingScore = score.find((s) => s.quiz?._id === i?._id);

    data.push({
      key: index + 1,
      name: i?.name,
      submissionTime: i?.submissionTime
        ? format(new Date(i?.submissionTime), "dd/MM/yyyy HH:mm:ss")
        : "Không có hạn",
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
          <div className="container mx-auto p-4 sm:p-6 md:p-8">
            <div className="bg-teal-500 p-4 text-white text-5xl mb-6 rounded shadow-lg">
              Khóa học
            </div>
            <div className="flex mt-6 justify-center items-center pb-40">
              {/* <div className="p-2 mt-2 border-4 mr-36 hidden md:block">
                <div className="bg-white p-4 rounded-lg card-shadow">
                  <div className="flex items-center">
                    <div className="ml-4">
                      <p className="text-sm">Sắp đến hạn</p>
                      <p className="text-xs text-gray-600">
                        Tuyệt vời, không có bài tập nào sắp đến hạn!
                      </p>
                    </div>
                  </div>
                  <div className="mt-4">
                    <a href="#" className="text-blue-500 text-sm">
                      Xem tất cả
                    </a>
                  </div>
                </div>
              </div> */}

              <div className="flex flex-wrap -mx-2 mt-4 md:mt-0">
                <div className="w-full p-2">
                  <div className="bg-white flex p-4 rounded-lg card-shadow border-t border-b border-l border-r">
                    <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                      <i className="fas fa-book-open text-white"></i>
                    </div>
                    <textarea
                      className="w-full p-2 rounded border-gray-300"
                      rows="4"
                      placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleNoti({ message: e.target.value });
                          e.target.value = "";
                        }
                      }}
                    ></textarea>
                  </div>
                </div>
                <div className="w-full  p-2">
                  <div className="bg-white flex flex-col p-6 rounded-lg shadow-md border border-gray-200">
                    <div className="flex items-center mb-4">
                      <h2 className="text-lg font-semibold text-gray-700">
                        Notifications
                      </h2>
                    </div>
                    {dataCourse?.notifications?.map((noti, notiIndex) => (
                      <div
                        key={notiIndex}
                        className="w-full p-4 mb-4 rounded border border-gray-300 bg-gray-50"
                      >
                        <div className="flex">
                          <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center mr-4 mb-2 ">
                            <i className="fas fa-book-open text-white"></i>
                          </div>
                          <p className="mb-2 font-semibold text-gray-700">
                            Giáo viên: {dataCourse?.teacher.lastName}
                            <p className="text-sm text-gray-500">
                              {format(new Date(noti?.date), "HH:mm:ss")}
                            </p>
                          </p>
                        </div>

                        <p className="text-gray-600">{noti?.message}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2">
                  {data.map((item, index) => (
                    <div
                      key={index}
                      className="bg-white rounded-lg card-shadow border-t border-b border-l border-r border-gray-300 w-full"
                    >
                      <div className="flex items-center justify-between p-4">
                        <div className="flex items-center">
                          <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                            <i className="fas fa-book-open text-white"></i>
                          </div>
                          <div className="ml-4">
                            <p className="text-sm">Bài tập mới: {item.name}</p>
                            <p className="text-xs text-gray-600">
                              Hạn nộp bài: {item?.submissionTime}
                            </p>
                          </div>
                        </div>
                        <div className="text-gray-600">
                          <i className="fas fa-ellipsis-v"></i>
                        </div>
                      </div>
                      <div className="mt-4 border-t pt-4 p-4">
                        {item.questions}
                      </div>
                    </div>
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
