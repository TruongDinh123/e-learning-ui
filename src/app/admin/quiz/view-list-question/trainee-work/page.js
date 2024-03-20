"use client";
import { Button, Empty, Modal, Typography } from "antd";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;
export default function StudentWork({ student }) {
  const { quiz, essayAnswer, filename, answers } = student;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });
  const isDesktop = useMediaQuery({ minWidth: 992 });

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const renderContent = () => {
    if (quiz && quiz.type === "essay") {
      return (
        <div className="overflow-hidden max-h-60">
          <Title level={3}>{quiz?.name}</Title>
          <div dangerouslySetInnerHTML={{ __html: essayAnswer }} />
          <div>
            <h3 className="text-lg font-bold mb-2">File đã nộp:</h3>
            <a
              href={filename}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 underline hover:text-blue-700"
            >
              Download File
            </a>
          </div>
        </div>
      );
    } else if (quiz && quiz.type === "multiple_choice") {
      // Bài tập trắc nghiệm
      return (
        <div className="overflow-auto max-h-[23rem] space-y-4">
          <h3 className="text-3xl font-bold text-indigo-600">
            Bài tập {quiz?.name}
          </h3>
          {quiz.questions.map((question, index) => {
            const studentAnswer = answers?.find((answer) =>
              answer?.hasOwnProperty(question?._id)
            );
            return (
              <div key={question._id} className="p-4 border rounded-lg shadow-sm">
                <div className="mb-2">
                  <span className="font-bold text-lg text-green-600">Câu {index + 1}:</span>
                  <span
                    className={`block overflow-hidden ${isDesktop ? "ql-editor" : ""} text-gray-700`}
                    dangerouslySetInnerHTML={{
                      __html: `${question.question}`,
                    }}
                  />
                </div>
                <ul className="list-disc pl-5 text-gray-600">
                  {question.options.map((option, index) => (
                    <li key={index} className="text-sm">
                      {index + 1}: {option}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <strong className="text-lg text-gray-800">
                    Câu trả lời của học viên:{" "}
                    <span
                      className={`font-medium ${studentAnswer ? "text-blue-500" : "text-red-500"}`}
                    >
                      {studentAnswer
                        ? studentAnswer[question._id]
                        : "Không có câu trả lời"}
                    </span>
                  </strong>
                </div>
              </div>
            );
          })}
        </div>
      );
    }
  };

  if (isMobile) {
    return (
      <div className="pl-5">
        <Button type="default" onClick={showModal}>
          Xem
        </Button>
        <Modal
          title="Bài làm của học viên"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={
            <div>
              <Button
                key="back"
                type="primary"
                onClick={handleOk}
                style={{
                  color: "#fff",
                  backgroundColor: "#1890ff",
                }}
              >
                OK
              </Button>
              <Button key="back" onClick={handleCancel}>
                Cancel
              </Button>
            </div>
          }
        >
          {renderContent()}
        </Modal>
      </div>
    );
  } else {
    return (
      <div className="m-auto">
        {renderContent()}
      </div>
    );
  }
}
