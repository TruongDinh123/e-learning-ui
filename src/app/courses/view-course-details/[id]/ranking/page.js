"use client";
import { getStudentScoresByCourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Result, Spin, Table, message } from "antd";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import "./page.css";
export default function RankingStudent({ params }) {
  const dispatch = useDispatch();
  const router = useRouter();
  const [rankingData, setRankingData] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const userState = useSelector((state) => state.user);
  const loggedInUserId = localStorage.getItem("x-client-id");
  const isLoggedIn =
    userState.user?.status === 200 ||
    !!userState.userName ||
    userState.isSuccess;

  useEffect(() => {
    const roles =
      userState.user?.roles || userState.user?.metadata?.account?.roles;
    const isAdminState = roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );
    setIsAdmin(isAdminState);
  }, [userState.user, userState.user?.metadata?.account?.roles]);

  useEffect(() => {
    if (!isLoggedIn) {
      router.push("/login");
    }
  }, [isLoggedIn, router]);

  useEffect(() => {
    const fetchRankingData = async () => {
      setIsLoading(true);
      try {
        const rankingResponse = await dispatch(
          getStudentScoresByCourse(params?.id)
        ).then(unwrapResult);
        const rankingArray = Array.isArray(rankingResponse.metadata)
          ? rankingResponse.metadata
          : [];
        setRankingData(rankingArray);
      } catch (error) {
        message.error("Không thể lấy dữ liệu bảng xếp hạng.");
        setRankingData([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRankingData();
  }, [dispatch, params?.id]);
  const shouldShowEmailColumn = rankingData.some(
    (student) => student.email.trim() !== ""
  );

  const columns = [
    {
      title: "STT (Hạng)",
      key: "index",
      render: (text, record, index) => index + 4,
    },
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    ...(shouldShowEmailColumn
      ? [
          {
            title: "Email",
            dataIndex: "email",
            key: "email",
            render: (email) => (email ? email : null),
          },
        ]
      : []),
    {
      title: "Điểm",
      dataIndex: "totalScore",
      key: "totalScore",
    },
  ];

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold text-[#002c6a] mb-4">Xếp hạng</h1>
      {isLoading ? (
        <div className="flex justify-center items-center">
          <Spin size="large" />
        </div>
      ) : rankingData.length === 0 ? (
        <Result
          status="404"
          title="Không có dữ liệu"
          subTitle="Hiện tại không có dữ liệu xếp hạng cho khóa học này."
        />
      ) : (
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="flex sm:flex-row justify-around items-center mb-8">
            {rankingData?.slice(0, 3).map((student, index) => (
              <div
                key={student.id}
                className={`flex flex-col items-center p-2 sm:p-4 rounded-lg animate__animated ${
                  index === 0
                    ? "bg-yellow-300 text-yellow-800 animate__bounceIn"
                    : index === 1
                    ? "bg-gray-300 text-gray-800 animate__bounceInUp"
                    : "bg-orange-300 text-orange-800 animate__bounceInLeft"
                }`}
                style={{
                  boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                  transition: "transform 0.2s",
                  position: "relative",
                }}
              >
                {index < 3 && (
                  <div
                    className={`absolute -top-3 -right-3 w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white text-lg font-bold ${
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
                    {index === 1 ? "🥈" : index === 0 ? "🥇" : "🥉"}
                  </div>
                )}
                <span className="text-3xl sm:text-4xl font-bold">
                  {index + 1}
                </span>
                <span className="text-md sm:text-lg font-semibold">
                  {student.name}
                </span>
                <span className="text-sm sm:text-md">{student.totalScore}</span>
              </div>
            ))}
          </div>
          {rankingData.length > 3 && (
            <div className="bg-white shadow-md rounded-lg overflow-hidden">
              <Table
                dataSource={rankingData.slice(3)}
                columns={columns}
                rowKey="email"
                rowClassName={(record, index) => {
                  return record._id === loggedInUserId ? "highlight-row" : "";
                }}
                pagination={false}
                scroll={{ x: 400 }}
                style={{
                  backgroundColor: "#f0f2f5",
                }}
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}
