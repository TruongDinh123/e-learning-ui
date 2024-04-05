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
  Tooltip,
  Modal,
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
  viewCourses,
  getCourseSummary,
} from "@/features/Courses/courseSlice";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useMediaQuery } from "react-responsive";
import { DateTime } from "luxon";

const avatar = "/images/imagedefault.jpg";
const { Sider, Content, Header } = Layout;

export default function ViewQuiz({ params }) {
  const [isLoading, setLoading] = useState([]);
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [quiz, setquiz] = useState([]);
  const [score, setScore] = useState([]);
  const [dataCourse, setDataCourse] = useState([]);
  console.log("🚀 ~ dataCourse:", dataCourse);
  const ArrDataCourse = [dataCourse?.teacher];
  const [coursesData, setCoursesData] = useState([]);
  const [apiCourses, setApiCourses] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState("2");
  const [collapsed, setCollapsed] = useState(false);
  const [nonExpiredCount, setNonExpiredCount] = useState(0);
  const [expiredCount, setExpiredCount] = useState(0);
  const [allCourseCount, setAllCourse] = useState(0);
  const [isAdminOrMentorSidebar, setIsAdminOrMentor] = useState(false);
  const [isLoadingRoleCheck, setIsLoadingRoleCheck] = useState(true);
  const [isLoadingAlQuizzesComponent, setIsLoadingAlQuizzesComponent] =
    useState(true);

  const router = useRouter();

  // const quizzesByStudentState = useSelector(
  //   (state) => state.quiz.getQuizzesByStudentAndCourse.metadata
  // );

  // const getScoreState = useSelector(
  //   (state) => state.quiz.getScoreState.metadata
  // );

  // const getACourseState = useSelector((state) => state.course.Acourse.metadata);

  // image
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getCourseSummary()).then(unwrapResult);
        if (res.status) {
          const desiredCourse = res.metadata.find(
            (course) => course._id === params?.id
          );
          if (desiredCourse) {
            setCourse(desiredCourse);
          }
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, params?.id]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Gọi các hàm dispatch và chờ cho đến khi chúng hoàn thành, sử dụng Promise.all
        const [quizzesByStudentState1, getScoreState1, getACourseState1] =
          await Promise.all([
            dispatch(getQuizzesByStudentAndCourse({ courseId: params?.id })),
            dispatch(getScoreByInfo()),
            dispatch(getACourseByInfo(params?.id)),
          ]);

        // Lưu trữ dữ liệu vào state khi fetch thành công
        setquiz(quizzesByStudentState1.payload.metadata);
        setScore(getScoreState1.payload.metadata);
        setDataCourse(getACourseState1.payload.metadata);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [dispatch, params?.id]);

  // // còn gọi api 4 lần
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setLoading(true);
  //     try {
  //       // thực hiện 3 cái cùng lúc
  //       // nếu tồn tại dữ liệu thì hiện status: true và metadata = dữ liệu tương ứng
  //       // còn không tồn tại dữ liệu từ trước: thì truyền id nhận từ params vào tiền hành call api để lấy dữ liệu
  //       const [quizzesResult, scoreResult, courseResult] = await Promise.all([
  //         quizzesByStudentState
  //           ? Promise.resolve({ status: true, metadata: quizzesByStudentState })
  //           : dispatch(
  //               getQuizzesByStudentAndCourse({ courseId: params?.id })
  //             ).then(unwrapResult),
  //         getScoreState
  //           ? Promise.resolve({ status: true, metadata: getScoreState })
  //           : dispatch(getScoreByInfo()).then(unwrapResult),
  //         getACourseState
  //           ? Promise.resolve({ status: true, metadata: getACourseState })
  //           : dispatch(getACourseByInfo(params?.id)).then(unwrapResult),
  //       ]);

  //       // nếu đã có dữ liệu thì khi đó status = true thì thực hiện
  //       // bắt đầu set dữ liệu tương ứng vào
  //       if (quizzesResult.status) {
  //         setquiz(quizzesResult.metadata);
  //       }

  //       if (scoreResult.status) {
  //         setScore(scoreResult.metadata);
  //       }

  //       if (courseResult.status) {
  //         setDataCourse(courseResult.metadata);
  //       }
  //     } catch (error) {
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [
  //   dispatch,
  //   params?.id,
  //   quizzesByStudentState,
  //   getScoreState,
  //   getACourseState,
  // ]);

  // // -------gấy ra vấn đề call api nhiều lần 9 lần-----------
  // useEffect(() => {
  //   dispatch(getQuizzesByStudentAndCourse({ courseId: params?.id }));
  //   dispatch(getScoreByInfo());
  //   dispatch(getACourseByInfo(params?.id));
  // }, [dispatch, params?.id]);

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

    if (isAdminOrMentorSidebar) return;

    // Đảm bảo rằng dataCourse và dataCourse.students tồn tại trước khi kiểm tra
    if (dataCourse && Array.isArray(dataCourse.students)) {
      const isStudentOfCourse = dataCourse.students.some(
        (student) => student._id === userId.toString()
      );

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
            {ArrDataCourse?.map((noti, notiIndex) => (
              <div
                key={notiIndex}
                className="w-full p-4 mb-4 rounded border border-gray-300 bg-gray-50"
              >
                <div className="flex flex-col sm:flex-row">
                  <div className="rounded-full h-8 w-8 bg-teal-500 flex items-center justify-center mr-4 mb-2 sm:mb-0">
                    <Image src={noti?.image_url} />
                  </div>
                  <p className="mb-2 font-semibold text-gray-700">
                    Giáo viên: {noti?.lastName}
                    <span className="text-sm text-gray-500">
                      {/* {format(new Date(noti?.date), "HH:mm:ss")} */}
                    </span>
                  </p>
                </div>

                <div dangerouslySetInnerHTML={{ __html: dataCourse?.title }} />
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
              style={{ width: "100%", height: "38px" }}
              onClick={() => confirmStartQuiz(i?._id, i?.type)}
            >
              <div style={{ marginLeft: "-5px", marginTop: "-2px" }}>
                Bắt đầu thi
              </div>
            </Button>
          ),
        };
      });

    const confirmStartQuiz = (quizId, quizType) => {
      Modal.confirm({
        title: "Vui lòng xác nhận bắt đầu làm bài thi",
        content:
          "Lưu ý, trong quá trình làm bài, nếu bạn có các hành vi như: đóng hoặc tải lại trình duyệt, hệ thống sẽ ghi nhận trạng thái là đã hoàn thành.",
        okText: "Xác nhận",
        cancelText: "Huỷ",
        onOk() {
          handleStartQuiz(quizId, quizType);
        },
        okButtonProps: { className: "custom-button" },
      });
    };

    useEffect(() => {
      setExpiredCount(notCompletedQuizzes.length);
    }, [notCompletedQuizzes]);

    return notCompletedQuizzes.length > 0 ? (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
        {notCompletedQuizzes.map((item, index) => (
          <div
            key={index}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden transition duration-300 ease-in-out transform hover:-translate-y-1 hover:shadow-xl"
            style={{ width: "100%" }}
          >
            <div className="p-4">
              <h5 className="text-lg font-semibold mb-2 truncate">
                <Tooltip title={item.name}>{item.name}</Tooltip>
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
      ?.filter((quiz) => {
        const correspondingScore = score.find((s) => s.quiz?._id === quiz?._id); // chú ý call api nhìu
        return correspondingScore?.isComplete;
      })
      .map((quiz, index) => ({
        key: index + 1,
        name: quiz?.name,
        submissionTime: quiz?.submissionTime
          ? DateTime.fromISO(quiz?.submissionTime)
              .setLocale("vi")
              .toLocaleString(DateTime.DATETIME_SHORT)
          : null,
        isComplete: "Đã hoàn thành",
        type: quiz?.type,
        _id: quiz._id,
        questions: (
          <Button
            className="me-3"
            style={{ width: "100%", height: "38px" }}
            onClick={() => {
              const path =
                quiz?.type === "multiple_choice"
                  ? `/courses/view-details/submit-quiz/${quiz._id}`
                  : `/courses/view-details/handle-submit-essay/${quiz._id}`;
              router.push(path);
            }}
          >
            <div style={{ marginLeft: "-5px", marginTop: "-2px" }}>
              Xem chi tiết
            </div>
          </Button>
        ),
      }));

    useEffect(() => {
      setNonExpiredCount(completedQuizzes.length);
    }, [completedQuizzes]);

    return completedQuizzes.length > 0 ? (
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
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
                    <Tooltip title={item.name}>{item.name}</Tooltip>
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
                      style={{ width: "100%", height: "38px" }}
                    >
                      <div style={{ marginLeft: "-5px", marginTop: "-2px" }}>
                        Xem chi tiết
                      </div>
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

  // hiển thị tất cả bài bên giáo viên
  const AllQuizzesComponent = () => {
    useEffect(() => {
      const fetchDataCourses = async () => {
        try {
          const coursesData = await dispatch(viewCourses());
          if (coursesData.length === 0) {
            const coursesData = await dispatch(viewCourses());
            setCoursesData(coursesData.payload.metadata);
          }
          setCoursesData(coursesData.payload.metadata);
          setApiCourses(true);
        } catch (error) {
          console.error("Error fetching courses:", error);
        }
      };
      if (!apiCourses) {
        fetchDataCourses();
      }
    }, [dispatch, params?.id, setCoursesData, apiCourses]);

    const currentCourse = coursesData?.find(
      (course) => course?._id === params?.id
    );

    const allQuizzes = useMemo(() => {
      const courseQuizzes = currentCourse ? currentCourse.quizzes || [] : [];

      const lessonQuizzes = currentCourse
        ? currentCourse.lessons?.flatMap((lesson) => lesson.quizzes || [])
        : [];

      return [...courseQuizzes, ...lessonQuizzes];
    }, [currentCourse]);

    useEffect(() => {
      setAllCourse(allQuizzes?.length);
    }, [allQuizzes, dispatch]);

    return allQuizzes.length > 0 ? (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 p-4">
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
                    <Tooltip title={item.name}>{item.name}</Tooltip>
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
      <Breadcrumb className="pt-28">
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
          <div className="flex items-center">
            <img
              src={dataCourse?.image_url}
              className="h-24 w-24 mr-4"
              alt="Logo"
              style={{
                aspectRatio: "1/1",
                objectFit: "cover",
              }}
            />
            <h1 className="text-3xl text-[#002c6a] font-medium">
              {dataCourse?.name}
            </h1>
          </div>
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
