"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import { Modal, Spin, Table, Upload, message } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import {
  createVdLesson,
  deleteVdLesson,
  viewALesson,
} from "@/features/Lesson/lessonSlice";
import { UploadOutlined } from "@ant-design/icons";

export default function VideoLesson({ params }) {
  const dispatch = useDispatch();
  const [videoLesson, setvideoLesson] = useState([]);
  const [lesson, setLesson] = useState();
  const [messageApi, contextHolder] = message.useMessage();
  const [updateLesson, setUpdateLesson] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [file, setFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name Lesson",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
      render: (text, record) => <a>{lesson.name}</a>,
    },
    {
      title: "Video",
      dataIndex: "url",
      onFilter: (value, record) => record.url.indexOf(value) === 0,
      sorter: (a, b) => a.url.length - b.url.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  //viewLesson api
  useEffect(() => {
    setIsLoading(true);
    dispatch(viewALesson({ lessonId: params?.id }))
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
  }, [updateLesson, dispatch, messageApi]);

  //table data
  let data = [];
  videoLesson.forEach((i, index) => {
    data.push({
      key: index + 1,
      url: (
        <>
          <Button type="primary" onClick={showModal} className="me-3">
            video
          </Button>
          <Modal
            title="Video Lesson"
            open={isModalOpen}
            onCancel={handleCancel}
            onOk={handleOk}
            width={70 + "%"}
            height={70 + "%"}
          >
            <div>
              <video width="100%" height="auto" controls>
                <source
                  // src={`${process.env.NEXT_PUBLIC_API_URL}/uploads/${i?.url}`}
                  src={i?.url}
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </div>
          </Modal>
        </>
      ),
      action: (
        <>
          <Popconfirm
            title="Delete video"
            description="Are you sure to delete video?"
            okText="Yes"
            cancelText="No"
            onConfirm={() =>
              handleDelVideoLesson({
                videoLessonId: i?._id,
                lessonId: params?.id,
              })
            }
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </>
      ),
    });
  });

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
      <h1>Video to Lesson</h1>
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <>
            <Upload {...props}>
              <Button icon={<UploadOutlined />}>Select File</Button>
            </Upload>
            <Button type="primary" onClick={handleSave} className="mt-2 mb-2">
              save
            </Button>
          </>
          <Table columns={columns} dataSource={data} />
        </>
      )}
    </div>
  );
}
