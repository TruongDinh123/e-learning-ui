"use client";
import {
  Button,
  Spin,
  Layout,
  Menu,
  Breadcrumb,
  theme,
  Image,
  Badge,
  Empty,
  message,
} from "antd";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  getQuizzesByStudentAndCourse,
  getScoreByInfo,
  startQuiz,
} from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import React from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import {
  createNotification,
  getACourseByInfo,
} from "@/features/Courses/courseSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { DateTime } from "luxon";

const avatar = "/images/imagedefault.jpg";
const { Sider, Content, Header } = Layout;

export default function ViewQuiz({ params }) {
  const dispatch = useDispatch();
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  const [dataCourse, setDataCourse] = useState([]);
  const [isLoading, setLoading] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState("2");
  const [collapsed, setCollapsed] = useState(false);
  const [nonExpiredCount, setNonExpiredCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [allCourseCount, setAllCourse] = useState(0);
  const [isAdminOrMentorSidebar, setIsAdminOrMentor] = useState(false);
  const [isLoadingRoleCheck, setIsLoadingRoleCheck] = useState(true);
  const router = useRouter();

  const quizzesByStudentState = useSelector(
    (state) => state.quiz.getQuizzesByStudentAndCourse.metadata
  );
  const getScoreState = useSelector(
    (state) => state.quiz.getScoreState.metadata
  );

  const getACourseState = useSelector((state) => state.course.Acourse.metadata);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [quizzesResult, scoreResult, courseResult] = await Promise.all([
          quizzesByStudentState
            ? Promise.resolve({ status: true, metadata: quizzesByStudentState })
            : dispatch(
                getQuizzesByStudentAndCourse({ courseId: params?.id })
              ).then(unwrapResult),
          getScoreState
            ? Promise.resolve({ status: true, metadata: getScoreState })
            : dispatch(getScoreByInfo()).then(unwrapResult),
          getACourseState
            ? Promise.resolve({ status: true, metadata: getACourseState })
            : dispatch(getACourseByInfo(params?.id)).then(unwrapResult),
        ]);

        if (quizzesResult.status) {
          setquiz(quizzesResult.metadata);
        }

        if (scoreResult.status) {
          setScore(scoreResult.metadata);
        }

        if (courseResult.status) {
          setDataCourse(courseResult.metadata);
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [
    dispatch,
    params?.id,
    quizzesByStudentState,
    getScoreState,
    getACourseState,
  ]);

  useEffect(() => {
    dispatch(getQuizzesByStudentAndCourse({ courseId: params?.id }));
    dispatch(getScoreByInfo());
    dispatch(getACourseByInfo(params?.id));
  }, [dispatch, params?.id]);

  useEffect(() => {
    setSelectedMenu("2");
  }, [router]);

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

  const filteredQuizzes = quiz.filter(
    (quiz) =>
      quiz?.courseIds.some((course) => course._id === params?.id) ||
      quiz?.lessonId?.courseId._id === params?.id
  );

  const handleStartQuiz = async (quizId, quizType) => {
    setLoading(true);
    try {
      const response = await dispatch(startQuiz({ quizId })).then(unwrapResult);
      if (response.status) {
        setLoading(false);
        setTimeout(() => {
          const quizPage =
            quizType === "multiple_choice"
              ? "submit-quiz"
              : "handle-submit-essay";
          const path = `/courses/view-details/${quizPage}/${quizId}`;
          router.push(path);
        }, 100);
      } else {
        setLoading(false);
      }
    } catch (error) {
      message.error(error.response?.data?.message, 3.5);
      setLoading(false);
    }
  };

  //check roles
  const userState = useSelector((state) => state?.user?.user);
  useEffect(() => {
    const roles = userState?.roles || userState?.metadata?.account?.roles;

    const checkIsAdminOrMentor = roles?.some(
      (role) =>
        role.name === "Admin" ||
        role.name === "Super-Admin" ||
        role.name === "Mentor"
    );

    setIsAdminOrMentor(checkIsAdminOrMentor);
    setIsLoadingRoleCheck(false);
  }, [userState]);

  useEffect(() => {
    // Giả sử userId là ID của người dùng hiện tại
    const userId = localStorage?.getItem("x-client-id"); // Sử dụng giá trị thực tế của userId

    if(isAdminOrMentorSidebar) return;

    // Đảm bảo rằng dataCourse và dataCourse.students tồn tại trước khi kiểm tra
    if (dataCourse && Array.isArray(dataCourse.students)) {
      const isStudentOfCourse = dataCourse.students.some(
        (student) => student._id === userId.toString()
      );
      console.log("🚀 ~ isStudentOfCourse:", isStudentOfCourse);

      // Nếu không nằm trong mảng, hiển thị thông báo
      if (!isStudentOfCourse) {
        router.push("/");
      }
    }
  }, [dataCourse, message]);

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
                  className="custom-button"
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
              <h2 className="text-lg font-semibold text-gray-700">Thông báo</h2>
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

  // Component hiển thị khóa học chưa hoàn thành
  const ExpiredCoursesComponent = () => {
    const notCompletedQuizzes = filteredQuizzes
      ?.filter((i) => {
        const correspondingScore = score.find((s) => s.quiz?._id === i?._id);
        return !correspondingScore?.isComplete;
      })
      .map((i, index) => {
        return {
          key: index + 1,
          name: i?.name,
          submissionTime: i?.submissionTime
            ? DateTime.fromISO(i?.submissionTime)
                .setLocale("vi")
                .toLocaleString(DateTime.DATETIME_SHORT)
            : null,
          isComplete: "Chưa hoàn thành",
          type: i?.type,
          questions: (
            <Button
              className="w-full text-white custom-button bg-blue-500 hover:bg-blue-600 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 text-center"
              style={{ width: "100%" }}
              onClick={() => handleStartQuiz(i?._id, i?.type)}
            >
              Làm bài tập
            </Button>
          ),
        };
      });

    useEffect(() => {
      setExpiredCount(notCompletedQuizzes.length);
    }, [notCompletedQuizzes]);

    return notCompletedQuizzes.length > 0 ? (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
        {notCompletedQuizzes.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
          >
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-2 truncate">
                {item.name}
              </h5>
              <p className="text-sm text-gray-500 mb-4">
                Hạn nộp bài:{" "}
                {item?.submissionTime ? item.submissionTime : "Không có"}
              </p>
              <div className="flex items-center justify-between mb-4">
                <Badge
                  status={
                    item.isComplete === "Đã hoàn thành" ? "success" : "error"
                  }
                  text={item.isComplete}
                />
              </div>
              <div className="text-right">{item.questions}</div>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "calc(50vh)" }}
      >
        <Empty description="Không có bài tập" />
      </div>
    );
  };

  // Component hiển thị khóa học hoàn thành
  const NonExpiredCoursesComponent = () => {
    const completedQuizzes = filteredQuizzes
      ?.filter((i) => {
        const correspondingScore = score.find((s) => s.quiz?._id === i?._id);
        return correspondingScore?.isComplete;
      })
      .map((i, index) => ({
        key: index + 1,
        name: i?.name,
        submissionTime: i?.submissionTime
          ? DateTime.fromISO(i?.submissionTime)
              .setLocale("vi")
              .toLocaleString(DateTime.DATETIME_SHORT)
          : null,
        isComplete: "Đã hoàn thành",
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
      }));

    useEffect(() => {
      setNonExpiredCount(completedQuizzes.length);
    }, [completedQuizzes]);

    return completedQuizzes.length > 0 ? (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-2">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin />
          </div>
        ) : (
          <>
            {completedQuizzes.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2 truncate">
                    {item.name}
                  </h5>
                  <p className="text-sm text-gray-500 mb-4">
                    Hạn nộp bài:{" "}
                    {item?.submissionTime ? item.submissionTime : "Không có"}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-semibold ${
                        item.isLessonQuiz ? "text-blue-500" : "text-green-500"
                      }`}
                    >
                      {item.isLessonQuiz
                        ? "Bài tập bài học"
                        : "Bài tập khóa học"}
                    </span>
                    <Badge
                      status={
                        item.isComplete === "Đã hoàn thành"
                          ? "success"
                          : "error"
                      }
                      text={item.isComplete}
                    />
                  </div>
                  <div className="text-right">
                    <Button
                      className="w-full text-white bg-green-500 hover:bg-green-600 focus:ring-4 focus:ring-green-300 font-medium rounded-lg text-sm px-5 text-center"
                      onClick={() =>
                        item.type === "multiple_choice"
                          ? router.push(
                              `/courses/view-details/submit-quiz/${item._id}`
                            )
                          : router.push(
                              `/courses/view-details/handle-submit-essay/${item._id}`
                            )
                      }
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    ) : (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "calc(50vh)" }}
      >
        <Empty description="Không có bài tập nào hoàn thành" />
      </div>
    );
  };

  const AllQuizzesComponent = () => {
    // Lấy ra thông tin của tất cả các khóa học từ store
    const allCourses = useSelector((state) => state.course.courses.metadata);

    // Tìm khóa học tương ứng dựa vào params?.id
    const currentCourse = allCourses?.find(
      (course) => course._id === params?.id
    );

    // Sử dụng useMemo để memoize giá trị của allQuizzes
    const allQuizzes = useMemo(() => {
      // Lấy ra danh sách các bài quiz của khóa học tương ứng
      const courseQuizzes = currentCourse ? currentCourse.quizzes : [];

      // Lấy ra danh sách các bài quiz từ mỗi bài học trong khóa học
      const lessonQuizzes = currentCourse
        ? currentCourse.lessons.flatMap((lesson) => lesson.quizzes)
        : [];

      return [...courseQuizzes, ...lessonQuizzes];
    }, [currentCourse]);

    useEffect(() => {
      setAllCourse(allQuizzes.length);
    }, [allQuizzes]);
    return allQuizzes.length > 0 ? (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-4">
        {isLoading ? (
          <div className="flex justify-center items-center h-screen">
            <Spin />
          </div>
        ) : (
          <>
            {allQuizzes.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
              >
                <div className="p-4">
                  <h5 className="text-lg font-semibold mb-2 truncate">
                    {item.name}
                  </h5>
                  <p className="text-sm text-gray-500 mb-4">
                    Hạn nộp bài:{" "}
                    {item?.submissionTime
                      ? format(
                          new Date(item?.submissionTime),
                          "dd/MM/yyyy HH:mm:ss"
                        )
                      : "Không có"}
                  </p>
                  <div className="flex items-center justify-between mb-4">
                    <span
                      className={`text-xs font-semibold ${
                        item.isLessonQuiz ? "text-blue-500" : "text-green-500"
                      }`}
                    >
                      {item.isLessonQuiz
                        ? "Bài tập bài học"
                        : "Bài tập khóa học"}
                    </span>
                    <Badge
                      status={
                        item.isComplete === "Đã hoàn thành"
                          ? "success"
                          : "error"
                      }
                      text={item.isComplete}
                    />
                  </div>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    ) : (
      <div
        className="flex justify-center items-center"
        style={{ minHeight: "calc(50vh)" }}
      >
        <Empty description="Không có bài tập nào" />
      </div>
    );
  };

  const renderContentBasedOnRole = () => {
    if (isLoadingRoleCheck) {
      return <Spin />;
    } else if (isAdminOrMentorSidebar) {
      return <AllQuizzesComponent />;
    } else {
      return {
        1: (collapsed || !isMobile) && <NotificationsComponent />,
        2: (collapsed || !isMobile) && <ExpiredCoursesComponent />,
        3: (collapsed || !isMobile) && <NonExpiredCoursesComponent />,
      }[selectedMenu];
    }
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
      <Breadcrumb className="mt-9">
        <Breadcrumb.Item>
          <Link href="/">Trang chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/courses/view-course`}>Khóa học của tôi</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <Link href={`/courses/view-course-details/${params?.id}`}>
            {dataCourse.name}
          </Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>
          <span className="font-medium">Danh sách bài tập</span>
        </Breadcrumb.Item>
      </Breadcrumb>
      <header
        className="flex flex-col md:flex-row justify-between items-center bg-gray-100 dark:bg-gray-800 p-4 md:p-6"
        style={{
          background:
            "linear-gradient(180deg, rgba(201, 144, 30, 0) 0%, rgba(255, 192, 67, 0.108) 100%)",
        }}
      >
        <div className="flex flex-col md:w-1/2 space-y-2 border-gray-200 dark:border-gray-300">
          <h1 className="text-3xl text-[#002c6a]">
            {" "}
            <span className="font-medium">{dataCourse?.name}</span>
          </h1>
        </div>
        <div className="md:flex-row justify-between items-center p-4 md:p-6">
          <div className="flex flex-col md:flex-row items-center gap-4 md:gap-8">
            {dataCourse?.teacher ? (
              <img
                alt="Teacher's avatar"
                className="rounded-full"
                src={dataCourse?.teacher?.image_url || avatar}
                style={{
                  width: "64px",
                  height: "64px",
                  objectFit: "cover",
                }}
              />
            ) : null}
            <div className="flex flex-col justify-center">
              <div className="text-lg font-medium">
                {dataCourse?.teacher?.lastName} {dataCourse?.teacher?.firstName}
              </div>
              <div className="text-gray-500">{dataCourse?.teacher?.email}</div>
            </div>
          </div>
        </div>
      </header>
      <Layout
        style={{
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
          width={250}
          trigger={null}
          collapsible
          collapsed={collapsed}
        >
          <div className="demo-logo-vertical" />
          <Menu
            defaultOpenKeys={["sub1"]}
            mode="inline"
            selectedKeys={[selectedMenu]}
            onSelect={({ key }) => setSelectedMenu(key)}
            style={{
              height: "100%",
            }}
          >
            <Menu.Item key="1">Thông báo</Menu.Item>
            <Menu.SubMenu key="sub1" title="Bài tập">
              {isAdminOrMentorSidebar ? (
                <Menu.Item key="2">
                  Tất cả {allCourseCount > 0 ? `[${allCourseCount}]` : ""}
                </Menu.Item>
              ) : (
                <>
                  <Menu.Item key="2">
                    Chưa hoàn thành{" "}
                    {expiredCount > 0 ? `[${expiredCount}]` : ""}
                  </Menu.Item>
                  <Menu.Item key="3">
                    Hoàn thành{" "}
                    {nonExpiredCount > 0 ? `[${nonExpiredCount}]` : ""}
                  </Menu.Item>
                </>
              )}
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
              renderContentBasedOnRole()
            )}
          </Content>
        </Layout>
      </Layout>
    </Content>
  );
}
