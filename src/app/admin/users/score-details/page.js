"use client";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Modal, Table, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getScoreByUserId } from "@/features/Quiz/quizSlice";

export default function ViewScoreDetail(props) {
  const { quizId, userId, refresh } = props;
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [studentScores, setStudentScores] = useState([]);
  const [loadScores, setLoadScores] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

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
  useEffect(() => {
    getACourseData().then(() => setLoadScores(true));
  }, []);

  useEffect(() => {
    if (!loadScores) return;
    const scoresPromises = dataStudent?.map((student) =>
      dispatch(getScoreByUserId({ userId: student?._id }))
        .then(unwrapResult)
        .then((result) => {
          return result.metadata;
        })
    );
    Promise.all(scoresPromises).then((scores) => {
      const flattenedScores = scores.flat();
      setStudentScores(flattenedScores);
      setLoadScores(false);
    });
  }, [loadScores, dataStudent, dispatch]);

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
        console.log(error);
      });
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
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
    <>
      {contextHolder}
      <Button type="primary" onClick={showModal} className="me-3">
        View Score
      </Button>
      <Modal
        title=""
        open={isModalOpen}
        onCancel={handleCancel}
        onOk={handleOk}
        
      >
        <Table columns={columns} dataSource={data} />
      </Modal>
    </>
  );
}
