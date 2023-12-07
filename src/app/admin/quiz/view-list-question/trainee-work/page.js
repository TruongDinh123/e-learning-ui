"use client";
import { Typography } from "antd";
import React from "react";

const { Title, Paragraph } = Typography;
export default function StudentWork({ student }) {
  // Thay đổi nội dung này để hiển thị nội dung làm bài của học viên
  const { quiz, essayAnswer, answers, filename } = student;

  if (quiz && quiz.type === "essay") {
    // Bài tập tự luận
    return (
      <div style={{ overflow: "scroll", maxHeight: "300px" }}>
        <Title level={3}>{quiz.name}</Title>
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
      <div style={{ overflow: "scroll", maxHeight: "300px" }}>
        <Title level={3}>{quiz.name}</Title>
        {quiz.questions.map((question, index) => (
          <div key={question._id}>
            <strong>Câu {index + 1}:</strong> {question.question}
            <ul>
              {question.options.map((option, index) => (
                <li key={index}>{option}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    );
  } else {
    return <div>No quiz information available</div>;
  }
}
