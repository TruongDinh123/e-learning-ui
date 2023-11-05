"use client";
import { deleteCourse, getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import { deleteLesson, viewLesson } from "@/features/Lesson/lessonSlice";
import CreateLesson from "../create-lesson/page";
import { useRouter } from "next/navigation";
import ViewStudentsCourse from "../../view-students-courses/page";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateLesson, setUpdateLesson] = useState(0);
  const [dataCourse, setData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    getACourseData();
  }, []);

  const getACourseData = () => {
    dispatch(getACourse(params.id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata);
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
      title: "Name Course",
      dataIndex: "nameCourse",
      onFilter: (value, record) => record.nameCourse.indexOf(value) === 0,
      sorter: (a, b) => a.nameCourse.length - b.nameCourse.length,
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
      title: "Content",
      dataIndex: "content",
      onFilter: (value, record) => record.content.indexOf(value) === 0,
      sorter: (a, b) => a.content.length - b.content.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  //viewLesson api
  useEffect(() => {
    dispatch(viewLesson({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setLesson(res.data.metadata))
            .then(() => message.success(res.message, 1.5));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateLesson, dispatch, messageApi]);

  //table data
  let data = [];
  lesson?.forEach((i, index) => {
    i.lessons.forEach((item, subIndex) => {
      data.push({
        key: `${index + 1}.${subIndex + 1}`,
        nameCourse: i?.name,
        name: item?.name,
        content: item?.content,
        action: (
          <>
            <Button
              className="me-3"
              courseId={i?._id}
              onClick={() =>
                router.push(
                  `/admin/courses/Lesson/view-lesson-video/${item?._id}`
                )
              }
            >
              View Video
            </Button>
            <Popconfirm
              title="Delete the Course"
              description="Are you sure to delete this Course?"
              okText="Yes"
              cancelText="No"
              onConfirm={() =>
                handleDeleteLesson({ courseId: i?._id, lessonId: item?._id })
              }
            >
              <Button danger>Delete</Button>
            </Popconfirm>
          </>
        ),
      });
    });
  });

  //handleDeleteLesson
  const handleDeleteLesson = ({ courseId, lessonId }) => {
    dispatch(deleteLesson({ courseId, lessonId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 2.5,
            })
            .then(() => setUpdateLesson(updateLesson + 1))
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
      <h1>Table Lessons</h1>
      <div className="p-3">
        {lesson?.map((i, index) => (
          <CreateLesson
            key={index}
            courseId={i?._id}
            refresh={() => setUpdateLesson(updateLesson + 1)}
          />
        ))}
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
  );
}
