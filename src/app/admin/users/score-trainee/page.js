"use client";
import { getACourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddStudentToCourse from "../../courses/add-student-course/page";
import { getScoreByUserId } from "@/features/Quiz/quizSlice";

const { Option } = Select;

export default function ViewStudentsCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
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
              setCourses(res.data.metadata);
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

  const getACourseData = () => {
    return dispatch(getACourse(selectedCourse))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata.students);
          setSelectedCourseDetails(res.metadata);
          refresh();
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name",
      dataIndex: "lastName",
      key: "lastName",
      sorter: (a, b) => a.lastName.localeCompare(b.lastName),
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      sorter: (a, b) => a.email.localeCompare(b.email),
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  let displayedCourseName = ""; // Biến để lưu trữ tên khóa học đã hiển thị

  let data = [];
  dataStudent.forEach((student, index) => {
    const userId = student?._id;
    const studentScores = scores[userId];
    const isStudentModalOpen = isModalOpen[userId];

    data.push({
      key: index,
      lastName: student?.lastName,
      email: student?.email,
      action: (
        <React.Fragment>
          <Button
            type="primary"
            onClick={() => showModal(userId)}
            className="me-3"
            style={{ color: "#fff", backgroundColor: "#1890ff" }}
          >
            View Score
          </Button>
          <Modal
            title=""
            open={isStudentModalOpen}
            onOk={handleOk}
            footer={[
              <Button key="back" onClick={handleOk}>
                OK
              </Button>,
            ]}
          >
            {/* {studentScores?.map((score, index) => {
              const course = courses.find(
                (course) => course._id === score.lesson.courseId
              );

              // Kiểm tra xem đã hiển thị tên khóa học hay chưa
              if (course && course?.name !== displayedCourseName) {
                displayedCourseName = course.name; // Lưu trữ tên khóa học đã hiển thị
                return (
                  <div key={index}>
                    <p>Course Name: {course.name}</p>
                    {score?.score.map((studentScore, studentIndex) => (
                      <div key={studentIndex}>
                        <p>Lesson Name: {score?.lesson.name}</p>
                        <p>Score: {studentScore?.score}</p>
                      </div>
                    ))}
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    {score?.score.map((studentScore, studentIndex) => (
                      <div key={studentIndex}>
                        <p>Lesson Name: {score?.lesson.name}</p>
                        <p>Score: {studentScore?.score}</p>
                      </div>
                    ))}
                  </div>
                );
              }
            })} */}

            {/* {studentScores?.map((score, index) => {
              const course = courses.find(
                (course) => course._id === score.lesson.courseId
              );

              const dataSource = score?.score.map(
                (studentScore, studentIndex) => ({
                  key: studentIndex,
                  lessonName: score?.lesson.name,
                  score: studentScore?.score,
                })
              );

              const columns = [
                {
                  title: "Lesson Name",
                  dataIndex: "lessonName",
                  key: "lessonName",
                },
                {
                  title: "Score",
                  dataIndex: "score",
                  key: "score",
                },
              ];

              if (course && course.name !== displayedCourseName) {
                displayedCourseName = course.name; // Lưu trữ tên khóa học đã hiển thị
                return (
                  <div key={index}>
                    <p>Course Name: {course.name}</p>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                  </div>
                );
              } else {
                return (
                  <div key={index}>
                    <Table dataSource={dataSource} columns={columns} pagination={false} />
                  </div>
                );
              }
            })} */}

            {(() => {
              let displayedCourseName = ""; // Biến để lưu trữ tên khóa học đã hiển thị
              let dataSource = [];

              studentScores?.forEach((score, index) => {
                const course = courses.find(
                  (course) => course._id === score.lesson?.courseId
                );

                if (course && course.name !== displayedCourseName) {
                  displayedCourseName = course?.name; // Lưu trữ tên khóa học đã hiển thị
                  score?.score.forEach((studentScore, studentIndex) => {
                    dataSource.push({
                      key: `${index}-${studentIndex}`,
                      courseName: course?.name,
                      lessonName: score?.lesson.name,
                      score: studentScore?.score,
                    });
                  });
                } else {
                  score?.score.forEach((studentScore, studentIndex) => {
                    dataSource.push({
                      key: `${index}-${studentIndex}`,
                      lessonName: score?.lesson.name,
                      score: studentScore?.score,
                    });
                  });
                }
              });

              const columns = [
                {
                  title: "Course Name",
                  dataIndex: "courseName",
                  key: "courseName",
                },
                {
                  title: "Lesson Name",
                  dataIndex: "lessonName",
                  key: "lessonName",
                },
                {
                  title: "Score",
                  dataIndex: "score",
                  key: "score",
                },
              ];

              return (
                <Table
                  dataSource={dataSource}
                  columns={columns}
                  pagination={false}
                />
              );
            })()}
          </Modal>
        </React.Fragment>
      ),
    });
  });

  return (
    <React.Fragment>
      {contextHolder}
      <div className="pb-3">
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
        <Button
          type="primary"
          onClick={handleViewCourse}
          className="me-3"
          style={{ color: "#fff", backgroundColor: "#1890ff" }}
        >
          View
        </Button>
      </div>
      <AddStudentToCourse
        courseId={selectedCourse}
        refresh={() => setUpdate(update + 1)}
      >
        Invite Student
      </AddStudentToCourse>
      <Table columns={columns} dataSource={data} pagination={{ pageSize: 5 }} className="pt-3" />
    </React.Fragment>
  );
}
