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
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLesson, viewLesson } from "@/features/Lesson/lessonSlice";
import { useMediaQuery } from "react-responsive";
import { unwrapResult } from "@reduxjs/toolkit";
import VideoLesson from "../view-lesson-video/[id]/page";
import CreateLesson from "../create-lesson/page";
import Link from "next/link";

export default function Lesson({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [updateLesson, setUpdateLesson] = useState(0);
  const isMobile = useMediaQuery({ query: "(max-width: 767px)" });

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
    <div>
      <div className="p-3">
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
            <Row gutter={16} className="mt-3">
              {lesson.map((item) =>
                item.lessons.map((i, subIndex) => (
                  <Col span={8} key={subIndex._id}>
                    <Card title={i.name}>
                      <p>
                        Content: {i.content}
                      </p>
                      <div className="flex mt-3">
                        <Popconfirm
                          title="Delete the Lesson"
                          description="Are you sure to delete this Lesson?"
                          okText="Yes"
                          cancelText="No"
                          okButtonProps={{ style: { backgroundColor: "red" } }}
                          className="me-3"
                          onConfirm={() =>
                            handleDeleteLesson({
                              courseId: params?.id,
                              lessonId: i?._id,
                            })
                          }
                        >
                          <Button danger>Delete</Button>
                        </Popconfirm>
                        <VideoLesson lessonId={i?._id} />
                      </div>
                    </Card>
                  </Col>
                ))
              )}
            </Row>
          </React.Fragment>
        )}
      </div>
    </div>
  );
}
