"use client";
import { Button, Empty, Modal, Typography } from "antd";
import React, { useState } from "react";
import { useMediaQuery } from "react-responsive";

const { Title } = Typography;
export default function StudentWork({ student }) {
  const { quiz, essayAnswer, filename, answers } = student;
  const [isModalVisible, setIsModalVisible] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

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
        <div className="overflow-hidden max-h-80">
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
        <div className="overflow-hidden max-h-75">
          <Title level={3} className="text-3xl">
            {quiz?.name}
          </Title>
          {quiz.questions.map((question, index) => {
            // Tìm câu trả lời của học viên cho câu hỏi này
            const studentAnswer = answers.find((answer) =>
              answer.hasOwnProperty(question._id)
            );
            return (
              <div key={question._id} className="mb-4">
                <strong className="text-lg">Câu {index + 1}:</strong>{" "}
                {question.question}
                <ul className="list-disc pl-5">
                  {question.options.map((option, index) => (
                    <li key={index} className="text-sm">
                      {index}: {option}
                    </li>
                  ))}
                </ul>
                <div className="mt-2">
                  <strong className="text-lg">Câu trả lời của học viên:</strong>{" "}
                  <span className="text-blue-500">
                    {studentAnswer[question._id]}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      );
    } else {
      return <Empty description="Dữ liệu chưa có" />;
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
    return renderContent();
  }
}
