"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Col,
  Menu,
  Row,
  Spin,
  Layout,
  Breadcrumb,
  Progress,
} from "antd";
import { useDispatch } from "react-redux";
import { viewALesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useMediaQuery } from "react-responsive";
import "../[id]/page.css";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getCourseCompletion } from "@/features/Courses/courseSlice";
import CompleteLesson from "@/components/complete-lesson";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [updateProgress, setUpdateProgress] = useState(0);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [selectedLessonContent, setSelectedLessonContent] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });
  const isBigScreen = useMediaQuery({ query: "(min-width: 1225px)" });
  const [completeCourse, setCompleteCourse] = useState([]);

  const { Sider } = Layout;

  const [collapsed, setCollapsed] = useState(isMobile);

  const onCollapse = (collapsed) => {
    setCollapsed(collapsed);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(viewLesson({ courseId: params.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setLesson(res.data.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        
        setIsLoading(false);
      });
    dispatch(getCourseCompletion({ courseId: params.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCompleteCourse(res.metadata);
        }
      })
      .catch((error) => {
        
      });
  }, [updateProgress]);

  const handleSelectLesson = (item) => {
    setIsLoading(true);
    setSelectedLesson(item._id);
    setSelectedLessonContent(item.content);
    dispatch(viewALesson({ lessonId: item._id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setSelectedVideo(res.metadata.videos[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        
        setIsLoading(false);
      });
  };

  let isCompleted = false;
  if (completeCourse && completeCourse.userLessonInfo) {
    const currentLesson = completeCourse.userLessonInfo.find(
      (lesson) => lesson.lesson === selectedLesson
    );
    if (currentLesson) {
      isCompleted = currentLesson.completed;
    }
  }

  return (
    <React.Fragment>
      <Breadcrumb className="pt-3 pl-5">
        <Breadcrumb.Item>
          <Link href="/">Tramg chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/courses/view-course">Khóa học của bạn</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/courses/Lesson/${params?.id}`}>
            {lesson[0]?.name.slice(0, 20)}
            {lesson[0]?.name.length > 20 ? "..." : ""}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div className="pt-4">
        <Row gutter={16}>
          <Layout style={{ minHeight: "100vh" }}>
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={onCollapse}
              collapsedWidth={0}
              theme="dark"
            >
              <Menu theme="light" defaultSelectedKeys={["1"]} mode="inline">
                {completeCourse && completeCourse.completionPercentage && (
                  <div className="p-8 bg-gray-100">
                    <Progress
                      percent={parseFloat(
                        completeCourse.completionPercentage.toFixed(2)
                      )}
                      status="active"
                      showInfo={false}
                    />
                    <p className="font-medium mt-2 text-emerald-700 text-sm">
                      {completeCourse.completionPercentage.toFixed(2)}% Complete
                    </p>
                  </div>
                )}
              </Menu>
              <div className="logo" />
              <Menu theme="dark" defaultSelectedKeys={["1"]} mode="inline">
                {lesson.map((i) =>
                  i.lessons.map((item) => (
                    <Menu.Item
                      key={item._id}
                      onClick={() => {
                        handleSelectLesson(item);
                        setSelectedVideo(item.video);
                      }}
                    >
                      <FolderOpenOutlined />
                      <span className="ml-1">{item.name}</span>
                    </Menu.Item>
                  ))
                )}
              </Menu>
            </Sider>
            <Layout style={{ paddingLeft: collapsed ? "0px" : "50px" }}>
              <Col
                xs={isBigScreen ? 24 : 24}
                md={isBigScreen ? 24 : 24}
                className="overflow-y-auto h-screen pb-20 scrollbar scrollbar-thin"
              >
                {isLoading ? (
                  <div className="flex justify-center items-center h-screen">
                    <Spin />
                  </div>
                ) : (
                  <React.Fragment>
                    {selectedVideo && (
                      <video
                        width="100%"
                        height={isMobile ? "250px" : "800px"}
                        controls
                      >
                        <source src={selectedVideo?.url} type="video/mp4" />
                        Your browser does not support the video tag.
                      </video>
                    )}

                    {selectedLessonContent && (
                      <div className="pt-8">
                        <div className="md:flex-row border rounded-md p-6 flex flex-col lg:flex-row items-center justify-between">
                          <h2 className="text-2xl font-semibold mb-2">
                            {selectedLessonContent}
                          </h2>
                          {completeCourse && (
                            <CompleteLesson
                              lessonId={selectedLesson}
                              isCompleted={isCompleted}
                              refresh={() =>
                                setUpdateProgress(updateProgress + 1)
                              }
                            />
                          )}
                        </div>
                        <div className="lesson-content mt-4 border rounded-md p-6">
                          <h2 className="text-2xl font-bold mb-2">
                            Nội dung bài học
                          </h2>
                          <p className="text-lg">{selectedLessonContent}</p>
                        </div>
                      </div>
                    )}

                    {selectedLesson && (
                      <div className="mt-4">
                        <Button
                          className="button-container me-3 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() =>
                            router.push(`/courses/view-details/${params.id}`)
                          }
                        >
                          <FolderOpenOutlined />
                          Làm bài tập
                        </Button>
                      </div>
                    )}
                  </React.Fragment>
                )}
              </Col>
            </Layout>
          </Layout>
        </Row>
      </div>
    </React.Fragment>
  );
}
