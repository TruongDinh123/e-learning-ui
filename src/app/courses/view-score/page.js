"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Collapse,
  Drawer,
  List,
  Select,
  Spin,
  Table,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";

const ScoreManagement = () => {
  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  console.log('score', score);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("tất cả");
  const { Option } = Select;

  const userState = useSelector((state) => state?.user?.user);
  console.log('userState', userState);

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

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Khóa học",
      dataIndex: "courseName",
    },
    {
      title: "Tên bài tập",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Điểm",
      dataIndex: "score",
      onFilter: (value, record) => record.score.indexOf(value) === 0,
      sorter: (a, b) => a.score.length - b.score.length,
      sortDirections: ["descend"],
    },
    {
      title: "Chức năng",
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
        setIsLoading(false);
      });
  }, []);

  //table data
  let data = [];
  score.forEach((i, index) => {
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
            Tải xuống tệp
          </a>
        </div>
      </div>
    );

    const courseName = userState?.courses?.find(course => i.quiz.courseIds.includes(course._id))?.name;

    if (
      filter === "tất cả" || courseName === filter
    ) {
      data.push({
        key: index + 1,
        name: i?.quiz?.name ? i.quiz?.name : i.assignment?.name,
        score: i?.score,
        courseName: courseName,
        action: (
          <React.Fragment>
            <Button
              type="primary"
              onClick={() => showDrawer(index)}
              style={{ color: "#fff", backgroundColor: "#1890ff" }}
              className="me-3"
              key={index}
            >
              Chi tiết
            </Button>
            <Drawer
              title="Details Score"
              open={isDrawerOpen[index]}
              onClose={() => onClose(index)}
              width={1000}
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
                            {/* <h3 className="font-bold">{`Câu ${
                              idxQuestion + 1
                            }`}</h3> */}
                            <h3 className="font-semibold py-3">
                              {question.question}
                            </h3>
                            {question.options.map((option, idxOption) => (
                              <p key={idxOption}>
                                {idxOption + 1}: {option}
                              </p>
                            ))}
                            <p className="pt-3 text-green-500 font-bold">
                              <span style={{ color: "red" }}>
                                Câu trả lời của bạn:
                              </span>{" "}
                              {answer}
                            </p>
                          </div>
                        </List.Item>
                      );
                    }}
                    style={{ maxHeight: "85vh", overflow: "auto" }}
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
        <div className="pb-28">
          <Select
            defaultValue="tất cả"
            style={{ width: 120 }}
            onChange={handleFilterChange}
          >
            <Option value="tất cả">Tất cả</Option>
            {userState?.courses.map((course) => (
              <Option key={course._id} value={course.name}>{course.name}</Option>
            ))}
          </Select>
          <Table columns={columns} dataSource={data} className="pb-56" />
        </div>
      )}
    </div>
  );
};

export default ScoreManagement;
