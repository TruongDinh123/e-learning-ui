"use client";
import React, { useEffect, useState } from "react";
import {
  Row,
  Col,
  Spin,
  Upload,
  Button,
  message,
  Drawer,
  Breadcrumb,
} from "antd";
import { unwrapResult } from "@reduxjs/toolkit";
import { useDispatch } from "react-redux";
import { UploadOutlined } from "@ant-design/icons";
import {
  getScore,
  submitQuizEsay,
  uploadFileUserSubmit,
  viewAQuiz,
} from "@/features/Quiz/quizSlice";
import dynamic from "next/dynamic";
import "react-quill/dist/quill.snow.css";
import moment from "moment";
import Link from "next/link";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

export default function HandleSubmitEssay({ params }) {
  const [quiz, setquiz] = useState([]);
  console.log("🚀 ~ quiz:", quiz);
  const [score, setScore] = useState([]);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [essayContent, setEssayContent] = useState("");
  const [messageApi, contextHolder] = message.useMessage();
  const [update, setUpdate] = useState(0);
  const [drawerVisible, setDrawerVisible] = useState(false);
  const [comment, setComment] = useState("");
  const [comments, setComments] = useState([
    {
      author: "John Doe",
      avatar: "https://example.com/avatar.jpg",
      content: "Great post!",
      datetime: "2021-09-01",
    },
    // More comments...
  ]);

  const handleCommentChange = (e) => {
    setComment(e.target.value);
  };

  const handleCommentSubmit = () => {
    setComments([
      ...comments,
      {
        author: "You",
        avatar: "https://example.com/your-avatar.jpg",
        content: comment,
        datetime: new Date().toISOString(),
      },
    ]);

    setComment("");
  };

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
      .catch((error) => {});
  }, [score]);

  const handleSubmitEssay = () => {
    if (!essayContent && !file) {
      message.error(
        "Không được để trống nội dung bài làm và file đính kèm",
        3.5
      );
      return;
    }
    dispatch(submitQuizEsay({ quizId: idQuiz, essayAnswer: essayContent }))
      .then(unwrapResult)
      .then((res) => {
        if (file) {
          dispatch(
            uploadFileUserSubmit({ quizId: idQuiz, filename: file })
          ).then((res) => {
            if (res.status) {
              setScore(score + 1);
              setIsLoading(false);
            }
          });
        }
        setFile(null);
        setEssayContent("");
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            setUpdate(update + 1);
            message.success(res.message, 1.5);
          })
          .catch((error) => {
            setIsLoading(false);
            message.error(error.response?.data?.message, 3.5);
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
      });
  }, [update]);

  let submissionTime;
  if (quiz[0] && quiz[0]?.submissionTime) {
    submissionTime = new Date(quiz[0]?.submissionTime);
  }
  const currentTime = new Date();

  const isTimeExceeded = currentTime > submissionTime;

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 overflow-auto pb-28">
        {contextHolder}
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin />
          </div>
        ) : (
          <React.Fragment>
            {quiz?.map((quiz, quizIndex) => {
              const currentScore = score.find((s) => s.quiz?._id === quiz?._id);
              const courseName =
                quiz.courseIds[0]?.name || quiz.lessonId?.courseId?.name;

              const teacherName =
                quiz.lessonId?.courseId?.teacher.lastName +
                " " +
                quiz.lessonId?.courseId?.teacher.firstName;
              return (
                <Row
                  gutter={16}
                  key={quizIndex}
                  className="bg-white shadow-md rounded-lg p-6 mb-4"
                >
                  <Col xs={24} md={16}>
                    <div className="flex justify-between items-stretch">
                      <div className="flex-1 mx-3">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6 flex-1">
                          <div className="border-2 border-gray-300 p-4 rounded-md">
                            <div className="flex items-center">
                              <div>
                                <h1 className="text-3xl font-bold mb-3 text-blue-700">
                                  Nội dung bài làm:
                                </h1>
                                <h2 className="text-2xl font-bold mb-5 text-blue-600">
                                  {quiz.essay?.title}
                                </h2>
                                <p className="text-blue-600">
                                  Tên giáo viên: {teacherName}
                                </p>
                                <p className="text-blue-600">
                                  Tên khóa học: {courseName}
                                </p>
                                <p className="text-blue-600">
                                  Tên bài học: {quiz.lessonId?.name}
                                </p>
                                <p className="text-blue-600">
                                  Thời gian hoàn thành:{" "}
                                  {moment(quiz.submissionTime).format(
                                    "DD/MM/YYYY HH:mm"
                                  )}
                                </p>
                                <div
                                  className="mb-5 text-gray-700"
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
                      </div>
                    </div>
                    <div className="pt-10 flex-1 mx-3">
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
                          <Button
                            color="blue"
                            onClick={handleSubmitEssay}
                            disabled={isTimeExceeded || currentScore?.score}
                          >
                            Nộp bài
                          </Button>
                          {isTimeExceeded && (
                            <div className="text-red-500 ml-4">
                              Thời gian làm bài đã hết
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </Col>
                  <Col xs={8} md={8} className="right-0">
                    <div className="border-2 border-gray-300 rounded-md">
                      <div className="mb-4 border-gray-300 p-4 pb-4 rounded-md">
                        <Button
                          onClick={() => setDrawerVisible(true)}
                          className="bg-blue-500 text-white"
                        >
                          Xem nội dung làm bài của bạn
                        </Button>
                        <Drawer
                          title="Nội dung làm bài của bạn"
                          placement="right"
                          closable={true}
                          onClose={() => setDrawerVisible(false)}
                          visible={drawerVisible}
                          width={window.innerWidth < 768 ? "100%" : "50%"}
                        >
                          <div className="border-2 border-gray-300 p-4 rounded-md">
                            <div className="items-center">
                              <div>
                                <h1 className="text-3xl font-bold mb-5">
                                  Nội dung làm bài của bạn:
                                </h1>
                                <div
                                  className="mb-5"
                                  dangerouslySetInnerHTML={{
                                    __html: currentScore?.essayAnswer,
                                  }}
                                />
                              </div>
                              {currentScore?.filename && (
                                <div>
                                  <h3 className="text-lg font-bold mb-2">
                                    File đã nộp:
                                  </h3>
                                  <a
                                    href={currentScore?.filename}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 underline hover:text-blue-700"
                                  >
                                    Download File
                                  </a>
                                </div>
                              )}
                            </div>
                          </div>
                          <div>
                            <h4 className="text-2xl font-bold mb-5 text-blue-600">
                              Điểm của bạn: {currentScore?.score}
                            </h4>
                            {currentScore?.score ? (
                              <div className="text-green-500">
                                Tốt lắm! Tiếp tục cố gắng!
                              </div>
                            ) : (
                              <div className="text-red-500">
                                Giáo viên chưa chấp điểm.
                              </div>
                            )}
                          </div>
                        </Drawer>
                      </div>
                      {/* <div>
                        <h4 className="text-2xl font-bold mb-2">Bình luận:</h4>
                        <List
                          className="comment-list"
                          itemLayout="horizontal"
                          dataSource={comments}
                          renderItem={(item) => (
                            <li>
                              <div
                                style={{
                                  border: "1px solid #ccc",
                                  margin: "10px",
                                  padding: "10px",
                                  borderRadius: "5px",
                                }}
                              >
                                <div
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                  }}
                                >
                                  <Avatar src={item.avatar} alt={item.author} />
                                  <h3 style={{ marginLeft: "10px" }}>
                                    {item.author}
                                  </h3>
                                </div>
                                <p>{item.content}</p>
                                <p>
                                  <small>{item.datetime}</small>
                                </p>
                              </div>
                            </li>
                          )}
                        />
                        <div
                          style={{
                            marginTop: "20px",
                            marginBottom: "20px",
                            padding: "10px",
                            display: "flex",
                            alignItems: "center",
                          }}
                        >
                          <Input.TextArea
                            value={comment}
                            onChange={handleCommentChange}
                            placeholder="Viết bình luận của bạn ở đây..."
                            autoSize={{ minRows: 3, maxRows: 5 }}
                            style={{ marginRight: "10px" }}
                          />
                          <Button type="default" onClick={handleCommentSubmit}>
                            Comment
                          </Button>
                        </div>
                      </div> */}
                    </div>
                  </Col>
                </Row>
              );
            })}
          </React.Fragment>
        )}
      </div>
    </>
  );
}
