"use client";
import { Button, Table, Spin, Layout, Menu, Breadcrumb, theme } from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getQuizsByCourse,
  getQuizzesByStudentAndCourse,
  getScore,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { createNotification, getACourse } from "@/features/Courses/courseSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";

const { Sider, Content, Header } = Layout;

export default function ViewQuiz({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  const [dataCourse, setDataCourse] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("1");
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    dispatch(getQuizzesByStudentAndCourse({ courseId: params?.id }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setquiz(res.metadata);
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  useEffect(() => {
    dispatch(getScore())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setScore(res.metadata);
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    dispatch(getACourse(params?.id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setDataCourse(res?.metadata);
          setLoading(false);
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  }, []);

  const userState = useSelector((state) => state?.user?.user);

  useEffect(() => {
    if (
      userState?.metadata?.account?.roles.includes("Admin") ||
      userState?.metadata?.account?.roles.includes("Mentor")
    ) {
      setLoading(true);
      dispatch(getQuizsByCourse({ courseId: params?.id }))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            setquiz(res.metadata);
          } else {
          }
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          console.log(error);
        });
    }
  }, [userState]);

  const handleNoti = ({ message }) => {
    dispatch(createNotification({ courseId: params?.id, message }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setDataCourse((prevDataCourse) => ({
            ...prevDataCourse,
            notifications: [
              ...prevDataCourse.notifications,
              { message, date: new Date() },
            ],
          }));
        } else {
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        console.log(error);
      });
  };

  let data = [];
  quiz?.forEach((i, index) => {
    const correspondingScore = score.find((s) => s.quiz?._id === i?._id);

    data.push({
      key: index + 1,
      name: i?.name,
      submissionTime: i?.submissionTime
        ? format(new Date(i?.submissionTime), "dd/MM/yyyy HH:mm:ss")
        : "Không có hạn",
      isComplete: correspondingScore
        ? correspondingScore.isComplete
          ? "Đã hoàn thành"
          : "Chưa hoàn thành"
        : "Chưa hoàn thành",
      type: i?.type,
      questions: (
        <Button
          className="me-3"
          style={{ width: "100%" }}
          onClick={() =>
            i?.type === "multiple_choice"
              ? router.push(`/courses/view-details/submit-quiz/${i?._id}`)
              : router.push(
                  `/courses/view-details/handle-submit-essay/${i?._id}`
                )
          }
        >
          Xem chi tiết
        </Button>
      ),
    });
  });

  // Component hiển thị thông báo
  const NotificationsComponent = () => (
    <>
      <div className="w-full p-2">
        <div className="bg-white flex flex-col sm:flex-row p-4 rounded-lg card-shadow border-t border-b border-l border-r">
          <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center mb-4 sm:mb-0 sm:mr-4">
            <i className="fas fa-book-open text-white"></i>
          </div>
          <textarea
            className="w-full p-2 rounded border-gray-300"
            rows="4"
            placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleNoti({ message: e.target.value });
                e.target.value = "";
              }
            }}
          ></textarea>
        </div>
      </div>
      <div className="w-full p-2">
        <div className="bg-white flex flex-col p-6 rounded-lg shadow-md border border-gray-200">
          <div className="flex items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-700">
              Notifications
            </h2>
          </div>
          {dataCourse?.notifications?.map((noti, notiIndex) => (
            <div
              key={notiIndex}
              className="w-full p-4 mb-4 rounded border border-gray-300 bg-gray-50"
            >
              <div className="flex flex-col sm:flex-row">
                <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center mr-4 mb-2 sm:mb-0">
                  <i className="fas fa-book-open text-white"></i>
                </div>
                <p className="mb-2 font-semibold text-gray-700">
                  Giáo viên: {dataCourse?.teacher.lastName}
                  <p className="text-sm text-gray-500">
                    {format(new Date(noti?.date), "HH:mm:ss")}
                  </p>
                </p>
              </div>

              <p className="text-gray-600">{noti?.message}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );

  // Component hiển thị khóa học hết hạn
  const ExpiredCoursesComponent = () => {
    const expiredCourses = [];

    quiz?.forEach((i, index) => {
      const correspondingScore = score.find((s) => s.quiz?._id === i?._id);
      const submissionTime = i?.submissionTime
        ? format(new Date(i?.submissionTime), "dd/MM/yyyy HH:mm:ss")
        : "Không có hạn";

      if (submissionTime < format(new Date(), "dd/MM/yyyy HH:mm:ss")) {
        expiredCourses.push({
          key: index + 1,
          name: i?.name,
          submissionTime: submissionTime,
          isComplete: correspondingScore
            ? correspondingScore.isComplete
              ? "Đã hoàn thành"
              : "Chưa hoàn thành"
            : "Chưa hoàn thành",
          type: i?.type,
          questions: (
            <Button
              className="me-3"
              style={{ width: "100%" }}
              onClick={() =>
                i?.type === "multiple_choice"
                  ? router.push(`/courses/view-details/submit-quiz/${i?._id}`)
                  : router.push(
                      `/courses/view-details/handle-submit-essay/${i?._id}`
                    )
              }
            >
              Xem chi tiết
            </Button>
          ),
        });
      }
    });

    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2">
        {expiredCourses.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg card-shadow border-t border-b border-l border-r border-gray-300 w-full"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                  <i className="fas fa-book-open text-white"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm">Bài tập mới: {item.name}</p>
                  <p className="text-xs text-gray-600">
                    Hạn nộp bài: {item?.submissionTime}
                  </p>
                </div>
              </div>
              <div className="text-gray-600">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="mt-4 border-t pt-4 p-4">{item.questions}</div>
          </div>
        ))}
      </div>
    );
  };

  // Component hiển thị khóa học chưa hết hạn
  const NonExpiredCoursesComponent = () => {
    const nonExpiredCourses = [];

    quiz?.forEach((i, index) => {
      const correspondingScore = score.find((s) => s.quiz?._id === i?._id);
      const submissionTime = i?.submissionTime
        ? format(new Date(i?.submissionTime), "dd/MM/yyyy HH:mm:ss")
        : "Không có hạn";

      if (submissionTime >= format(new Date(), "dd/MM/yyyy HH:mm:ss")) {
        nonExpiredCourses.push({
          key: index + 1,
          name: i?.name,
          submissionTime: submissionTime,
          isComplete: correspondingScore
            ? correspondingScore.isComplete
              ? "Đã hoàn thành"
              : "Chưa hoàn thành"
            : "Chưa hoàn thành",
          type: i?.type,
          questions: (
            <Button
              className="me-3"
              style={{ width: "100%" }}
              onClick={() =>
                i?.type === "multiple_choice"
                  ? router.push(`/courses/view-details/submit-quiz/${i?._id}`)
                  : router.push(
                      `/courses/view-details/handle-submit-essay/${i?._id}`
                    )
              }
            >
              Xem chi tiết
            </Button>
          ),
        });
      }
    });

    return (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2">
        {nonExpiredCourses.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg card-shadow border-t border-b border-l border-r border-gray-300 w-full"
          >
            <div className="flex items-center justify-between p-4">
              <div className="flex items-center">
                <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                  <i className="fas fa-book-open text-white"></i>
                </div>
                <div className="ml-4">
                  <p className="text-sm">Bài tập mới: {item.name}</p>
                  <p className="text-xs text-gray-600">
                    Hạn nộp bài: {item?.submissionTime}
                  </p>
                </div>
              </div>
              <div className="text-gray-600">
                <i className="fas fa-ellipsis-v"></i>
              </div>
            </div>
            <div className="mt-4 border-t pt-4 p-4">{item.questions}</div>
          </div>
        ))}
      </div>
    );
  };

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  return (
    <Content
      style={{
        padding: "0 24px",
        paddingBottom: "100px",
      }}
    >
      <Breadcrumb
        style={{
          margin: "16px 0",
        }}
      >
        <Breadcrumb.Item>
          <Link href="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href="/courses/view-course">Khóa học của bạn</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/courses/view-details/${params?.id}`}>
            {dataCourse.name}
          </Link>
        </Breadcrumb.Item>
      </Breadcrumb>
      <Layout
        style={{
          padding: "24px 0",
          background: colorBgContainer,
          borderRadius: borderRadiusLG,
        }}
      >
        <Sider
          style={{
            background: colorBgContainer,
          }}
          breakpoint="lg"
          collapsedWidth="0"
          width={200}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <Menu
            mode="inline"
            defaultSelectedKeys={["1"]}
            onSelect={({ key }) => setSelectedMenu(key)}
            style={{
              height: "100%",
            }}
          >
            <Menu.Item key="1">Thông báo</Menu.Item>
            <Menu.SubMenu key="sub1" title="Khóa học">
              <Menu.Item key="2">Khóa học hết hạn</Menu.Item>
              <Menu.Item key="3">Khóa học chưa hết hạn</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              padding: 0,
              background: colorBgContainer,
            }}
          >
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
              style={{
                fontSize: "16px",
                width: 64,
                height: 64,
              }}
            />
          </Header>
          <Content
            style={{
              padding: "0 24px",
              minHeight: 280,
            }}
          >
            {isLoading ? (
              <div className="flex justify-center items-center h-screen">
                <Spin />
              </div>
            ) : (
              // Hiển thị nội dung dựa trên mục menu được chọn
              {
                1: <NotificationsComponent />,
                2: <ExpiredCoursesComponent />,
                3: <NonExpiredCoursesComponent />,
              }[selectedMenu]
            )}
          </Content>
        </Layout>
      </Layout>
    </Content>
  );
}
