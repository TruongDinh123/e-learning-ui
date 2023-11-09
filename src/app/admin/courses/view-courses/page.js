"use client";
import { deleteCourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Table, message, Space, Menu, Dropdown, Spin } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import EditCourses from "../edit-course/Page";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

export default function Courses() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [updateCourse, setUpdateCourse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

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
    setIsLoading(true);
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourse(res.data.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [updateCourse]);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

  //table data
  let data = [];
  course.forEach((i, index) => {
    const menu = (
      <Menu>
        <Menu.Item>
          <EditCourses
            id={i?._id}
            refresh={() => setUpdateCourse(updateCourse + 1)}
          />
        </Menu.Item>
        <Menu.Item>
          <Button
            className="me-3"
            style={{ width: "100%" }}
            courseId={i?._id}
            onClick={() => router.push(`/admin/courses/Lesson/${i?._id}`)}
          >
            View details
          </Button>
        </Menu.Item>
        <Menu.Item>
          <Popconfirm
            title="Delete the Course"
            description="Are you sure to delete this Course?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => handleDeleteCourse(i?._id)}
          >
            <Button danger style={{ width: "100%" }}>
              Delete
            </Button>
          </Popconfirm>
        </Menu.Item>
      </Menu>
    );

    data.push({
      key: index + 1,
      title: i?.title,
      name: i?.name,
      action: isMobile ? (
        <Dropdown overlay={menu}>
          <Button
            className="ant-dropdown-link text-center justify-self-center"
            onClick={(e) => e.preventDefault()}
          >
            Actions
          </Button>
        </Dropdown>
      ) : (
        <Space size="middle">
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
        </Space>
      ),
    });
  });

  //handleDeleteCourse
  const handleDeleteCourse = (id) => {
    setIsLoading(true);
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateCourse(updateCourse + 1);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <h1>View Course</h1>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </>
  );
}
