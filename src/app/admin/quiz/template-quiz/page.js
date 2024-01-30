"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Menu, Image, Space, Empty, Drawer, Spin, Popconfirm } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button } from "antd";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { BookOutlined } from "@ant-design/icons";
import { Col } from "react-bootstrap";
import { deleteTemplates, viewQuizTemplates } from "@/features/Quiz/quizSlice";
import "../template-quiz/page.css";
import UpdateQuizTemplate from "../update-quiz-template/page";

export default function TeamplateQuiz() {
  const dispatch = useDispatch();
  const [templateQuiz, setTemplateQuiz] = useState([]);
  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [updateQuizTemplate, setUpdateQuizTemplate] = useState(0);

  // viewCourses api
  useEffect(() => {
    setIsLoading(true);
    dispatch(viewQuizTemplates())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setTemplateQuiz(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, [updateQuizTemplate]);

  const showDrawer = (quiz) => {
    setCurrentQuiz(quiz);
    setIsDrawerVisible(true);
  };

  const closeDrawer = () => {
    setIsDrawerVisible(false);
  };

  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  const handleDeleteQuizTemplate = ({ quizTemplateId }) => {
    setIsLoading(true);

    dispatch(deleteTemplates({ quizTemplateId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateQuizTemplate(updateQuizTemplate + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  };

  //table data
  let data = [];
  templateQuiz.forEach((i, index) => {
    data.push({
      key: index + 1,
      _id: i?._id,
      name: i?.name,
      type: i?.type,
      questions: i?.questions,
      createdAt: i?.createdAt,
    });
  });
  return (
    <div className="p-3">
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <h1 className="font-bold text-2xl">Danh Sách bài tập mẫu</h1>
          <div className="space-y-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3 list-grid-container scrollbar scrollbar-thin pb-10">
              {data.map((item, index) => {
                return (
                  <div
                    key={index}
                    className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full"
                  >
                    <div className="relative w-full aspect-video rounded-md overflow-hidden">
                      <Image
                        fill
                        className="object-cover"
                        alt="course image"
                        src="https://www.codewithantonio.com/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F7b009b26-3dd8-4947-a3d6-c3f7e7420990-c91s7l.png&w=1920&q=75"
                      />
                    </div>
                    <div className="flex flex-col pt-2">
                      <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                        {item.name}: ({item.type})
                      </div>
                      <p className="text-xs text-muted-foreground"></p>
                      <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                        <div className="flex items-center gap-x-1 text-slate-500">
                          <BookOutlined />
                          <span>
                            Ngày tạo:{" "}
                            {new Date(item.createdAt).toLocaleDateString(
                              "vi-VN"
                            )}
                          </span>
                        </div>
                      </div>
                      <Col lg="12">
                        <Space
                          size="large"
                          direction="vertical"
                          className="lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between"
                        >
                          <Space wrap>
                            <Button
                              courseId={item?._id}
                              onClick={() => showDrawer(item)}
                            >
                              Xem chi tiết
                            </Button>
                            <UpdateQuizTemplate
                              quizTemplateId={item?._id}
                              refresh={() =>
                                setUpdateQuizTemplate(updateQuizTemplate + 1)
                              }
                            />
                            <Popconfirm
                              title="Xóa"
                              description="Bạn có muốn xóa?"
                              okText="Có"
                              cancelText="Không"
                              okButtonProps={{
                                style: { backgroundColor: "red" },
                              }}
                              onConfirm={() =>
                                handleDeleteQuizTemplate({
                                  quizTemplateId: item?._id,
                                })
                              }
                            >
                              <Button danger>Xóa</Button>
                            </Popconfirm>
                          </Space>
                        </Space>
                      </Col>
                    </div>
                  </div>
                );
              })}
            </div>
            {data?.length === 0 && (
              <Empty className="text-center text-sm text-muted-foreground mt-10">
                Không có bài tập mẫu.
              </Empty>
            )}
          </div>
        </div>
      )}
      <Drawer
        title={currentQuiz?.name}
        visible={isDrawerVisible}
        onClose={closeDrawer}
        width={720}
      >
        <div className="overflow-auto scrollbar scrollbar-thin h-screen">
          {currentQuiz?.questions?.map((question, index) => (
            <div key={index} className="p-3 border-b border-gray-200">
              <h3 className="font-semibold py-3 text-lg">
                {question?.question}
              </h3>
              <ul className="list-disc list-inside space-y-2 mb-3">
                {question?.options?.map((option, index) => (
                  <li key={index} className="text-blue-600">
                    Câu {index + 1}: {option}
                  </li>
                ))}
              </ul>
              <p className="pt-3 text-green-500 font-bold">
                <span className="text-red-500">Đáp án: </span>
                {question?.answer}
              </p>
            </div>
          ))}
        </div>
      </Drawer>
    </div>
  );
}
