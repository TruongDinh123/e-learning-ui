"use client";
import { getACourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddStudentToCourse from "../../courses/add-student-course/page";
import {
  getScoreByQuizId,
  getScoreByUserId,
  viewQuiz,
} from "@/features/Quiz/quizSlice";

const { Option } = Select;

export default function ViewStudentsCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  console.log("🚀 ~ quizzes:", quizzes);
  const [update, setUpdate] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scores, setScores] = useState({}); // Change to an object
  const [selectedCourseDetails, setSelectedCourseDetails] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState({}); // Change to an object

  const showModal = async (studentId) => {
    const lessons = selectedCourseDetails?.lessons;

    const lessonScores = await Promise.all(
      lessons?.map((lesson) => {
        const quizId = lesson.quiz;

        return dispatch(getScoreByUserId({ userId: studentId, quizId }))
          .then(unwrapResult)
          .then((result_1) => {
            return {
              lesson,
              score: result_1.metadata,
              userId: studentId,
            };
          });
      })
    );
    setScores((prevScores) => ({
      ...prevScores,
      [studentId]: lessonScores,
    }));
    setIsModalOpen((prevIsModalOpen) => ({
      ...prevIsModalOpen,
      [studentId]: true,
    }));
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
    setSelectedCourseDetails(null); // Reset giá trị của selectedCourseDetails
  };

  const handleViewCourse = (value) => {
    getACourseData(value);
  };

  useEffect(() => {
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 1.5,
            })
            .then(() => {
              setCourses(res.metadata);
            });
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    getACourseData();
  }, [update]);

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
                        userId: item.user._id,
                        score: item.score,
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
      .catch((error) => {
        console.log(error);
      });
  }, [selectedCourse, dispatch, dataStudent]);

  const getACourseData = () => {
    return dispatch(getACourse(selectedCourse))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata.students);
          setTeacher(res.metadata.teacher);
          setSelectedCourseDetails(res.metadata);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const quizColumns = quizzes.map((quiz) => ({
    title: quiz.name,
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
  }));

  const columns = [
    {
      title: "Tên",
      dataIndex: "lastName",
      key: "lastName",
      width: 100,
      fixed: "left",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      fixed: "left",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend"],
    },
    ...quizColumns,
    {
      title: "Chức năng",
      dataIndex: "action",
      key: "operation",
      fixed: "right",
      width: 100,
    },
  ];

  let data = [];
  dataStudent.forEach((student, index) => {
    data.push({
      key: index + 1,
      userId: student?._id,
      lastName: student?.lastName,
      email: student?.email,
    });
  });

  return (
    <React.Fragment>
      {contextHolder}
      <div className="pb-3">
        <Select
          placeholder="Chọn khóa học"
          onChange={handleCourseChange}
          value={selectedCourse}
          className="me-3"
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
          className="me-3"
          style={{ color: "#fff", backgroundColor: "#1890ff" }}
        >
          Xem
        </Button>
      </div>

      <AddStudentToCourse
        courseId={selectedCourse}
        refresh={() => setUpdate(update + 1)}
      >
        Thêm học viên
      </AddStudentToCourse>
      {teacher && (
        <div className="border p-4 rounded-md my-4">
          <h2 className="font-bold text-lg">Giáo viên: {teacher?.lastName}</h2>
          <p className="text-sm">Email: {teacher?.email}</p>
        </div>
      )}
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        scroll={{
          x: 1300,
        }}
        className="pt-3"
      />
    </React.Fragment>
  );
}
