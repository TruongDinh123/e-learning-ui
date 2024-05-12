"use client";
import React, { useEffect, useState } from "react";
import {Empty, Spin, Tabs } from "antd";
import StudentWork from "../trainee-work/page";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getScoreByQuizId } from "@/features/Quiz/quizSlice";
import "./page.css";
// import { useMediaQuery } from "react-responsive";

export default function ViewListScore(props) {
  // const [messageApi, contextHolder] = message.useMessage();
  const { quizId, totalQuestions } = props;
  const dispatch = useDispatch();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [score, setScore] = useState([]);
  // const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(0);

  // const handleCheckAll = (e) => {
  //   setSelectAll(e.target.checked);
  //   setScore(
  //     score.map((student) => ({ ...student, selected: e.target.checked }))
  //   );
  // };
  //
  // const handleStudentCheck = (studentId, checked) => {
  //   setScore(
  //     score.map((student) =>
  //       student._id === studentId ? { ...student, selected: checked } : student
  //     )
  //   );
  // };

  // const handleScoreChange = (studentId, newScore) => {
  //   const maxScore = totalQuestions * 10;
  //   if (newScore < -1 || newScore > maxScore) {
  //     messageApi.error(`Điểm phải nằm trong khoảng từ 0 đến ${maxScore}`);
  //     return;
  //   }
  //   setScore(
  //     score.map((student) =>
  //       student._id === studentId
  //         ? { ...student, updateScore: newScore }
  //         : student
  //     )
  //   );
  // };

  // const handleReturnWork = () => {
  //   const scoresToUpdate = score
  //     .filter((student) => student?.selected)
  //     .map((student) => ({
  //       scoreId: student?._id,
  //       updateScore: student?.updateScore,
  //     }));
  //   setIsLoading(true);
  //   dispatch(updateScore(scoresToUpdate))
  //     .then(unwrapResult)
  //     .then((res) => {
  //       messageApi
  //         .open({
  //           type: "Thành công",
  //           content: "Đang thực hiện...",
  //           duration: 2.5,
  //         })
  //         .then(() => {
  //           setUpdate(update + 1);
  //           setScore(score.map((student) => ({ ...student, selected: false })));
  //           setSelectAll(false);
  //         });
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       setIsLoading(false);
  //     });
  // };

  useEffect(() => {
    setIsLoading(true);
    dispatch(getScoreByQuizId({ quizId: quizId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [update]);

  const getFullName = (student) =>
    [student?.lastName, student?.firstName].filter(Boolean).join(" ");

  const tabItems = score.map((student) => ({
    label: (
      <li
        className={`px-4 py-4 flex items-center sm:px-6 ${
          selectedStudent && selectedStudent._id === student._id
            ? "selected-student"
            : ""
        }`}
        style={{ maxWidth: "100%", overflow: "auto", }}
      >
        {/*<input*/}
        {/*  type="checkbox"*/}
        {/*  className="mr-4 h-4 w-4 text-indigo-600 border-gray-300 rounded"*/}
        {/*  checked={student.selected}*/}
        {/*  onChange={(e) => handleStudentCheck(student._id, e.target.checked)}*/}
        {/*/>*/}
        <div
          onClick={() => setSelectedStudent(student)}
          className="flex flex-1 cursor-pointer items-center"
        >
          <img
            className="h-10 w-10 rounded-full mr-4"
            src={student?.user?.image_url || "https://placehold.co/100x100"}
            alt="Placeholder avatar for student"
          />
          <div className="min-w-0 flex-1 items-center">
            <p className="text-sm font-medium text-gray-900 truncate">
              {student?.user?.lastName} {student?.user?.firstName}
            </p>
          </div>
        </div>
        <div className="ml-4 flex-shrink-0">
          {/*<input*/}
          {/*  type="number"*/}
          {/*  className="text-sm text-gray-500 border-l-2 pl-4"*/}
          {/*  defaultValue={student?.updateScore ?? student?.score ?? ""}*/}
          {/*  onBlur={(e) => handleScoreChange(student._id, e.target.value)}*/}
          {/*  onKeyDown={(e) => {*/}
          {/*    if (e.key === "Enter") {*/}
          {/*      handleScoreChange(student._id, e.target.value);*/}
          {/*    }*/}
          {/*  }}*/}
          {/*  placeholder="_"*/}
          {/*/>*/}
          <span className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
            {student?.updateScore ?? student?.score ?? ""}/ {totalQuestions * 10}
          </span>
        </div>
      </li>
    ),
    key: student._id,
    children: (
      <div className="mb-5">
        <h1 className="flex justify-center items-center text-xl font-bold pb-4 text-purple-600">
          Bài làm của: {getFullName(student.user)}
        </h1>
        <StudentWork student={student} />
    </div>
    ),
  }));

  return (
    <div>
      {/*{contextHolder}*/}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          {score.length > 0 ? (
            <>
              {/*<div style={{ marginBottom: 25 }}>*/}
              {/*  <Button*/}
              {/*    type="primary"*/}
              {/*    style={{ color: "#fff", backgroundColor: "#1890ff" }}*/}
              {/*    onClick={handleReturnWork}*/}
              {/*    loading={isLoading}*/}
              {/*  >*/}
              {/*    Trả bài cho học viên*/}
              {/*  </Button>*/}
              {/*</div>*/}
              {/*<Checkbox*/}
              {/*  checked={selectAll}*/}
              {/*  onChange={handleCheckAll}*/}
              {/*  className="font-bold"*/}
              {/*>*/}
              {/*  Chọn tất cả học viên*/}
              {/*</Checkbox>*/}
            </>
          ) : (
            <div
              className="flex justify-center items-center scrollbar scrollbar-thin"
              style={{ height: "45vh" }}
            >
              <Empty description="Hiện tại chưa có học viên nộp bài" />
            </div>
          )}
        </React.Fragment>
      )}
      {score.length > 0 ? (
        <Tabs tabPosition="left" items={tabItems} type="line"  className="scrollbar scrollbar-thin" />
      ) : null}
    </div>
  );
}
