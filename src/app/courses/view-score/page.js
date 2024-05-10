"use client";
import React, { useEffect, useState } from "react";
import { Button, Collapse, Drawer, List, Select, Spin, Table } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { getStudentCourses } from "@/features/Courses/courseSlice";
import "react-quill/dist/quill.snow.css";
import { refreshAUser } from "@/features/User/userSlice";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const ScoreManagement = () => {
  const dispatch = useDispatch();
  const [score, setScore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [filter, setFilter] = useState("tất cả");
  const [cources, setCources] = useState([]);
  const { Option } = Select;

  const userState = useSelector((state) => state?.user?.user);

  const [isDrawerOpen, setIsDrawerOpen] = useState(
    Array(score?.length)?.fill(false)
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
      onFilter: (value, record) => record?.name?.indexOf(value) === 0,
      sorter: (a, b) => a?.name?.length - b?.name?.length,
      sortDirections: ["descend"],
    },
    {
      title: "Điểm",
      dataIndex: "score",
      onFilter: (value, record) => record?.score?.indexOf(value) === 0,
      sorter: (a, b) => a?.score?.length - b?.score?.length,
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
        if (res?.status) {
          setScore(res?.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
    Promise.all([dispatch(getStudentCourses()).then(unwrapResult)])
      .then(([studentScore]) => {
        setCources(studentScore?.metadata?.courses);
      })
      .catch((error) => {
        messageApi.error("Có lỗi xảy ra khi tải thông tin.");
      });
  }, []);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    dispatch(refreshAUser(currentTeacherId));
  }, [filter]);

  //table data
  let data = [];
  score?.forEach((i, index) => {
    // const EssayAnswer = ({ essayAnswer, filename }) => (
    //   <div className="p-3">
    //     <h3 className="font-bold">Câu trả lời của bạn</h3>
    //     <div dangerouslySetInnerHTML={{ __html: essayAnswer }} />
    //     <div>
    //       <h3 className="text-lg font-bold mb-2">File đã nộp:</h3>
    //       <a
    //         href={filename}
    //         target="_blank"
    //         rel="noopener noreferrer"
    //         className="text-blue-500 underline hover:text-blue-700"
    //       >
    //         Tải xuống tệp
    //       </a>
    //     </div>
    //   </div>
    // );

    const courseName =
      userState?.courses?.find((course) =>
        i?.quiz?.courseIds?.includes(course?._id)
      )?.name ||
      userState?.metadata?.account.courses?.find((course) =>
        i?.quiz?.courseIds?.includes(course?._id)
      )?.name;

    if ((filter === "tất cả") || courseName === filter) {
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
              title="Chi tiết bài làm"
              open={isDrawerOpen[index]}
              onClose={() => onClose(index)}
              width={1000}
            >
              <Collapse accordion>
                {i?.quiz?.type === "multiple_choice" && (
                  <List
                    dataSource={i?.quiz?.questions || i?.assignment?.questions}
                    renderItem={(question, idxQuestion) => {
                      const answerObj = i?.answers?.find(
                        (answer) => Object.keys(answer)[0] === question._id
                      );
                      const answer = answerObj
                        ? Object.values(answerObj)[0]
                        : "";

                      const studentAnswer = answerObj
                        ? Object.values(answerObj)[0]
                        : null;
                      return (
                        <List.Item>
                          <div className="p-3">
                            <h1 className="text-base">
                              Câu {idxQuestion + 1}:
                            </h1>
                            <h3
                              className="font-semibold py-3"
                              dangerouslySetInnerHTML={{
                                __html: question.question,
                              }}
                            />
                            {question.options.map((option, idxOption) => (
                              <p key={idxOption}>
                                {idxOption + 1}: {option}
                                {studentAnswer === option &&
                                  (studentAnswer === question.answer ? (
                                    <CheckCircleOutlined
                                      style={{ color: "green", marginLeft: 8 }}
                                    />
                                  ) : (
                                    <CloseCircleOutlined
                                      style={{ color: "red", marginLeft: 8 }}
                                    />
                                  ))}
                              </p>
                            ))}
                            {question?.image_url && (
                              <div className="mb-2">
                                <img
                                  src={question.image_url}
                                  alt={`Câu hỏi ${idxQuestion + 1}`}
                                  className="max-w-auto"
                                />
                              </div>
                            )}
                            <p className="pt-3 text-green-500 font-bold">
                              <span style={{ color: "red" }}>
                                Câu trả lời của bạn:
                              </span>{" "}
                              {answer ? answer : "Chưa trả lời"}
                            </p>
                            <div className="border-b-2"></div>
                          </div>
                        </List.Item>
                      );
                    }}
                    style={{ maxHeight: "85vh", overflow: "auto" }}
                  />
                )}
                {/*{i?.quiz?.type === "essay" && (*/}
                {/*  <EssayAnswer*/}
                {/*    essayAnswer={i?.essayAnswer}*/}
                {/*    filename={i?.filename}*/}
                {/*  />*/}
                {/*)}*/}

                {i.predictAmount &&
                (<div className="p-3">
                  <h1 className="text-base">
                    Câu {i?.quiz?.questions.length + 1}:
                  </h1>
                  <h3
                      className="font-semibold py-3"
                  >
                    Dự đoán số lượng người tham dự
                  </h3>
                  <p className="pt-3 text-green-500 font-bold">
                              <span style={{ color: "red" }}>
                                Câu trả lời của bạn:
                              </span>
                    {i.predictAmount}
                  </p>
                  <div className="border-b-2"></div>
                </div>)}
              </Collapse>
            </Drawer>
          </React.Fragment>
        ),
      });
    }
  });

  return (
    <div className="p-5 pt-20">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="pb-28 pt-20">
          <Select
            defaultValue="tất cả"
            onChange={handleFilterChange}
            className="me-3 w-full sm:w-64 mb-3 md:mb-0"
          >
            <Option value="tất cả">Tất cả</Option>
            {cources?.map((course) => (
              <Option key={course?._id} value={course?.name}>
                {course?.name}
              </Option>
            ))}
          </Select>
          <Table columns={columns} dataSource={data} className="pb-56" />
        </div>
      )}
    </div>
  );
};

export default ScoreManagement;
