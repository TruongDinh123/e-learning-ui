"use client";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  Card,
  Form,
  Input,
  Modal,
  message,
  Button,
  Space,
  DatePicker,
  Upload,
  Spin,
  InputNumber,
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  updateQuiz,
  uploadFileQuiz,
  uploadQuestionImage,
  viewAQuiz,
  viewQuiz,
} from "@/features/Quiz/quizSlice";
import { useRouter } from "next/navigation";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import dayjs from "dayjs";

const ReactQuill = dynamic(
  () => import("react-quill").then((mod) => mod.default),
  { ssr: false }
);

export default function UpdateQuiz(props) {
  const { quizId, courseIds, questionId, refresh } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setquiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const [fileQuestion, setFileQuestion] = useState(null);
  const [questionImages, setQuestionImages] = useState([]);

  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

  const propUpdateEssay = {
    onRemove: () => {
      setFile(null);
    },
    beforeUpload: (file) => {
      setFile(file);
      return false;
    },
    fileList: file ? [file] : [],
  };

  const propsQuestion = {
    onRemove: () => {
      setFileQuestion(null);
    },
    beforeUpload: (file) => {
      setFileQuestion(file);
      return false;
    },
    fileList: fileQuestion ? [fileQuestion] : [],
    accept: ".jpg, .jpeg, .png",
  };

  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleAddQuestion = () => {
    const questions = form.getFieldValue("questions") || [];
    const newQuestions = [...questions, {}];
    form.setFieldsValue({ questions: newQuestions });
  };

  const handleRemoveQuestion = (index) => {
    const questions = form.getFieldValue("questions") || [];
    const newQuestions = [...questions];
    newQuestions.splice(index, 1);
    form.setFieldsValue({ questions: newQuestions });
  };

  const handleImageUpload = (event, index) => {
    setQuestionImages((prevState) => {
      const newState = [...prevState];
      newState[index] = fileQuestion;
      return newState;
    });
  };

  const handleUpdateQuiz = (values) => {
    setIsLoading(true);
    let formattedValues;

    const quizToUpdate = quiz.find((quiz) => quiz._id === quizId);

    if (quizToUpdate.type === "multiple_choice") {
      formattedValues = {
        ...values,
        submissionTime: values?.submissionTime?.toISOString(),
        timeLimit: values?.timeLimit,

        questions: values.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
      };
    } else if (quizToUpdate.type === "essay") {
      formattedValues = {
        ...values,
        submissionTime: values?.submissionTime?.toISOString(),

        essay: {
          title: values.essayTitle,
          content: values.essayContent,
        },
      };
    }

    dispatch(updateQuiz({ quizId: quizId, formattedValues }))
      .then(unwrapResult)
      .then((res) => {
        const questionIds = res.metadata?.questions?.map((q) => q._id);

        if (file) {
          dispatch(uploadFileQuiz({ quizId: quizId, filename: file })).then(
            (res) => {
              if (res.status) {
                setFile(null);
              }
              setIsLoading(false);
            }
          );
        }
        if (fileQuestion) {
          questionImages.forEach((imageFile, index) => {
            if (imageFile && questionIds[index]) {
              dispatch(
                uploadQuestionImage({
                  quizId: quizId,
                  questionId: questionIds[index],
                  filename: fileQuestion,
                })
              ).catch((error) => {
                message.error(
                  error.response?.data?.message ||
                    "An error occurred while uploading the question image.",
                  3.5
                );
              });
            }
          });
        }
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 2.5,
          })
          .then(() => {
            setIsModalOpen(false);
            message.success(res.message, 1.5);
            router.push(`/admin/quiz/view-list-question/${quizId}`);
            refresh();
          });
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error.response?.data?.message, 3.5);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      dispatch(viewAQuiz({ quizId: quizId }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setquiz(res.metadata);
            const quizToUpdate = res.metadata.find(
              (quiz) => quiz._id === quizId
            );
            if (quizToUpdate) {
              console.log("🚀 ~ quizToUpdate:", quizToUpdate)
              form.setFieldsValue({
                name: quizToUpdate.name,
                type: quizToUpdate.type,
                courseIds: quizToUpdate.courseIds,
                studentIds: quizToUpdate.studentIds,
                essayTitle: quizToUpdate.essay?.title,
                essayContent: quizToUpdate.essay?.content,
                attachment: quizToUpdate.essay?.attachment,
                questions: quizToUpdate.questions.map((question) => ({
                  ...question,
                  options: question.options.map((option) => ({
                    option: option,
                  })),
                  answer: question.answer,
                  image: question?.image_url,
                })),
                submissionTime: dayjs(quizToUpdate?.submissionTime),
                timeLimit: quizToUpdate.timeLimit,
              });
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {});
    }
  }, [courseIds, quizId, isModalOpen]);

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3 custom-button"
        style={{ width: "100%" }}
      >
        Cập nhật
      </Button>

      <Modal
        title="Cập nhật bài tập"
        open={isModalOpen}
        onCancel={handleCancel}
        footer={[<></>]}
        width={1000}
      >
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin />
          </div>
        ) : (
          <Form
            form={form}
            name="quiz_form"
            initialValues={{
              questions: [{}],
            }}
            onFinish={handleUpdateQuiz}
          >
            <Form.Item
              label="Thời hạn nộp"
              name="submissionTime"
              rules={[
                {
                  required: true,
                  message: "Vui lòng nhập thời gian nộp bài",
                },
              ]}
            >
              <DatePicker
                showTime
                disabledDate={(current) => {
                  // Không cho phép chọn ngày trước ngày hiện tại
                  let currentDate = new Date();
                  currentDate.setHours(0, 0, 0, 0); // Đặt thời gian về 00:00:00
                  return current && current.toDate() < currentDate;
                }}
              />
            </Form.Item>
            {form.getFieldValue("type") === "multiple_choice" ? (
              <>
                <Form.Item name="timeLimit" label="Thời gian làm bài (phút)">
                  <InputNumber min={1} placeholder="Nhập thời gian làm bài" />
                </Form.Item>
                <Form.Item
                  label="Tên bài tập"
                  name="name"
                  rules={[{ required: true, message: "Hãy nhập tên bài" }]}
                >
                  <Input placeholder="Tên bài tập" />
                </Form.Item>
                <Form.List name="questions">
                  {(fields, { add, remove }) => (
                    <div className="max-h-80 overflow-auto scrollbar scrollbar-thin">
                      {fields.map((field, index) => (
                        <Card
                          key={field.key}
                          title={`Question ${index + 1}`}
                          extra={
                            <Button onClick={() => handleRemoveQuestion(index)}>
                              Xóa
                            </Button>
                          }
                        >
                          <Form.Item
                            label="Câu hỏi"
                            name={[field.name, "question"]}
                            rules={[
                              {
                                required: true,
                                message: "Hãy nhập câu hỏi",
                              },
                            ]}
                          >
                            <Input placeholder="Câu hỏi" />
                          </Form.Item>
                          <Form.Item
                            label="Hình ảnh"
                            name={[field.name, "image"]}
                          >
                            <Upload
                              {...propsQuestion}
                              onChange={(event) =>
                                handleImageUpload(event, index)
                              }
                            >
                              <Button
                                className="custom-button"
                                type="primary"
                                icon={<UploadOutlined />}
                              >
                                Thêm tệp
                              </Button>
                            </Upload>
                            {form.getFieldValue([
                              "questions",
                              index,
                              "image",
                            ]) && (
                              <img
                                src={form.getFieldValue([
                                  "questions",
                                  index,
                                  "image",
                                ])}
                                alt={`Question ${index + 1}`}
                                className="max-w-auto h-40"
                              />
                            )}
                          </Form.Item>
                          <Form.List name={[field.name, "options"]}>
                            {(subFields, subMeta) => (
                              <div>
                                {subFields.map((subField, subIndex) => (
                                  <Space key={subField.key} style={{ display: 'flex', marginBottom: 8 }} align="start">
                                    <Form.Item
                                      noStyle
                                      name={[subField.name, "option"]}
                                      rules={[
                                        {
                                          required: true,
                                          message: "Hãy chọn lựa chọn",
                                        },
                                      ]}
                                    >
                                      <Input.TextArea placeholder="Thêm lựa chọn" autoSize={{ minRows: 1, maxRows: 6 }} />
                                    </Form.Item>
                                    <CloseOutlined
                                      onClick={() => subMeta.remove(subIndex)}
                                    />
                                  </Space>
                                ))}
                                <Button
                                  type="dashed"
                                  onClick={() => subMeta.add()}
                                  block
                                >
                                  + Thêm
                                </Button>
                              </div>
                            )}
                          </Form.List>
                          <Form.Item
                            label="Đáp án"
                            name={[field.name, "answer"]}
                            rules={[
                              {
                                required: true,
                                message: "Hãy nhập đáp án",
                              },
                            ]}
                          >
                            <Input placeholder="Đáp án" />
                          </Form.Item>
                        </Card>
                      ))}
                      <Button
                        type="dashed"
                        onClick={() => handleAddQuestion()}
                        block
                      >
                        + Thêm câu hỏi
                      </Button>
                    </div>
                  )}
                </Form.List>
              </>
            ) : (
              <>
                <Form.Item
                  label="Tiêu đề"
                  name="essayTitle"
                  rules={[{ required: true, message: "Vui lòng nhập tiêu đề" }]}
                >
                  <Input placeholder="Tiêu đề" />
                </Form.Item>

                <Form.Item name="essayContent">
                  <ReactQuill theme="snow" />
                </Form.Item>
                {quiz.essay?.attachment && (
                  <div>
                    <a href={quizToUpdate.essay.attachment} download>
                      Download Attachment
                    </a>
                  </div>
                )}
                <Upload {...propUpdateEssay}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload>
              </>
            )}
            <div className="pt-4 text-end">
              <Button type="default" className="mr-4" onClick={handleCancel}>
                Hủy
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                className="custom-button"
                loading={isLoading}
              >
                Lưu
              </Button>
            </div>
          </Form>
        )}
      </Modal>
    </React.Fragment>
  );
}
