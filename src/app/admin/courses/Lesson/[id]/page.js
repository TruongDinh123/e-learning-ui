"use client";
import {
  Spin,
  Popconfirm,
  Button,
  Breadcrumb,
  Row,
  Col,
  Card,
  message,
  Empty,
  Space,
  Dropdown,
  Menu,
  Drawer,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import VideoLesson from "../view-lesson-video/[id]/page";
import CreateLesson from "../create-lesson/page";
import Link from "next/link";
import { BookOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import "../[id]/page.css";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLesson, setUpdateLesson] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  const [isDrawerVisible, setIsDrawerVisible] = useState(false);
  const [fullContent, setFullContent] = useState("");

  const handleReadMore = (content) => {
    setFullContent(content);
    setIsDrawerVisible(true);
  };

  const handleCloseDrawer = () => {
    setIsDrawerVisible(false);
  };

  //viewLesson api
  useEffect(() => {
    setIsLoading(true);
    dispatch(viewLesson({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setLesson(res.data.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
        setIsLoading(false);
      });
  }, [updateLesson, dispatch]);

  const lessonIds = lesson[0]?.lessons.map((lesson) => lesson._id);
  console.log(lessonIds);

  //handleDeleteLesson
  const handleDeleteLesson = ({ courseId, lessonId }) => {
    setIsLoading(true);
    dispatch(deleteLesson({ courseId, lessonId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setLesson(lesson.filter((item) => item._id !== lessonId));
          setUpdateLesson(updateLesson + 1);
          setIsLoading(false);
        } else {
          setIsLoading(false);
        }
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="">
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link href="/admin/courses/view-courses">Courses</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/admin/courses/Lesson/${params?.id}`}>
            {lesson[0]?.name}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <CreateLesson
            courseId={params?.id}
            refresh={() => setUpdateLesson(updateLesson + 1)}
          />
          <div className="max-w-screen-2xl mx-auto">
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3 course-grid-container">
                {lesson.map((item) =>
                  item.lessons.map((i, subIndex) => {
                    const menu = (
                      <Menu>
                        <Menu.Item>
                          <Popconfirm
                            title="Delete the Lesson"
                            description="Are you sure to delete this Lesson?"
                            okText="Yes"
                            cancelText="No"
                            okButtonProps={{
                              style: { backgroundColor: "red" },
                            }}
                            className="me-3"
                            onConfirm={() =>
                              handleDeleteLesson({
                                courseId: params?.id,
                                lessonId: i?._id,
                              })
                            }
                          >
                            <Button danger>Xóa</Button>
                          </Popconfirm>
                        </Menu.Item>
                        <Menu.Item>
                          <VideoLesson lessonId={i?._id} />
                        </Menu.Item>
                      </Menu>
                    );

                    return (
                      <div
                        key={subIndex}
                        className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 min-h-[100px]"
                      >
                        <div className="relative w-full aspect-video rounded-md overflow-hidden">
                          <img
                            src="https://placehold.co/300x200/d1d4ff/352cb5.png"
                            alt="Placeholder Image"
                            class="w-full h-48 rounded-md object-cover"
                          />
                        </div>
                        <div className="flex flex-col pt-2">
                          <p className="text-xs text-muted-foreground">
                            {i?.name}
                          </p>
                          <Drawer
                            title="Nội dung"
                            visible={isDrawerVisible}
                            onClose={handleCloseDrawer}
                          >
                            <p>{fullContent}</p>
                          </Drawer>
                          <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                            <div className="flex items-center gap-x-1 text-slate-500">
                              <BookOutlined />
                              <span>
                                {i?.content.split(" ").length > 20 ? (
                                  <div>
                                    <span>
                                      {i?.content
                                        .split(" ")
                                        .slice(0, 20)
                                        .join(" ")}
                                      ...
                                    </span>
                                    <span
                                      className=" text-blue-500 cursor-pointer"
                                      onClick={() => handleReadMore(i?.content)}
                                    >
                                      Đọc thêm
                                    </span>
                                  </div>
                                ) : (
                                  <span>{i?.content}</span>
                                )}
                              </span>
                            </div>
                          </div>
                          {isMobile ? (
                            <Dropdown overlay={menu}>
                              <Button
                                className="ant-dropdown-link text-center justify-self-center"
                                onClick={(e) => e.preventDefault()}
                              >
                                Chức năng
                              </Button>
                            </Dropdown>
                          ) : (
                            <Col lg="12">
                              <Space
                                size="large"
                                direction="vertical"
                                className="lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between"
                              >
                                <Space wrap>
                                  <Popconfirm
                                    title="Delete the Lesson"
                                    description="Are you sure to delete this Lesson?"
                                    okText="Yes"
                                    cancelText="No"
                                    okButtonProps={{
                                      style: { backgroundColor: "red" },
                                    }}
                                    className="me-3"
                                    onConfirm={() =>
                                      handleDeleteLesson({
                                        courseId: params?.id,
                                        lessonId: i?._id,
                                      })
                                    }
                                  >
                                    <Button danger>Xóa</Button>
                                  </Popconfirm>
                                  <VideoLesson lessonId={i?._id} />
                                </Space>
                              </Space>
                            </Col>
                          )}
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
              {lesson?.length === 0 && (
                <Empty className="text-center text-sm text-muted-foreground mt-10">
                  Không có bài tập nào được tạo.
                </Empty>
              )}
            </div>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}
