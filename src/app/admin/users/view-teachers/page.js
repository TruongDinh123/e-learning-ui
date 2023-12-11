"use client";
import { getACourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddStudentToCourse from "../../courses/add-student-course/page";
import { getScoreByUserId } from "@/features/Quiz/quizSlice";
import AddTeacherToCourse from "../../courses/add-teacher-course/page";

const { Option } = Select;

export default function ViewStudentsCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [teacher, setTeacher] = useState(null);
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
          setTeacher(res.metadata.teacher);
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
      title: "Tên",
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
      title: "Vai trò",
      dataIndex: "roles",
      key: "roles",
      sorter: (a, b) => a.roles.join(',').localeCompare(b.roles.join(',')),
      sortDirections: ["descend"],
    },
    {
      title: "Chức năng",
      dataIndex: "action",
    },
  ];

  let data = [];
  if (teacher) {
    data.push({
      key: "Giáo viên",
      lastName: teacher?.lastName,
      email: teacher?.email,
      roles: teacher?.roles,
    });
  }
  dataStudent.forEach((student, index) => {
    const userId = student?._id;
    const studentScores = scores[userId];
    const isStudentModalOpen = isModalOpen[userId];

    data.push({
      key: index + 1,
      lastName: student?.lastName,
      email: student?.email,
      roles: student?.roles,
      action: (
        <React.Fragment>
          <Button
            type="primary"
            onClick={() => showModal(userId)}
            className="me-3"
            style={{ color: "#fff", backgroundColor: "#1890ff" }}
          >
            Xem điểm
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
          Xem
        </Button>
      </div>

      <AddTeacherToCourse
        courseId={selectedCourse}
        refresh={() => setUpdate(update + 1)}
      >
        Thêm giáo viên
      </AddTeacherToCourse>
      <Table
        columns={columns}
        dataSource={data}
        pagination={{ pageSize: 5 }}
        className="pt-3"
      />
    </React.Fragment>
  );
}