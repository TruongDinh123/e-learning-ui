"use client";
import React, { useEffect, useState } from "react";
import { Button, Checkbox, Empty, Spin, Tabs, message } from "antd";
import StudentWork from "../trainee-work/page";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { getScoreByQuizId, updateScore } from "@/features/Quiz/quizSlice";
import "./page.css";
const { TabPane } = Tabs;

export default function ViewListScore(props) {
  const [messageApi, contextHolder] = message.useMessage();
  const { quizId } = props;
  const dispatch = useDispatch();
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [score, setScore] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [update, setUpdate] = useState(0);

  const handleCheckAll = (e) => {
    setSelectAll(e.target.checked);
    setScore(
      score.map((student) => ({ ...student, selected: e.target.checked }))
    );
  };

  const handleStudentCheck = (studentId, checked) => {
    setScore(
      score.map((student) =>
        student._id === studentId ? { ...student, selected: checked } : student
      )
    );
  };

  const handleScoreChange = (studentId, newScore) => {
    if (newScore < 0 || newScore > 10) {
      messageApi.error("Điểm phải nằm trong khoảng từ 0 đến 10");
      return;
    }
    setScore(
      score.map((student) =>
        student._id === studentId
          ? { ...student, updateScore: newScore }
          : student
      )
    );
  };

  const handleReturnWork = () => {
    const scoresToUpdate = score
      .filter((student) => student?.selected)
      .map((student) => ({
        scoreId: student?._id,
        updateScore: student?.updateScore,
      }));
    setIsLoading(true);
    dispatch(updateScore(scoresToUpdate))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            setUpdate(update + 1);
            setScore(score.map((student) => ({ ...student, selected: false })));
            setSelectAll(false);
          });
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

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

  return (
    <div>
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          {score.length > 0 ? (
            <>
              <div style={{ marginBottom: 25 }}>
                <Button
                  type="primary"
                  style={{ color: "#fff", backgroundColor: "#1890ff" }}
                  onClick={handleReturnWork}
                  loading={isLoading}
                >
                  Trả bài cho học viên
                </Button>
              </div>
              <Checkbox
                checked={selectAll}
                onChange={handleCheckAll}
                className="font-bold"
              >
                Chọn tất cả học viên
              </Checkbox>
            </>
          ) : (
            <div
              className="flex justify-center items-center"
              style={{ height: "45vh" }}
            >
              <Empty description="Hiện tại chưa có học viên nộp bài" />
            </div>
          )}
        </React.Fragment>
      )}

      <div className="flex grid-container">
        <div className="flex-2">
          {score.length > 0 ? (
            <Tabs tabPosition={"left"} className="tabs-container">
              {score.map((student, index) => (
                <TabPane
                  tab={
                    <li
                      className="px-4 py-4 flex items-center sm:px-6"
                      onClick={() => setSelectedStudent(student)}
                    >
                      <input
                        type="checkbox"
                        className="mr-4 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                        checked={student.selected}
                        onChange={(e) =>
                          handleStudentCheck(student._id, e.target.checked)
                        }
                      />
                      <img
                        class="h-10 w-10 rounded-full mr-4"
                        src={
                          student?.user?.image_url || "https://placehold.co/100x100"
                        }
                        alt="Placeholder avatar for student"
                      />
                      <div class="min-w-0 flex-1">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {student?.user?.lastName} {student?.user?.firstName}
                        </p>
                      </div>
                      <div class="ml-4 flex-shrink-0">
                        <input
                          type="number"
                          class="text-sm text-gray-500 border-l-2 pl-4"
                          value={student?.updateScore ?? student?.score ?? ""}
                          onChange={(e) =>
                            handleScoreChange(student._id, e.target.value)
                          }
                          placeholder="_"
                        />

                        <span class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500">
                          /10
                        </span>
                      </div>
                    </li>
                  }
                  key={index}
                />
              ))}
            </Tabs>
          ) : null}
        </div>

        <div className="flex-1">
          {selectedStudent && <StudentWork student={selectedStudent} />}
        </div>
      </div>
    </div>
  );
}
