"use client";
import React, { useEffect, useState } from "react";
import { Col, List, Row, message } from "antd";
import { useDispatch } from "react-redux";
import { viewALesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [messageApi, contextHolder] = message.useMessage();
  const [videoLesson, setvideoLesson] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);

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
    <Row>
      {contextHolder}
      <Col span={8}>
        {lesson.map((i, index) => {
          return i.lessons.map((item, subIndex) => (
            <List
              key={item.id}
              dataSource={[item]}
              renderItem={(item) => (
                <List.Item
                  key={item.id}
                  onClick={() => {
                    handleSelectLesson(item);
                    setSelectedVideo(item.video);
                  }}
                >
                  {item.name}
                </List.Item>
              )}
            />
          ));
        })}
      </Col>
      <Col span={16}>
        {selectedVideo && (
          <video width="100%" height="600px" controls>
            <source
              src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${selectedVideo?.url}`}
              type="video/mp4"
            />
            Your browser does not support the video tag.
          </video>
        )}
      </Col>
    </Row>
  );
}
