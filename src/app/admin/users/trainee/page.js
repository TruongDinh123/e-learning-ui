"use client";
import {
  getACourse,
  removeStudentFromCourse,
  removeStudentFromCourseSuccess,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Empty, Modal, Popconfirm, Select, Table, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddStudentToCourse from "../../courses/add-student-course/page";
import { getScoreByQuizId, viewQuiz } from "@/features/Quiz/quizSlice";
import { isAdmin, isMentor } from "@/middleware";

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
  const [scores, setScores] = useState({}); // Change to an object
  const [loading, setLoading] = useState(false);
  const [viewSuccess, setViewSuccess] = useState(false);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
  };

  const handleViewCourse = useCallback(() => {
    getACourseData(selectedCourse);
  }, [selectedCourse]);

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
            setLoading(true);
          }
        })
        .catch((error) => {
          setLoading(false);
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
  }, []);

  useEffect(() => {
    getACourseData();
  }, [update, selectedCourse]);

  useEffect(() => {
    dispatch(viewQuiz({ courseIds: selectedCourse }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setQuizzes(res.metadata);
          const quizIds = res.metadata?.map((quiz) => quiz?._id);
          dataStudent.forEach((student) => {
            const userId = student._id;
            quizIds.forEach((quizId) => {
              dispatch(getScoreByQuizId({ quizId: quizId, userId: userId }))
                .then(unwrapResult)
                .then((res) => {
                  if (res.status) {
                    setScores((prevScores) => ({
                      ...prevScores,
                      [quizId]: res.metadata.map((item) => ({
                        userId: item.user?._id,
                        score: item?.score,
                      })),
                    }));
                  } else {
                    messageApi.error(res.message);
                  }
                });
            });
          });
        }
      })
      .catch((error) => {});
  }, [selectedCourse, dispatch, dataStudent]);

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
      .catch((error) => {});
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
          if (submissionTime < now) {
            return "Hết hạn nộp";
          }
          return studentScore ? studentScore.score : "Chưa làm";
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
      <h1 className="text-lg font-bold text-[#002c6a]">Quản lý bài tập học viên</h1>
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

        {viewSuccess && (
          <>
            {/* <AddStudentToCourse
              courseId={selectedCourse}
              refresh={() => setUpdate(update + 1)}
            >
              Thêm học viên
            </AddStudentToCourse> */}
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
              pagination={{ pageSize: 5, position: ["bottomLeft"] }}
              scroll={{
                x: 1300,
              }}
              className="pt-3 grid-container"
            />
          </>
        )}
      </div>

      {dataStudent?.length === 0 && (
        <div className="flex justify-center items-center h-[45vh]">
          <Empty
            className="text-center text-lg font-bold text-[#002c6a]"
            description="Hãy chọn khóa học bạn muốn xem học viên"
          />
        </div>
      )}
    </div>
  );
}
