"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { viewALesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [videoLesson, setvideoLesson] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const router = useRouter();

  const isMobile = useMediaQuery({ query: '(max-width: 767px)' });

  useEffect(() => {
    dispatch(viewLesson({ courseId: params.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
            })
            .then(() => setLesson(res.data.metadata));
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  const handleSelectLesson = (item) => {
    dispatch(viewALesson({ lessonId: item._id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          messageApi
            .open({
              type: "success",
              content: "Action in progress...",
            })
            .then(() => {
              setvideoLesson(res.metadata.videos);
              setSelectedVideo(res.metadata.videos[0]);
            });
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="pt-4">
      <Row gutter={16}>
        {contextHolder}
        <Col xs={24} md={8}>
          {lesson.map((i) => {
            return i.lessons.map((item) => (
              <Collapse key={item.id}>
                <Collapse.Panel
                  header={item.name}
                  key={item.id}
                  onClick={() => {
                    handleSelectLesson(item);
                    setSelectedVideo(item.video);
                  }}
                >
                  <Button
                    className="me-3"
                    courseId={i?._id}
                    onClick={() => router.push(`/courses/lessons/view-quizs/${item._id}`)}
                  >
                    <FolderOpenOutlined />
                    Quizs
                  </Button>
                </Collapse.Panel>
              </Collapse>
            ));
          })}
        </Col>
        <Col xs={24} md={16}>
          {selectedVideo && (
            <video width="100%" height={isMobile ? "250px" : "600px"} controls>
              <source
                src={selectedVideo?.url}
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>
          )}
        </Col>
      </Row>
    </div>
  );
}
