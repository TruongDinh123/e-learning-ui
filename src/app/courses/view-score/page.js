"use client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Modal, Spin, Table, message } from "antd";
import { useDispatch } from "react-redux";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const ScoreManagement = () => {
  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(
    Array(score.length).fill(false)
  );
  const [isLoading, setIsLoading] = useState(false);

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
  //viewScore api
  useEffect(() => {
    setIsLoading(true);

    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
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
                      <p key={idxOption}>
                        {idxOption + 1}: {option}
                      </p>
                    ))}
                    <p>
                      <span style={{ color: "red" }}>Your answer:</span>{" "}
                      {answer}
                    </p>
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
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <h1>My Scoce</h1>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </div>
  );
};

export default ScoreManagement;
