"use client";
import {
  getACourse,
  removeStudentFromCourse,
  removeStudentFromCourseSuccess,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Empty, Popconfirm, Select, Table, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllScoresByCourseId, viewQuiz } from "@/features/Quiz/quizSlice";
import { isAdmin, isMentor } from "@/middleware";
import "./page.css";

const { Option } = Select;

export default function ViewStudentsCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [update, setUpdate] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewSuccess, setViewSuccess] = useState(false);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    setData([]);
    setTeacher(null);
    setQuizzes([]);
    setScores({});
    setViewSuccess(false);
  };

  const handleViewCourse = useCallback(() => {
    setLoading(true);
    getACourseData(selectedCourse).then(() => {
      loadCourseData(selectedCourse);
    });
  }, [selectedCourse, dispatch, messageApi]);

  const handleDeleteStudent = ({ courseId, userId }) => {
    dispatch(removeStudentFromCourse({ courseId, userId }))
      .then(unwrapResult)
      .then((res) => {
        dispatch(
          removeStudentFromCourseSuccess({ courseId, studentId: userId })
        );
        if (res.status) {
          setUpdate(update + 1);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {});
  };

  const coursesFromStore = useSelector((state) => state.course.courses);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    let visibleCourses;
    if (coursesFromStore.length === 0) {
      setLoading(true);
      dispatch(viewCourses())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            if (isAdmin()) {
              visibleCourses = res.metadata;
            } else {
              visibleCourses = res.metadata.filter(
                (course) => course.teacher === currentTeacherId
              );
            }
            setCourses(visibleCourses);
            setLoading(false);
          }
        });
    } else {
      // Áp dụng lọc cũng cho dữ liệu từ store
      if (isAdmin()) {
        visibleCourses = coursesFromStore.metadata;
      } else if (isMentor()) {
        visibleCourses = coursesFromStore.metadata.filter(
          (course) => course.teacher === currentTeacherId
        );
      }
      setCourses(visibleCourses);
    }
  }, [coursesFromStore]);

  const loadCourseData = (courseId) => {
    dispatch(viewQuiz({ courseIds: courseId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setQuizzes(res.metadata);
          return dispatch(getAllScoresByCourseId({ courseId }));
        } else {
          throw new Error(res.message);
        }
      })
      .then(unwrapResult)
      .then((scoresRes) => {
        if (scoresRes.status) {
          setScores(
            scoresRes.metadata.reduce((acc, current) => {
              acc[current.quizId] = current.scores;
              return acc;
            }, {})
          );
        } else {
          throw new Error(scoresRes.message);
        }
      })
      .catch((error) => {
        messageApi.error(
          error.message || "An error occurred while fetching quizzes or scores."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getACourseData = () => {
    return dispatch(getACourse(selectedCourse))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata.students);
          setTeacher(res.metadata.teacher);
          setViewSuccess(true);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        messageApi.error("An error occurred while fetching course data.");
        setLoading(false);
      });
  };

  const quizColumns = useMemo(
    () =>
      quizzes.map((quiz, index) => ({
        title: `Bài ${index + 1}`,
        dataIndex: quiz._id,
        key: quiz._id,
        render: (text, record) => {
          // Tìm điểm cho bài quiz này trong dữ liệu của học viên
          const studentScore = scores[quiz._id]?.find(
            (score) => score?.userId === record?.userId
          );
          const submissionTime = new Date(quiz?.submissionTime);
          const now = new Date();
          if (studentScore?.isComplete || submissionTime >= now) {
            return studentScore ? studentScore.score : "Chưa làm";
          } else {
            return "Hết hạn nộp";
          }
        },
      })),
    [quizzes, scores]
  );

  const columns = [
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend"],
    },
    ...quizColumns,
    // {
    //   title: "Chức năng",
    //   dataIndex: "action",
    //   key: "operation",
    //   fixed: "right",
    //   width: 100,
    // },
  ];

  const data = useMemo(
    () =>
      dataStudent.map((student, index) => ({
        key: index + 1,
        userId: student?._id,
        lastName: student?.lastName,
        email: student?.email,
        action: (
          <Popconfirm
            title="Xóa học viên"
            description="Bạn có muốn xóa học viên?"
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              style: { backgroundColor: "red" },
            }}
            onConfirm={() =>
              handleDeleteStudent({
                courseId: selectedCourse,
                userId: student?._id,
              })
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        ),
      })),
    [dataStudent]
  );

  return (
    <div className="p-3">
      {contextHolder}
      <h1 className="text-lg font-bold text-[#002c6a]">
        Quản lý bài tập học viên
      </h1>
      <div className="py-3">
        <Select
          placeholder="Chọn khóa học"
          onChange={handleCourseChange}
          value={selectedCourse}
          className="me-3 w-full sm:w-64 mb-3 md:mb-0"
        >
          {courses.map((course) => (
            <Option key={course._id} value={course._id}>
              {course.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={handleViewCourse}
          className="me-3 custom-button"
        >
          Xem
        </Button>

        {viewSuccess ? (
          <>
            {teacher && (
              <div className="border p-4 rounded-md my-4">
                <h2 className="font-bold text-lg">
                  Giáo viên: {teacher?.firstName}
                </h2>
                <p className="text-sm">Email: {teacher?.email}</p>
              </div>
            )}
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 3, position: ["bottomLeft"] }}
              scroll={{
                x: 1300,
              }}
              className="pt-3 grid-container"
            />
          </>
        ) : (
          <>
            {dataStudent?.length === 0 && (
              <div className="flex justify-center items-center h-[45vh]">
                <Empty
                  className="text-center text-lg font-bold text-[#002c6a]"
                  description="Hãy chọn khóa học bạn muốn xem học viên"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
