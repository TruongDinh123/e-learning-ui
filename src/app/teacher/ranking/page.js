"use client";
import { Table } from "antd";
import React from "react";

const rankingData = [
    { id: 1, name: "Nguyễn Trí Bảo Thắng", score: 169 },
    { id: 2, name: "Lê Duy Hải", score: 107 },
    { id: 3, name: "Nguyễn Võ Hoàng Sơn", score: 102 },
    { id: 4, name: "Trần Thị Lan Anh", score: 98 },
    { id: 5, name: "Phạm Hữu Lộc", score: 96 },
    { id: 6, name: "Lê Quốc Tú", score: 95 },
    { id: 7, name: "Nguyễn Minh Hằng", score: 93 },
    { id: 8, name: "Võ Thị Kim Liên", score: 90 },
    { id: 9, name: "Trần Hoàng Nam", score: 88 },
    { id: 10, name: "Nguyễn Thị Bích Tuyền", score: 85 },
    { id: 11, name: "Phan Thị Minh Châu", score: 83 },
    { id: 12, name: "Hoàng Minh Tuấn", score: 82 },
    { id: 13, name: "Lưu Đức Hoa", score: 80 },
    { id: 14, name: "Nguyễn Hồng Nhung", score: 78 },
    { id: 15, name: "Trần Ngọc Ánh", score: 76 },
    { id: 16, name: "Lê Thị Hồng Gam", score: 74 },
    { id: 17, name: "Nguyễn Đức Thịnh", score: 72 },
    { id: 18, name: "Phạm Văn Bình", score: 70 },
    { id: 19, name: "Đỗ Minh Quân", score: 68 },
    { id: 20, name: "Bùi Thị Lan", score: 66 },
];

export default function RankingStudent() {
  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Điểm",
      dataIndex: "score",
      key: "score",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#13C57C] mb-4">Xếp hạng</h1>
      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="flex justify-around items-center mb-8">
          {rankingData.slice(0, 3).map((student, index) => (
            <div
              key={student.id}
              className={`flex flex-col items-center p-4 rounded-lg animate__animated ${
                index === 0
                  ? "bg-yellow-300 text-yellow-800 animate__bounceIn"
                  : index === 1
                  ? "bg-gray-300 text-gray-800 animate__bounceInUp"
                  : "bg-orange-300 text-orange-800 animate__bounceInLeft"
              }`}
              style={{
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                transition: "transform 0.2s",
                position: "relative", // Add position relative for the badge positioning
              }}
            >
              {index < 3 && (
                <div
                className={`absolute -top-3 -right-3 w-10 h-10 flex items-center justify-center rounded-full text-white text-lg font-bold ${
                  index === 0
                    ? "bg-[#13C57C]"
                    : index === 1
                    ? "bg-[#13C57C]"
                    : "bg-[#13C57C]"
                }`}
                style={{
                  boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
                }}
              >
                {index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
              </div>
              )}
              <span className="text-4xl font-bold">{index + 1}</span>
              <span className="text-lg font-semibold">{student.name}</span>
              <span className="text-md">{student.score}</span>
            </div>
          ))}
        </div>
        <Table
          dataSource={rankingData}
          columns={columns}
          rowKey="email"
          rowClassName={(record, index) => (index < 3 ? "top-ranking-row" : "")}
          pagination={false}
          scroll={{ x: 400 }}
          style={{
            backgroundColor: '#f0f2f5',
          }}
        />
      </div>
    </div>
  );
}
