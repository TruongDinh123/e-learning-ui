"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Drawer,
  List,
  Modal,
  Select,
  Spin,
  Table,
  message,
} from "antd";
import { useDispatch } from "react-redux";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const ScoreManagement = () => {
  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const { Option } = Select;

  const [isDrawerOpen, setIsDrawerOpen] = useState(
    Array(score.length).fill(false)
  );

  const showDrawer = (index) => {
    const updatedIsDrawerOpen = [...isDrawerOpen];
    updatedIsDrawerOpen[index] = true;
    setIsDrawerOpen(updatedIsDrawerOpen);
  };

  const onClose = (index) => {
    const updatedIsDrawerOpen = [...isDrawerOpen];
    updatedIsDrawerOpen[index] = false;
    setIsDrawerOpen(updatedIsDrawerOpen);
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
        console.log("🚀 ~ res:", res);
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
    const QuestionItem = ({ question, idxQuestion, answer }) => (
      <List.Item>
        <div className="p-3">
          <h3 className="font-bold">{`Question ${idxQuestion + 1}`}</h3>
          <h3 className="font-semibold py-3">
            {idxQuestion + 1}.{question.question}
          </h3>
          {question.options.map((option, idxOption) => (
            <p key={idxOption}>
              {idxOption + 1}: {option}
            </p>
          ))}
          <p className="pt-3 text-green-500 font-bold">
            <span style={{ color: "red" }}>Your answer: {answer}</span>
          </p>
        </div>
      </List.Item>
    );

    const EssayAnswer = ({ essayAnswer, filename }) => (
      <div className="p-3">
        <h3 className="font-bold">Câu trả lời của bạn</h3>
        <div dangerouslySetInnerHTML={{ __html: essayAnswer }} />
        <div>
          <h3 className="text-lg font-bold mb-2">File đã nộp:</h3>
          <a
            href={filename}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 underline hover:text-blue-700"
          >
            Download File
          </a>
        </div>
      </div>
    );

    if (
      filter === "all" ||
      (filter === "quiz" && i.quiz) ||
      (filter === "assignment" && i.assignment)
    ) {
      data.push({
        key: index + 1,
        name: i?.quiz?.name ? i.quiz?.name : i.assignment?.name,
        score: i?.score,
        action: (
          <React.Fragment>
            <Button
              type="primary"
              onClick={() => showDrawer(index)}
              style={{ color: "#fff", backgroundColor: "#1890ff" }}
              className="me-3"
              key={index}
            >
              Details
            </Button>
            <Drawer
              title="Details Score"
              open={isDrawerOpen[index]}
              onClose={() => onClose(index)}
              width={720}
            >
              <Collapse accordion>
                {i?.quiz?.type === "multiple_choice" && (
                  <List
                    dataSource={i?.quiz?.questions || i?.assignment?.questions}
                    renderItem={(question, idxQuestion) => {
                      const answerObj = i?.answers.find(
                        (answer) => Object.keys(answer)[0] === question._id
                      );
                      const answer = answerObj
                        ? Object.values(answerObj)[0]
                        : "";
                      return (
                        <List.Item>
                          <div className="p-3">
                            <h3 className="font-bold">{`Question ${
                              idxQuestion + 1
                            }`}</h3>
                            <h3 className="font-semibold py-3">
                              {idxQuestion + 1}.{question.question}
                            </h3>
                            {question.options.map((option, idxOption) => (
                              <p key={idxOption}>
                                {idxOption + 1}: {option}
                              </p>
                            ))}
                            <p className="pt-3 text-green-500 font-bold">
                              <span style={{ color: "red" }}>Your answer:</span>{" "}
                              {answer}
                            </p>
                          </div>
                        </List.Item>
                      );
                    }}
                    style={{ maxHeight: "400px", overflow: "auto" }}
                  />
                )}
                {i?.quiz?.type === "essay" && (
                  <EssayAnswer
                    essayAnswer={i?.essayAnswer}
                    filename={i?.filename}
                  />
                )}
              </Collapse>
            </Drawer>
          </React.Fragment>
        ),
      });
    }
  });

  return (
    <div className="p-5">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
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
        </React.Fragment>
      )}
    </div>
  );
};

export default ScoreManagement;
