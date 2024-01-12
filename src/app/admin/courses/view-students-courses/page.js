"use client";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import AddStudentToCourse from "../add-student-course/page";
import { getScoreByUserId } from "@/features/Quiz/quizSlice";
import React from "react";

export default function ViewStudentsCourse(props) {
  const { id, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [update, setUpdate] = useState(0);
  const [studentScores, setStudentScores] = useState([]);
  const [loadScores, setLoadScores] = useState(false);

  useEffect(() => {
    getACourseData().then(() => setLoadScores(true));
  }, [update]);

  useEffect(() => {
    if (!loadScores) return;
    const scoresPromises = dataStudent?.map((student) =>
      dispatch(getScoreByUserId({ userId: student?._id }))
        .then(unwrapResult)
        .then((result) => result.metadata)
    );
    Promise.all(scoresPromises).then((scores) => {
      const flattenedScores = scores.flat();
      setStudentScores(flattenedScores);
      setLoadScores(false);
    });
  }, [loadScores, dataStudent, dispatch,update]);

  console.log("studentScores::", studentScores);
  const getACourseData = () => {
    return dispatch(getACourse(id))
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
      title: "Score",
      dataIndex: "score",
      onFilter: (value, record) => record.score.indexOf(value) === 0,
      sorter: (a, b) => a.score.length - b.score.length,
      sortDirections: ["descend"],
    },
    {
      title: "Quiz",
      dataIndex: "quizName",
      onFilter: (value, record) => record.quizName.indexOf(value) === 0,
      sorter: (a, b) => a.quizName.length - b.quizName.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  let data = [];
  dataStudent.forEach((student, index) => {
    const studentScoresForUser = studentScores?.filter(
      (score) => score.user === student._id
    );
    if (studentScoresForUser?.length > 0) {
      studentScoresForUser.forEach((score, scoreIndex) => {
        data.push({
          key: `${index}-${scoreIndex}`,
          lastName: student?.lastName,
          email: student?.email,
          quizName: score?.quiz.name,
          score: score?.score,
        });
      });
    } else {
      data.push({
        key: index,
        lastName: student?.lastName,
        email: student?.email,
        quizName: "NA",
        score: "NA",
      });
    }
  });

  return (
    <React.Fragment>
      {contextHolder}
      <AddStudentToCourse courseId={id} refresh={() => setUpdate(update + 1)}>
        Invite Student
      </AddStudentToCourse>
      <Table columns={columns} dataSource={data} />
    </React.Fragment>
  );
}
