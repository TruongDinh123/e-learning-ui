"use client";
import {
  Button,
  Table,
  Popconfirm,
  Select,
  Spin,
  Menu,
  Dropdown,
  Space,
  Col,
  Empty,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { deleteQuiz, viewInfoQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import React from "react";
import { useRouter } from "next/navigation";
import UpdateQuiz from "../update-quiz/page";
import "../view-quiz/page.css";
import { useMediaQuery } from "react-responsive";
import { isAdmin, isMentor } from "@/middleware";

const { Option } = Select;

export default function ViewQuiz() {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedCourse, setSelectedCourse] = useState(() => {
    return localStorage?.getItem("selectedCourseId") || null;
  });

  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  const router = useRouter();

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
    localStorage.setItem("selectedCourseId", value);
  };

  const currentTeacherId = localStorage.getItem("x-client-id");
  const coursesFromStore = useSelector((state) => state.course.courses);

  useEffect(() => {
    let visibleCourses;
    if (coursesFromStore.length === 0) {
      setIsLoading(true);
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
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    } else {
      // Áp dụng lọc cũng cho dữ liệu từ store
      if (isAdmin()) {
        visibleCourses = coursesFromStore.metadata;
      } else {
        visibleCourses = coursesFromStore.metadata.filter(
          (course) => course.teacher === currentTeacherId
        );
      }
      setCourses(visibleCourses);
    }
  }, [updateQuiz, coursesFromStore, dispatch]);

  const handleViewQuiz = () => {
    setIsLoading(true);
    dispatch(viewInfoQuiz({ courseIds: selectedCourse }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res?.metadata);
          setUpdateQuiz(updateQuiz + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (selectedCourse) {
      handleViewQuiz();
    }
  }, [selectedCourse]);

  const handleDeleteQuiz = ({ quizId }) => {
    setIsLoading(true);

    dispatch(deleteQuiz({ quizId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          const updatedQuizzes = quiz.filter((q) => q._id !== quizId);
          setquiz(updatedQuizzes);
        }
        setIsLoading(false);
      })
      .catch((error) => {
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
    const menu = (
      <Menu>
        <Menu.Item>
          <UpdateQuiz
            courseIds={selectedCourse}
            quizId={i?._id}
            refresh={() => setUpdateQuiz(updateQuiz + 1)}
          />
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Xóa bài tập"
            description="Bạn có muốn xóa bài tập?"
            okText="Có"
            cancelText="Không"
            okButtonProps={{
              style: { backgroundColor: "red" },
            }}
            onConfirm={() =>
              handleDeleteQuiz({
                quizId: i?._id,
              })
            }
          >
            <Button danger style={{ width: "100%" }}>
              Xóa
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );
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
      action: isMobile ? (
        <Dropdown overlay={menu}>
          <Button
            className="ant-dropdown-link text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Chức năng
          </Button>
        </Dropdown>
      ) : (
        <Col lg="12">
          <Space
            size="large"
            direction="vertical"
            className="lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between"
          >
            <Space wrap>
              <UpdateQuiz
                courseIds={selectedCourse}
                quizId={i?._id}
                refresh={() => setUpdateQuiz(updateQuiz + 1)}
              />
              <Popconfirm
                title="Xóa bài tập"
                description="Bạn có muốn xóa bài tập?"
                okText="Có"
                cancelText="Không"
                okButtonProps={{
                  style: { backgroundColor: "red" },
                }}
                onConfirm={() =>
                  handleDeleteQuiz({
                    quizId: i?._id,
                  })
                }
              >
                <Button danger style={{ width: "100%" }}>
                  Xóa
                </Button>
              </Popconfirm>
            </Space>
          </Space>
        </Col>
      ),
    });
  });

  return (
    <div className="p-3">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <div
            style={{ display: "flex", paddingBottom: "10px" }}
            className="pt-6"
          >
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
            <div>
              <Button
                type="primary"
                className="custom-button"
                onClick={handleViewQuiz}
              >
                Xem
              </Button>
            </div>

          </div>
          {data.length > 0 ? (
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 5 }}
            />
          ) : (
            <div className="flex justify-center items-center h-[45vh]">
              <Empty
                className="text-center text-lg font-bold text-[#002c6a]"
                description="
                Hãy chọn khóa học bạn muốn xem bài tập.
              "
              />
            </div>
          )}
        </React.Fragment>
      )}
    </div>
  );
}
