"use client";
import {
  getACourse,
  removeStudentFromCourse,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Empty, Popconfirm, Select, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import "../view-teachers/page.css";
import UpdateTeacherToCourse from "../../courses/update-teacher-course/page";
import AddTeacherToCourse from "../../courses/add-teacher-course/page";
import useCoursesData from "@/hooks/useCoursesData";
import AddStudentToCourse from "../../courses/add-student-course/page";

const { Option } = Select;

export default function ViewTeachersCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [update, setUpdate] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [showTable, setShowTable] = useState(false);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
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

  const courseState = useCoursesData();

  useEffect(() => {
    if (courseState.length === 0) {
      dispatch(viewCourses())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setCourses(res.metadata);
          }
        });
    } else {
      setCourses(courseState.metadata);
    }
  }, [update]);

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
          setData(res?.metadata?.students);
          setTeacher(res?.metadata?.teacher);
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
        </React.Fragment>
      ),
    });
  });

  return (
    <div className="p-3">
      {contextHolder}
      <h1 className="text-lg font-bold text-[#002c6a]">Quản lý khóa học</h1>
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
        {showTable && (
          <AddStudentToCourse
            courseId={selectedCourse}
            refresh={() => {
              setUpdate(update + 1); // Đánh dấu cần cập nhật
              getACourseData(selectedCourse); // Tải lại dữ liệu cho khóa học hiện tại
            }}
          >
            Thêm học viên
          </AddStudentToCourse>
        )}
      </div>

      {showTable ? (
        teacher ? (
          <div className="border p-4 rounded-md mb-4 d-flex align-items-center justify-content-between">
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
        <div className="flex justify-center items-center h-[45vh]">
          <Empty
            className="text-center text-lg font-bold text-[#002c6a]"
            description="
                Hãy chọn khoá học bạn muốn xem thông tin.
              "
          />
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
    </div>
  );
}