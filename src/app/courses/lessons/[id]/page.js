"use client";
import React, { useEffect, useState } from "react";
import { Button, Col, Collapse, Row, Spin, message } from "antd";
import { useDispatch } from "react-redux";
import { viewALesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { FolderOpenOutlined } from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import "../[id]/page.css";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [videoLesson, setvideoLesson] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  const handleSelectLesson = (item) => {
    setIsLoading(true);
    dispatch(viewALesson({ lessonId: item._id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setvideoLesson(res.metadata.videos);
          setSelectedVideo(res.metadata.videos[0]);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div className="pt-4">
      <Row gutter={16}>
        <Col xs={24} md={8}>
          <h3>Course Content</h3>
          {isLoading ? (
            <Spin />
          ) : (
            lesson.map((i) => {
              return i.lessons.map((item, indexLess) => (
                <Collapse key={item.id}>
                  <Collapse.Panel header={item.content}>
                    <div className="collapse-container">
                      <span
                        key={item.id}
                        onClick={() => {
                          handleSelectLesson(item);
                          setSelectedVideo(item.video);
                        }}
                      >
                        {indexLess + 1} - {item.name}
                      </span>
                      <Button
                        className="button-container me-3"
                        courseId={i?._id}
                        onClick={() =>
                          router.push(`/courses/lessons/view-quizs/${item._id}`)
                        }
                      >
                        <FolderOpenOutlined />
                        Quizs
                      </Button>
                    </div>
                  </Collapse.Panel>
                </Collapse>
              ));
            })
          )}
        </Col>
        <Col xs={24} md={16}>
          {selectedVideo && (
            <video width="100%" height={isMobile ? "250px" : "600px"} controls>
              <source src={selectedVideo?.url} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </Col>
      </Row>
    </div>
  );
}
