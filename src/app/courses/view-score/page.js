"use client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Modal, Select, Spin, Table, message } from "antd";
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
  const [filter, setFilter] = useState("all");

  const { Option } = Select;

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

  const handleFilterChange = (value) => {
    setFilter(value);
  };

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
    if (
      filter === "all" ||
      (filter === "quiz" && i.quiz) ||
      (filter === "assignment" && i.assignment)
    ) {
      data.push({
        key: index + 1,
        name: i?.quiz?.name ? i.quiz.name : i.assignment.name,
        score: i?.score,
        action: (
          <>
            <Button
              type="primary"
              onClick={() => showModal(index)}
              style={{ color: "#fff", backgroundColor: "#1890ff" }}
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
            >
              <Collapse accordion>
                {(i?.quiz?.questions || i?.assignment?.questions).map(
                  (question, idxQuestion) => {
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
                  }
                )}
              </Collapse>
            </Modal>
          </>
        ),
      });
    }
  });

  return (
    <div className="p-5">
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <h1>My Scoce</h1>
          <Select
            defaultValue="all"
            style={{ width: 120 }}
            onChange={handleFilterChange}
          >
            <Option value="all">All</Option>
            <Option value="quiz">Quiz</Option>
            <Option value="assignment">Assignment</Option>
          </Select>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </div>
  );
};

export default ScoreManagement;
