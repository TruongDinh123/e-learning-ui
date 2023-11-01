"use client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Modal, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const ScoreManagement = () => {
  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(
    Array(score.length).fill(false)
  );

  const showModal = (index) => {
    const updatedIsModalOpen = [...isModalOpen];
    updatedIsModalOpen[index] = true;
    setIsModalOpen(updatedIsModalOpen);
  };

  const handleCancel = (index) => {
    const updatedIsModalOpen = [...isModalOpen];
    updatedIsModalOpen[index] = false;
    setIsModalOpen(updatedIsModalOpen);
  };

  const handleOk = (index) => {
    const updatedIsModalOpen = [...isModalOpen];
    updatedIsModalOpen[index] = false;
    setIsModalOpen(updatedIsModalOpen);
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Quiz Name",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
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
      title: "Action",
      dataIndex: "action",
    },
  ];
  //viewCourses api
  useEffect(() => {
    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        console.log("🚀 ~ res:", res);
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
              duration: 1.5,
            })
            .then(() => setScore(res.metadata));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  //table data
  let data = [];
  score.forEach((i, index) => {
    data.push({
      key: index + 1,
      name: i?.quiz.name,
      score: i?.score,
      action: (
        <>
          {contextHolder}
          <Button
            type="primary"
            onClick={() => showModal(index)}
            className="me-3"
            key={index}
          >
            Details
          </Button>
          <Modal
            key={index}
            title="Details Score"
            open={isModalOpen[index]}
            onCancel={() => handleCancel(index)}
            onOk={() => handleOk(index)}
          >
            <Collapse accordion>
              {i?.quiz.questions.map((question, idxQuestion) => {
                const answerObj = i?.answers.find(
                  (answer) => Object.keys(answer)[0] === question._id
                );
                const answer = answerObj ? Object.values(answerObj)[0] : "";
                return (
                  <Collapse.Panel
                    header={`Question ${idxQuestion + 1}`}
                    key={idxQuestion}
                  >
                    <p>{question.question}</p>
                    {question.options.map((option, idxOption) => (
                      <p key={idxOption}>{idxOption + 1}: {option}</p>
                    ))}
                    <p><span style={{ color: 'red' }}>Your answer:</span> {answer}</p>
                  </Collapse.Panel>
                );
              })}
            </Collapse>
          </Modal>
        </>
      ),
    });
  });

  return (
    <div className="p-5">
      {contextHolder}
      <Table columns={columns} dataSource={data} />
    </div>
  );
};

export default ScoreManagement;
