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
} from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { CloseOutlined, UploadOutlined } from "@ant-design/icons";
import {
  updateQuiz,
  updateTemplates,
  uploadFileQuiz,
  viewAQuiz,
  viewAQuizTemplate,
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

export default function UpdateQuizTemplate(props) {
  const { quizTemplateId, questionId, refresh } = props;
  const [messageApi, contextHolder] = message.useMessage();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [quiz, setquiz] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const [form] = Form.useForm();
  const router = useRouter();

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

  const handleUpdateQuiz = (values) => {
    setIsLoading(true);
    let formattedValues;

    const quizToUpdate = quiz.find((quiz) => quiz._id === quizTemplateId);

    if (quizToUpdate.type === "multiple_choice") {
      formattedValues = {
        ...values,
        submissionTime: values?.submissionTime?.toISOString(),

        questions: values.questions.map((question) => ({
          ...question,
          options: question.options.map((option) => option.option),
        })),
      };
    }

    dispatch(
      updateTemplates({ quizTemplateId: quizTemplateId, formattedValues })
    )
      .then(unwrapResult)
      .then((res) => {
        messageApi
          .open({
            type: "Thành công",
            content: "Đang thực hiện...",
            duration: 0.5,
          })
          .then(() => {
            setIsModalOpen(false);
            message.success(res.message, 1.5);
            router.push(`/admin/quiz/template-quiz`);
            refresh();
          });
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        message.error(error.response?.data?.message, 3.5);
        setIsLoading(false);
      });
  };

  useEffect(() => {
    if (isModalOpen) {
      setIsLoading(true);
      dispatch(viewAQuizTemplate({ quizTemplateId: quizTemplateId }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setquiz(res.metadata);
            const quizToUpdate = res.metadata.find(
              (quiz) => quiz._id === quizTemplateId
            );
            if (quizToUpdate) {
              form.setFieldsValue({
                name: quizToUpdate?.name,
                type: quizToUpdate?.type,
                essayTitle: quizToUpdate.essay?.title,
                essayContent: quizToUpdate.essay?.content,
                attachment: quizToUpdate.essay?.attachment,
                questions: quizToUpdate.questions.map((question) => ({
                  ...question,
                  options: question.options.map((option) => ({
                    option: option,
                  })),
                  answer: question.answer,
                })),
                submissionTime: dayjs(quizToUpdate?.submissionTime),
              });
            }
            setIsLoading(false);
          } else {
            setIsLoading(false);
          }
        })
        .catch((error) => {
          console.log(error);
        });
    }
  }, [quizTemplateId, isModalOpen]);

  return (
    <React.Fragment>
      {contextHolder}
      <Button
        type="primary"
        onClick={showModal}
        className="me-3"
        style={{ width: "100%", color: "#fff", backgroundColor: "#1890ff" }}
      >
        Cập nhật
      </Button>

      <Modal
        title="Cập nhật bài tập mẫu"
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
                          <Form.List name={[field.name, "options"]}>
                            {(subFields, subMeta) => (
                              <div>
                                {subFields.map((subField, subIndex) => (
                                  <Space key={subField.key}>
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
                                      <Input placeholder="Thêm lựa chọn" />
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
                {/* <Upload {...propUpdate}>
                  <Button icon={<UploadOutlined />}>Select File</Button>
                </Upload> */}
              </>
            )}
            <div className="pt-2 text-end">
              <Button
                type="primary"
                htmlType="submit"
                style={{ color: "#fff", backgroundColor: "#1890ff" }}
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
