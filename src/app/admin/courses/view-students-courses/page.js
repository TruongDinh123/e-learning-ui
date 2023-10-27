"use client";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import AddStudentToCourse from "../add-student-course/page";

export default function ViewStudentsCourse(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [dataStudent, setData] = useState([]);
  const [update, setUpdate] = useState(0);

  useEffect(() => {
    getACourseData();
  }, [update]);

  const getACourseData = () => {
    dispatch(getACourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata.students);
          refresh();
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
    formik.handleSubmit();
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

  let data = [];
  dataStudent.forEach((i, index) => {
    data.push({
      key: index + 1,
      lastName: i?.lastName,
      email: i?.email,
    });
  });

  return (
    <>
      {contextHolder}
      {/* <Button type="primary" onClick={showModal} className="me-3">
        Students
      </Button>
      <Modal
        title="Danh sách học viên"
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
      > */}
      <AddStudentToCourse
        courseId={id}
        refresh={() => setUpdate(update + 1)}
      >
        Invite Student
      </AddStudentToCourse>
      <Table columns={columns} dataSource={data} />
      {/* </Modal> */}
    </>
  );
}
