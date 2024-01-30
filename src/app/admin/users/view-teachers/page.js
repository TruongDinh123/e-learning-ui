"use client";
import {
  getACourse,
  removeStudentFromCourse,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Empty, Modal, Popconfirm, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../view-teachers/page.css";
import UpdateTeacherToCourse from "../../courses/update-teacher-course/page";
import AddTeacherToCourse from "../../courses/add-teacher-course/page";

const { Option } = Select;

export default function ViewTeachersCourse() {
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
  const [showTable, setShowTable] = useState(false);

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    setSelectedCourseDetails(null); // Reset giá trị của selectedCourseDetails
  };

  const handleDeleteStudent = ({ courseId, userId }) => {
    dispatch(removeStudentFromCourse({ courseId, userId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdate(update + 1);
          getACourseData(selectedCourse);
        }
      });
  };

  useEffect(() => {
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 1.5,
            })
            .then(() => {
              setCourses(res.metadata);
            });
        }
      });
  }, []);

  // useEffect(() => {
  //   getACourseData();
  // }, [update]);

  // Định nghĩa một hàm mới để tái sử dụng cho việc cập nhật dữ liệu
  const refreshCourseData = () => {
    setUpdate(update + 1);
    getACourseData(selectedCourse);
  };

  const handleViewCourse = () => {
    if (selectedCourse) {
      getACourseData(selectedCourse);
      setShowTable(true);
    } else {
      messageApi.open({
        type: "error",
        content: "Vui lòng chọn khóa học trước khi xem.",
        duration: 2.5,
      });
    }
  };

  const getACourseData = () => {
    return dispatch(getACourse(selectedCourse))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "Thành công",
              content: "Đang thực hiện...",
              duration: 1.5,
            })
            .then(() => {
              setData(res?.metadata?.students);
              setTeacher(res?.metadata?.teacher);
              setSelectedCourseDetails(res?.metadata);
            });
        }
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
      title: "Chức năng",
      dataIndex: "action",
    },
  ];

  let data = [];
  dataStudent?.forEach((student, index) => {
    const userId = student?._id;
    const studentScores = scores[userId];
    const isStudentModalOpen = isModalOpen[userId];

    data.push({
      key: index + 1,
      lastName: student?.lastName,
      email: student?.email,
      action: (
        <React.Fragment>
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
                userId: userId,
              })
            }
          >
            <Button danger>Xóa</Button>
          </Popconfirm>
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
      <div className="py-3">
        <Select
          placeholder="Chọn khóa học"
          onChange={handleCourseChange}
          value={selectedCourse}
          className="me-3 w-full sm:w-64 mb-3 md:mb-0"
          optionLabelProp="label"
        >
          {courses.map((course) => (
            <Option key={course._id} value={course._id} label={course.name}>
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
      </div>
      {showTable ? (
        teacher ? (
          <div className="border p-4 rounded-md my-4 d-flex align-items-center justify-content-between">
            <div>
              <h2 className="font-bold text-lg">
                Giáo viên: {teacher?.lastName}
              </h2>
              <p className="text-sm">Email: {teacher?.email}</p>
            </div>
            <UpdateTeacherToCourse
              courseId={selectedCourse}
              refresh={refreshCourseData}
            />
          </div>
        ) : (
          <div className="border p-4 rounded-md my-4 flex flex-col items-center justify-center space-y-4">
            <AddTeacherToCourse
              courseId={selectedCourse}
              refresh={refreshCourseData}
            >
              Thêm giáo viên
            </AddTeacherToCourse>
          </div>
        )
      ) : (
        <div className="border p-4 rounded-md my-4 flex flex-col items-center justify-center space-y-4">
          <p className="text-lg font-bold text-[#002c6a]">
            Hãy chọn khoá học bạn muốn xem thông tin
          </p>
        </div>
      )}
      {showTable && (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{ pageSize: 5, position: ["bottomLeft"] }}
          className="grid-container"
        />
      )}
    </React.Fragment>
  );
}
