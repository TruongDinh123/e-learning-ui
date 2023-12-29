"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Spin, Table, Upload, message } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import {
  createVdLesson,
  deleteVdLesson,
  viewALesson,
} from "@/features/Lesson/lessonSlice";
import { UploadOutlined } from "@ant-design/icons";

export default function VideoLesson(propsComponent) {
  const { lessonId } = propsComponent;
  const dispatch = useDispatch();
  const [videoLesson, setvideoLesson] = useState([]);
  const [lesson, setLesson] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [updateLesson, setUpdateLesson] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isVideoEmpty, setIsVideoEmpty] = useState(true);

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleSave = () => {
    setIsLoading(true);
    dispatch(createVdLesson({ lessonId: lessonId, filename: file }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateLesson(updateLesson + 1);
          setFile(null);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
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
    dispatch(viewALesson({ lessonId: lessonId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setvideoLesson(res.metadata.videos);
          setLesson(res.metadata);
        } else {
          messageApi.error(res.message);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, [updateLesson]);

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
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
        <React.Fragment>
          <Button
            type="default"
            onClick={showModal}
            className="me-3"
            style={{ width: "100%" }}
          >
            video
          </Button>
          <Modal
            title="Video bài học"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            width={70 + "%"}
            height={70 + "%"}
            footer={
              <React.Fragment>
                <Button key="cancel" onClick={handleOk}>
                  Hủy
                </Button>
              </React.Fragment>
            }
          >
            <React.Fragment>
              <Upload {...props}>
                <Button icon={<UploadOutlined />} disabled={!isVideoEmpty}>
                  Thêm video
                </Button>
              </Upload>
              <Button
                type="primary"
                onClick={handleSave}
                className="mt-2 mb-2 me-3"
                style={{
                  color: "#fff",
                  backgroundColor: isVideoEmpty && file ? "#1890ff" : "#ccc",
                }}
                disabled={!isVideoEmpty || !file}
              >
                Lưu
              </Button>
              {data.map((item, itemIndex) => (
                <React.Fragment key={itemIndex}>
                  <Popconfirm
                    title="Delete video"
                    description="Are you sure to delete video?"
                    okText="Có"
                    cancelText="Không"
                    okButtonProps={{ style: { backgroundColor: "red" } }}
                    onConfirm={() =>
                      handleDelVideoLesson({
                        videoLessonId: item?._id,
                        lessonId: lessonId,
                      })
                    }
                  >
                    <Button danger>Xóa</Button>
                  </Popconfirm>
                </React.Fragment>
              ))}
            </React.Fragment>
            {data.map((videoId, videoIndex) => (
              <React.Fragment key={videoIndex}>
                <div>
                  <video width="100%" height="auto" controls>
                    <source src={videoId?.url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                </div>
              </React.Fragment>
            ))}
          </Modal>
        </React.Fragment>
      )}
    </div>
  );
}
