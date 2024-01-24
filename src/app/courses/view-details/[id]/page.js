"use client";
import {
  Button,
  Table,
  Spin,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Image,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getQuizsByCourse,
  getQuizzesByStudentAndCourse,
  getScore,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useRouter } from "next/navigation";
import { format, getTime } from "date-fns";
import { createNotification, getACourse } from "@/features/Courses/courseSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { isAdmin, isMentor } from "@/middleware";

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
        if (res?.status) {
          setquiz(res.data?.metadata);
        }
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
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
      .catch((error) => {});
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
      });
  }, []);

  const userState = useSelector((state) => state?.user?.user);
  const isAdminState = userState?.roles?.some(
    (role) =>
      role.name === "Admin" ||
      role.name === "Super-Admin" ||
      role.name === "Mentor"
  );

  const checkUserRole = () => {
    try {
      if (isAdminState) {
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
          });
      }
    } catch (error) {
      window.location.reload();
    }
  };

  useEffect(() => {
    checkUserRole();
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
  const NotificationsComponent = () => {
    const textareaRef = useRef(null);
    const isAdminOrMentor = userState?.roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );

    return (
      <>
        <div className="w-full p-2">
          {isAdminOrMentor && (
            <div className="bg-white flex flex-col sm:flex-row p-4 rounded-lg card-shadow border-t border-b border-l border-r">
              <textarea
                className="w-full p-2 rounded border-gray-300"
                rows="4"
                placeholder="Thông báo nội dung nào đó cho lớp học của bạn"
                ref={textareaRef}
              ></textarea>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  marginTop: "20px",
                  paddingLeft: "10px",
                }}
              >
                <Button
                  type="primary"
                  shape="round"
                  size="large"
                  style={{ color: "#fff", backgroundColor: "#1890ff" }}
                  onClick={(e) => {
                    handleNoti({ message: textareaRef.current.value });
                    textareaRef.current.value = "";
                  }}
                >
                  Gửi thông báo
                </Button>
              </div>
            </div>
          )}
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
                    <Image fallback="data:image/png;base64,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" />
                  </div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Giáo viên: {dataCourse?.teacher.lastName}
                    <span className="text-sm text-gray-500">
                      {format(new Date(noti?.date), "HH:mm:ss")}
                    </span>
                  </p>
                </div>

                <p className="text-gray-600">{noti?.message}</p>
              </div>
            ))}
          </div>
        </div>
      </>
    );
  };

  // Component hiển thị khóa học hết hạn
  const ExpiredCoursesComponent = () => {
    const expiredCourses = [];

    quiz?.forEach((i, index) => {
      const correspondingScore = score.find((s) => s.quiz?._id === i?._id);

      const submissionTime = i?.submissionTime
        ? getTime(new Date(i?.submissionTime))
        : null;

      const currentDate = getTime(new Date());

      if (submissionTime < currentDate) {
        expiredCourses.push({
          key: index + 1,
          name: i?.name,
          submissionTime: format(
            new Date(submissionTime),
            "dd/MM/yyyy HH:mm:ss"
          ),
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
                {/* <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                  <i className="fas fa-book-open text-white"></i>
                </div> */}
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
        ? getTime(new Date(i?.submissionTime))
        : null;

      console.log("🚀 ~ submissionTime:", submissionTime);
      const currentDate = getTime(new Date());
      console.log("🚀 ~ currentDate:", currentDate);

      if (!submissionTime || submissionTime > currentDate) {
        nonExpiredCourses.push({
          key: index + 1,
          name: i?.name,
          submissionTime: format(
            new Date(submissionTime),
            "dd/MM/yyyy HH:mm:ss"
          ),
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
                {/* <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center">
                  <i className="fas fa-book-open text-white"></i>
                </div> */}
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

  const isMobile = useMediaQuery({ maxWidth: "768px" });

  return (
    <Content
      style={{
        padding: "0 24px",
        paddingBottom: "100px",
      }}
    >
      <Breadcrumb className="my-9">
        <Breadcrumb.Item>
          <Link href="/courses/view-course">Khóa học</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/courses/lessons/${params.id}`}>Bài học</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span href={`/courses/view-details/${params?.id}`}>
            {dataCourse.name}
          </span>
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
            <Menu.SubMenu key="sub1" title="Bài tập">
              <Menu.Item key="2">Hết hạn</Menu.Item>
              <Menu.Item key="3">Chưa hết hạn</Menu.Item>
            </Menu.SubMenu>
          </Menu>
        </Sider>
        <Layout>
          <Header
            style={{
              paddingBottom: 0,
              paddingLeft: 0,
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
                1: (collapsed || !isMobile) && <NotificationsComponent />,
                2: (collapsed || !isMobile) && <ExpiredCoursesComponent />,
                3: (collapsed || !isMobile) && <NonExpiredCoursesComponent />,
              }[selectedMenu]
            )}
          </Content>
        </Layout>
      </Layout>
    </Content>
  );
}
