"use client";
import React, { useEffect, useState } from "react";
import "../[id]/page.css";
import { useDispatch } from "react-redux";
import {
  createVdLesson,
  deleteVdLesson,
  viewALesson,
  viewLesson,
} from "@/features/Lesson/lessonSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Breadcrumb, Button, Popconfirm, Spin, Upload, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import Link from "next/link";

export default function LessonDetails({ params }) {
  const dispatch = useDispatch();
  const [lesson, setLesson] = useState([]);
  const [videoLesson, setvideoLesson] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoEmpty, setIsVideoEmpty] = useState(true);
  const [updateLesson, setUpdateLesson] = useState(0);
  const [file, setFile] = useState(null);

  const handleSave = () => {
    setIsLoading(true);
    dispatch(createVdLesson({ lessonId: params?.id, filename: file }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateLesson(updateLesson + 1);
          setFile(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        
        setIsLoading(false);
      });
  };

  const handleDelVideoLesson = ({ videoLessonId, lessonId }) => {
    setIsLoading(true);

    dispatch(deleteVdLesson({ videoLessonId, lessonId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateLesson(updateLesson + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        
        setIsLoading(false);
      });
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

  //viewLesson api
  useEffect(() => {
    setIsLoading(true);
    dispatch(viewALesson({ lessonId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setvideoLesson(res.metadata.videos);
          setLesson(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
        setIsLoading(false);
      });
  }, [updateLesson, dispatch]);

  let data = [];
  videoLesson.forEach((i, index) => {
    data.push({
      key: index + 1,
      url: i?.url,
      _id: i?._id,
    });
  });

  useEffect(() => {
    if (videoLesson.length > 0) {
      setIsVideoEmpty(false);
    } else {
      setIsVideoEmpty(true);
    }
  }, [videoLesson]);

  return (
    <React.Fragment>
      <Breadcrumb>
        <Breadcrumb.Item>
          <Link href="/admin/courses">Courses</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/admin/courses/Lesson/${lesson?.courseId}`}>
            {lesson?.name}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <div class="max-w-screen-xl mx-auto grid-container">
        <h1 className="text-2xl text-black font-bold mb-2">Chi tiết bài học</h1>

        <main class="mt-10">
          <React.Fragment>
            {isVideoEmpty && (
              <>
                <Upload {...props}>
                  <Button icon={<UploadOutlined />} disabled={!isVideoEmpty}>
                    Thêm video
                  </Button>
                </Upload>
                <Button
                  type="primary"
                  onClick={handleSave}
                  className="mt-2 mb-2 me-3 custom-button"
                  style={{
                    color: "#fff",
                    backgroundColor: isVideoEmpty && file ? "#1890ff" : "#ccc",
                  }}
                  disabled={!isVideoEmpty || !file}
                  loading={isLoading}
                >
                  Lưu
                </Button>
              </>
            )}
          </React.Fragment>
          <div
            className={`mb-4 md:mb-0 lg:h-[24em] sm:h-0 w-full max-w-screen-md mx-auto relative ${
              isVideoEmpty ? "hidden" : ""
            }`}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <Spin />
              </div>
            ) : (
              data.map((video, videoIndex) => (
                <React.Fragment key={videoIndex}>
                  <div>
                    <video height="auto" controls>
                      <source src={video?.url} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </React.Fragment>
              ))
            )}
            <div>
              {data.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <Popconfirm
                    title="Xóa video"
                    description="Bạn có muốn xóa video?"
                    okText="Có"
                    cancelText="Không"
                    okButtonProps={{ style: { backgroundColor: "red" } }}
                    onConfirm={() =>
                      handleDelVideoLesson({
                        videoLessonId: item?._id,
                        lessonId: params?.id,
                      })
                    }
                  >
                    <Button
                      danger
                      style={{
                        position: "absolute",
                        top: "0",
                        right: "0",
                        backgroundColor: "white",
                      }}
                    >
                      X
                    </Button>
                  </Popconfirm>
                </React.Fragment>
              ))}
            </div>
          </div>

          <div class="px-4 lg:px-0 lg:mt-24 text-gray-700 max-w-screen-md mx-auto text-lg leading-relaxed">
            <h2 class="text-2xl text-gray-800 font-semibold mb-4 mt-4">
              {lesson?.name}
            </h2>

            <p class="pb-6">{lesson?.content}</p>
          </div>
        </main>
      </div>
    </React.Fragment>
  );
}
