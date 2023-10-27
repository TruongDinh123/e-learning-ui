"use client";
import { deleteCourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import EditCourses from "../edit-course/Page";
import { useRouter } from "next/navigation";
import ViewStudentsCourse from "../view-students-courses/page";
import AddStudentToCourse from "../add-student-course/page";

export default function Courses() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateCourse, setUpdateCourse] = useState(0);
  const router = useRouter();
  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Title",
      dataIndex: "title",
      onFilter: (value, record) => record.title.indexOf(value) === 0,
      sorter: (a, b) => a.title.length - b.title.length,
      sortDirections: ["descend"],
    },
    {
      title: "Name",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];
  //viewCourses api
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
            .then(() => setCourse(res.data.metadata));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateCourse]);

  //table data
  let data = [];
  course.forEach((i, index) => {
    data.push({
      key: index + 1,
      title: i?.title,
      name: i?.name,
      action: (
        <>
          <EditCourses
            id={i?._id}
            refresh={() => setUpdateCourse(updateCourse + 1)}
          />
          <Button
            className="me-3"
            courseId={i?._id}
            onClick={() => router.push(`/admin/courses/Lesson/${i?._id}`)}
          >
            View details
          </Button>
          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCourse(i?._id)}
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    });
  });

  //handleDeleteCourse
  const handleDeleteCourse = (id) => {
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setUpdateCourse(updateCourse + 1))
            .then(() => message.success(res.message, 2.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div>
      {contextHolder}
      <h1>hello courses</h1>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
