"use client";
import { getACourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Select, Table, message } from "antd";
import { useEffect, useState } from "react";
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

  const showModal = (studentId) => {
    const lessons = selectedCourseDetails?.lessons;

    return Promise.all(
      lessons.map((lesson) => {
        const quizId = lesson.quiz;

        return dispatch(getScoreByUserId({ userId: studentId, quizId }))
          .then(unwrapResult)
          .then((result) => {
            return {
              lesson,
              score: result.metadata,
              userId: studentId,
            };
          });
      })
    ).then((lessonScores) => {
      setScores((prevScores) => ({
        ...prevScores,
        [studentId]: lessonScores,
      }));
      setIsModalOpen((prevIsModalOpen) => ({
        ...prevIsModalOpen,
        [studentId]: true,
      }));
    });
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
      onFilter: (value, record) => record.lastName.indexOf(value) === 0,
      sorter: (a, b) => a.lastName.length - b.lastName.length,
      sortDirections: ["descend"],
    },
    {
      title: "Email",
      dataIndex: "email",
      onFilter: (value, record) => record.email.indexOf(value) === 0,
      sorter: (a, b) => a.email.length - b.email.length,
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
        <>
          <Button
            type="primary"
            onClick={() => showModal(userId)}
            className="me-3"
          >
            View Score
          </Button>
          <Modal
            title=""
            open={isStudentModalOpen}
            onOk={handleOk}
            footer={[
              <>
                <Button key="back" onClick={handleOk}>
                  OK
                </Button>
              </>,
            ]}
          >
            {studentScores?.map((score, index) => {
              const course = courses.find(
                (course) => course._id === score.lesson.courseId
              );

              // Kiểm tra xem đã hiển thị tên khóa học hay chưa
              if (course && course.name !== displayedCourseName) {
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
            })}
          </Modal>
        </>
      ),
    });
  });

  return (
    <>
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
        <Button type="primary" onClick={handleViewCourse} className="me-3">
          View
        </Button>
      </div>
      <AddStudentToCourse
        courseId={selectedCourse}
        refresh={() => setUpdate(update + 1)}
      >
        Invite Student
      </AddStudentToCourse>
      <Table columns={columns} dataSource={data} className="pt-3" />
    </>
  );
}
