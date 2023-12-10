"use client";
import { Button, Table, Popconfirm, Select, Spin } from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import React from "react";
import { useRouter } from "next/navigation";
import UpdateQuiz from "../update-quiz/page";

const { Option } = Select;

export default function ViewQuiz() {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedCourseLessons, setSelectedCourseLessons] = useState([]);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
    setSelectedCourseLessons(selectedCourse?.lessons || []);
  };

  // Hàm xử lý khi chọn bài học
  const handleLessonChange = (value) => {
    setSelectedLesson(value);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.data.metadata);
          setSelectedCourseLessons(res.data.metadata[0]?.lessons || []);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    dispatch(viewQuiz({ courseIds: selectedCourse }))
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

  const handleViewQuiz = () => {
    setIsLoading(true);
    dispatch(viewQuiz({ courseIds: selectedCourse }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
          setUpdateQuiz(updateQuiz + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Tên bài tập",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Loại hình thức",
      dataIndex: "type",
      onFilter: (value, record) => record.type.indexOf(value) === 0,
      sorter: (a, b) => a.type.localeCompare(b.type),
      sortDirections: ["descend"],
    },
    {
      title: "Chi tiết câu hỏi",
      dataIndex: "questions",
      onFilter: (value, record) => record.questions.indexOf(value) === 0,
      sorter: (a, b) => a.questions.length - b.questions.length,
      sortDirections: ["descend"],
    },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];

  let data = [];
  quiz?.forEach((i, index) => {
    data.push({
      key: index + 1,
      name: i?.name,
      type: i?.type,
      questions: (
        <Button
          className="me-3"
          style={{ width: "100%" }}
          lessonId={selectedLesson}
          onClick={() =>
            router.push(`/admin/quiz/view-list-question/${i?._id}`)
          }
        >
          Xem chi tiết
        </Button>
      ),
      action: (
        <div>
          <UpdateQuiz
            courseIds={selectedCourse}
            quizId={i?._id}
            refresh={() => setUpdateQuiz(updateQuiz + 1)}
          />
          <Popconfirm
            title="Xóa bài tập"
            description="Bạn có muốn xóa bài tập?"
            okText="Yes"
            cancelText="No"
            okButtonProps={{
              style: { backgroundColor: "red" },
            }}
            onConfirm={() =>
              handleDeleteQuiz({
                quizId: i?._id,
              })
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
        </div>
      ),
    });
  });

  const handleDeleteQuiz = ({ quizId }) => {
    setIsLoading(true);

    dispatch(deleteQuiz({ quizId }))
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
        setIsLoading(false);
      });
  };

  return (
    <div className="">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <div className="pb-3">
            <div style={{ display: "flex", paddingBottom: "20px" }}>
              <Select
                placeholder="Select a course"
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

              <Select
                placeholder="Select a lesson"
                onChange={handleLessonChange}
                value={selectedLesson}
                className="me-3"
              >
                {selectedCourseLessons.map((lesson) => (
                  <Option key={lesson._id} value={lesson._id}>
                    {lesson.name}
                  </Option>
                ))}
              </Select>
            </div>
            <Button
              type="primary"
              onClick={handleViewQuiz}
              style={{ color: "#fff", backgroundColor: "#1890ff" }}
            >
              Xem
            </Button>
          </div>
          <h3>Table Quiz</h3>
          <Table
            columns={columns}
            dataSource={data}
            pagination={{ pageSize: 5 }}
          />
        </React.Fragment>
      )}
    </div>
  );
}
