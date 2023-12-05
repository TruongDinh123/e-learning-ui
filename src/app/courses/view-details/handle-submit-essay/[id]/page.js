"use client";
import React, { useEffect, useState } from "react";
import { Row, Col, Spin, Upload, Tabs, Button, message } from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import { getScore, submitQuizEsay, viewAQuiz } from "@/features/Quiz/quizSlice";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

export default function HandleSubmitEssay({ params }) {
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  console.log("🚀 ~ score:", score);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [essayContent, setEssayContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [update, setUpdate] = useState(0);

  const props = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const idQuiz = quiz.map((item) => item._id);

  useEffect(() => {
    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [update]);

  const handleSubmitEssay = () => {
    dispatch(submitQuizEsay({ quizId: idQuiz, essayAnswer: essayContent }))
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "success",
            content: "Action in progress...",
            duration: 2.5,
          })
          .then(() => {
            setUpdate(update + 1);
            message.success(res.message, 1.5);
          });
      });
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(viewAQuiz({ quizId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);

        console.log(error);
      });
  }, []);

  return (
    <div className="mx-auto px-4 sm:px-6 lg:px-8 pt-10 overflow-auto pb-28">
      {contextHolder}
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          {quiz?.map((quiz, quizIndex) => {
            const currentScore = score.find((s) => s.quiz?._id === quiz?._id);
            console.log("🚀 ~ currentScore:", currentScore);

            return (
              <>
                <Row className="flex justify-between items-stretch">
                  <Col flex={2} className="mx-3">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="border-2 border-gray-300 p-4 rounded-md">
                        <div className="flex items-center">
                          <div>
                            <h1 className="text-3xl font-bold mb-5">
                              Nội dung bài làm:
                            </h1>

                            <h2 className="text-2xl font-bold mb-5">
                              {quiz.essay?.title}
                            </h2>
                            <div
                              className="mb-5"
                              dangerouslySetInnerHTML={{
                                __html: quiz.essay?.content,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                      {quiz.essay?.attachment && (
                        <div>
                          <h3 className="text-lg font-bold mb-2">
                            File đính kèm:
                          </h3>
                          <a
                            href={quiz.essay?.attachment}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-500 underline"
                          >
                            Download File
                          </a>
                        </div>
                      )}
                    </div>
                  </Col>
                  <Col flex={3} className="mx-3">
                    <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                      <div className="border-2 border-gray-300 p-4 rounded-md">
                        <div className="flex items-center">
                          <div>
                            <h1 className="text-3xl font-bold mb-5">
                              Nội dung làm bài của bạn:{" "}
                            </h1>
                            <div
                              className="mb-5"
                              dangerouslySetInnerHTML={{
                                __html: currentScore?.essayAnswer,
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </Col>
                </Row>
                <div className="pt-10">
                  <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                    <h1 className="text-3xl font-bold mb-5">Giao bài: </h1>
                    <ReactQuill
                      theme="snow"
                      value={essayContent}
                      onChange={setEssayContent}
                    />
                    <div className="flex pt-2">
                      <Upload {...props}>
                        <Button className="me-3" icon={<UploadOutlined />}>
                          Upload File
                        </Button>
                      </Upload>
                      <Button color="blue" onClick={handleSubmitEssay}>
                        Nộp bài
                      </Button>
                    </div>
                  </div>
                </div>
              </>
            );
          })}
        </React.Fragment>
      )}
    </div>
  );
}
