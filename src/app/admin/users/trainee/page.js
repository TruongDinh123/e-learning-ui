"use client";
import {
  getACourse,
  removeStudentFromCourse,
  removeStudentFromCourseSuccess,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Empty, Modal, Select, Table, Tooltip, message } from "antd";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllScoresByCourseId, viewQuiz } from "@/features/Quiz/quizSlice";
import { isAdmin, isMentor } from "@/middleware";
import "./page.css";
import BarChart1 from "@/config/barchar1";
import * as XLSX from "xlsx";

const { Option } = Select;

export default function ViewStudentsCourse() {
  const dispatch = useDispatch();
  const [messageApi, contextHolder] = message.useMessage();
  const [dataStudent, setData] = useState([]);
  const [teacher, setTeacher] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [scores, setScores] = useState({});
  const [loading, setLoading] = useState(false);
  const [viewSuccess, setViewSuccess] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState({});
  const [chartData, setChartData] = useState([]);

  const handleCourseChange = (value) => {
    setSelectedCourse(value);
  };

  const handleViewCourse = useCallback(() => {
    setLoading(true);
    getACourseData(selectedCourse).then(() => {
      loadCourseData(selectedCourse);
    });
  }, [selectedCourse, dispatch, messageApi]);

  const coursesFromStore = useSelector((state) => state.course.courses);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    let visibleCourses;
    if (coursesFromStore.length === 0) {
      setLoading(true);
      dispatch(viewCourses())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            if (isAdmin()) {
              visibleCourses = res.metadata;
            } else {
              visibleCourses = res.metadata.filter(
                (course) => course.teacher === currentTeacherId
              );
            }
            setCourses(visibleCourses);
            setLoading(false);
          }
        });
    } else {
      // Áp dụng lọc cũng cho dữ liệu từ store
      if (isAdmin()) {
        visibleCourses = coursesFromStore.metadata;
      } else if (isMentor()) {
        visibleCourses = coursesFromStore.metadata.filter(
          (course) => course.teacher === currentTeacherId
        );
      }
      setCourses(visibleCourses);
    }
  }, [coursesFromStore]);

  const loadCourseData = (courseId) => {
    dispatch(viewQuiz({ courseIds: courseId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setQuizzes(res.metadata);
          return dispatch(getAllScoresByCourseId({ courseId }));
        } else {
          throw new Error(res.message);
        }
      })
      .then(unwrapResult)
      .then((scoresRes) => {
        if (scoresRes.status) {
          setScores(
            scoresRes.metadata.reduce((acc, current) => {
              acc[current.quizId] = current.scores;
              return acc;
            }, {})
          );
        } else {
          throw new Error(scoresRes.message);
        }
      })
      .catch((error) => {
        messageApi.error(
          error.message || "An error occurred while fetching quizzes or scores."
        );
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const getACourseData = () => {
    return dispatch(getACourse(selectedCourse))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setData(res.metadata.students);
          setTeacher(res.metadata.teacher);
          setViewSuccess(true);
        } else {
          messageApi.error(res.message);
        }
      })
      .catch((error) => {
        messageApi.error("An error occurred while fetching course data.");
        setLoading(false);
      });
  };

  const quizColumns = useMemo(
    () =>
      quizzes.map((quiz, index) => ({
        title: `MS ${(index + 1).toString().padStart(2, "0")}`,
        dataIndex: quiz._id,
        key: quiz._id,
        render: (text, record) => {
          const studentScore = scores[quiz._id]?.find(
            (score) => score?.userId === record?.userId
          );

          const hasSubmissionTime = quiz.hasOwnProperty("submissionTime");
          const submissionTime = hasSubmissionTime
            ? new Date(quiz.submissionTime)
            : null;
          const now = new Date();

          if (!hasSubmissionTime || (submissionTime && now < submissionTime)) {
            return studentScore
              ? studentScore.score !== undefined
                ? studentScore.score
                : "0"
              : "Chưa làm";
          } else {
            return studentScore?.isComplete
              ? studentScore.score !== undefined
                ? studentScore.score
                : "0"
              : "Chưa làm";
          }
        },
      })),
    [quizzes, scores]
  );

  const columns = [
    {
      title: "Họ tên",
      dataIndex: "fullName",
      key: "fullName",
      fixed: "left",
      sortDirections: ["descend"],
    },
    ...quizColumns,
    {
      title: "Chức năng",
      dataIndex: "action",
      key: "operation",
      fixed: "right",
      width: 100,
    },
  ];

  const handleViewChart = (studentId) => {
    // Cập nhật dữ liệu biểu đồ cho học viên cụ thể
    const studentScores = quizzes.map((quiz, index) => {
      const score = scores[quiz._id]?.find((s) => s.userId === studentId);
      return {
        x: `MS ${(index + 1).toString().padStart(2, "0")}`,
        y: score ? score.score : 0,
      };
    });
    setChartData(studentScores);
    setIsModalVisible(studentId);
  };

  const data = useMemo(
    () =>
      dataStudent.map((student, index) => ({
        key: index + 1,
        userId: student?._id,
        fullName: [student?.lastName, student?.firstName]
          .filter(Boolean)
          .join(" "),
        email: student?.email,
        action: (
          <>
            <Button
              type="primary"
              onClick={() => handleViewChart(student._id)}
              className="me-3 custom-button"
            >
              Xem biểu đồ
            </Button>
            {isModalVisible === student._id && (
              <Modal
                title={`Biểu đồ điểm số của ${student.lastName} ${student.firstName}`}
                visible={isModalVisible === student._id}
                onCancel={() => setIsModalVisible(null)}
                width={1000}
                footer={[
                  <Button
                    key="cancel"
                    onClick={() => setIsModalVisible(null)}
                    style={{ marginRight: 8 }}
                  >
                    Hủy
                  </Button>,
                  <></>,
                ]}
              >
                <BarChart1 chartData={chartData} />
              </Modal>
            )}
          </>
        ),
      })),
    [dataStudent, isModalVisible, quizzes, scores, chartData]
  );

  const exportToCSV = () => {
    const currentCourse = courses.find(
      (course) => course._id === selectedCourse
    );
    const courseName = currentCourse ? currentCourse.name : "Không xác định";
    const teacherName = teacher
      ? `${teacher.lastName} ${teacher.firstName}`
      : "Không xác định";
    const teacherEmail = teacher ? teacher.email : "Không xác định";

    const courseInfoHeader = `Tên khóa học: ${courseName}, Tên giáo viên: ${teacherName}, Email giáo viên: ${teacherEmail}\n\n`;

    // Tạo tiêu đề cho CSV
    const headers = [
      "STT",
      "Full Name",
      "Email",
      ...quizzes.map(
        (quiz, index) => `MS ${(index + 1).toString().padStart(2, "0")}`
      ), // Tiêu đề cho mỗi quiz
    ];

    // Chuyển đổi dữ liệu thành chuỗi CSV
    const BOM = "\uFEFF";
    const csvContent = [
      BOM,
      courseInfoHeader,
      headers.join(","), // thêm tiêu đề vào đầu
      ...dataStudent.map((student, index) =>
        [
          index + 1, // STT
          [student?.lastName, student?.firstName].filter(Boolean).join(" "), // Full Name
          student.email,
          ...quizzes.map((quiz) => {
            const studentScore = scores[quiz._id]?.find(
              (score) => score?.userId === student._id
            );
            const hasSubmissionTime = quiz.hasOwnProperty("submissionTime");
            const submissionTime = hasSubmissionTime
              ? new Date(quiz.submissionTime)
              : null;
            const now = new Date();
            if (
              !hasSubmissionTime ||
              (submissionTime && now < submissionTime)
            ) {
              return studentScore
                ? studentScore.score !== undefined
                  ? studentScore.score
                  : "0"
                : "Chưa làm";
            } else {
              return studentScore?.isComplete
                ? studentScore.score !== undefined
                  ? studentScore.score
                  : "0"
                : "Hết hạn nộp";
            }
          }),
        ]
          .map((field) => `"${field}"`)
          .join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "Danh_sách_điểm.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcelStyled = () => {
    const currentCourse = courses.find(
      (course) => course._id === selectedCourse
    );
    const courseName = currentCourse ? currentCourse.name : "Không xác định";
    const teacherName = teacher
      ? `${teacher.lastName} ${teacher.firstName}`
      : "Không xác định";
    const teacherEmail = teacher ? teacher.email : "Không xác định";

    // Tạo một workbook mới
    const wb = XLSX.utils.book_new();

    // Tạo tiêu đề cho Excel
    const headers = [
      "STT",
      "Full Name",
      "Email",
      ...quizzes.map(
        (quiz, index) => `MS ${(index + 1).toString().padStart(2, "0")}`
      ),
    ];

    // Dữ liệu cho worksheet
    const wsData = [
      [
        `Tên khóa học: ${courseName}`,
        "",
        "",
        `Tên giáo viên: ${teacherName}`,
        "",
        `Email giáo viên: ${teacherEmail}`,
      ],
      headers, // Tiêu đề cột
      ...dataStudent.map((student, index) => [
        index + 1, // STT
        [student?.lastName, student?.firstName].filter(Boolean).join(" "), // Full Name
        student.email, // Email
        ...quizzes.map((quiz) => {
          const studentScore = scores[quiz._id]?.find(
            (score) => score?.userId === student._id
          );
          const hasSubmissionTime = quiz.hasOwnProperty("submissionTime");
          const submissionTime = hasSubmissionTime
            ? new Date(quiz.submissionTime)
            : null;
          const now = new Date();
          if (!hasSubmissionTime || (submissionTime && now < submissionTime)) {
            return studentScore
              ? studentScore.score !== undefined
                ? studentScore.score
                : "0"
              : "Chưa làm";
          } else {
            return studentScore?.isComplete
              ? studentScore.score !== undefined
                ? studentScore.score
                : "0"
              : "Hết hạn nộp";
          }
        }),
      ]),
    ];
    // Tạo worksheet từ dữ liệu
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    const headerStyle = {
      font: { bold: true },
      alignment: { horizontal: "center", vertical: "center" },
      fill: { fgColor: { rgb: "FFFF00" } },
      border: {
        top: { style: "thin" },
        bottom: { style: "thin" },
        left: { style: "thin" },
        right: { style: "thin" },
      },
    };

    // Style cho tiêu đề khóa học và giáo viên
    const merge = [
      // Merge cells for course title
      { s: { r: 0, c: 0 }, e: { r: 0, c: 2 } },
      // Merge cells for teacher name
      { s: { r: 0, c: 3 }, e: { r: 0, c: 4 } },
      // Merge cells for teacher email
      { s: { r: 0, c: 5 }, e: { r: 0, c: 6 } },
    ];
    ws["!merges"] = merge;
    
    // Áp dụng style cho các ô đã merge
    ["A1", "D1", "F1"].forEach((cellRef) => {
      if (!ws[cellRef]) {
        ws[cellRef] = {};
      }
      ws[cellRef].s = headerStyle;
    });

    const columnHeaders = ["A3", "B3", "C3", "D3", "E3", "F3"];
    columnHeaders.forEach((cellRef) => {
      if (!ws[cellRef]) {
        ws[cellRef] = {};
      }
      ws[cellRef].s = headerStyle;
    });

    // Áp dụng style cho tiêu đề cột
    for (let C = 0; C < headers.length; C++) {
      const cellRef = XLSX.utils.encode_cell({ r: 1, c: C });
      if (!ws[cellRef]) {
        ws[cellRef] = {};
      }
      ws[cellRef].s = headerStyle;
    }

    // Thêm worksheet vào workbook
    XLSX.utils.book_append_sheet(wb, ws, "Scores");

    // Tạo một Blob từ workbook
    const wbout = XLSX.write(wb, { bookType: "xlsx", type: "binary" });
    const blob = new Blob([s2ab(wbout)], { type: "application/octet-stream" });

    // Tạo và tải xuống file Excel
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = "Danh_sách_điểm.xlsx";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Hàm hỗ trợ để chuyển đổi string sang ArrayBuffer
  function s2ab(s) {
    const buf = new ArrayBuffer(s.length);
    const view = new Uint8Array(buf);
    for (let i = 0; i < s.length; i++) {
      view[i] = s.charCodeAt(i) & 0xff;
    }
    return buf;
  }

  return (
    <div className="p-3">
      {contextHolder}
      <h1 className="text-lg font-bold text-[#002c6a]">
        Quản lý bài tập học viên
      </h1>
      <div className="py-3 grid-container">
        <Select
          placeholder="Chọn khóa học"
          onChange={handleCourseChange}
          value={selectedCourse}
          className="me-3 w-full sm:w-64 mb-3 md:mb-0"
        >
          {courses.map((course) => (
            <Option key={course._id} value={course._id}>
              {course.name}
            </Option>
          ))}
        </Select>
        <Button
          type="primary"
          onClick={handleViewCourse}
          className="me-3 custom-button"
        >
          Xem
        </Button>

        {/* {viewSuccess ? (
          <Button
            type="primary"
            onClick={exportToExcelStyled}
            className="me-3 custom-button"
          >
            Xuất file
          </Button>
        ) : null} */}

        {viewSuccess ? (
          <>
            {teacher && (
              <div className="border p-4 rounded-md">
                <h2 className="font-bold text-lg">
                  Giáo viên: {teacher?.firstName}
                </h2>
                <p className="text-sm">Email: {teacher?.email}</p>
              </div>
            )}
            <Table
              columns={columns}
              dataSource={data}
              pagination={{ pageSize: 10, position: ["bottomLeft"] }}
              scroll={{
                x: 1300,
              }}
              // className="pt-3 grid-container"
            />
          </>
        ) : (
          <>
            {dataStudent?.length === 0 && (
              <div className="flex justify-center items-center h-[45vh]">
                <Empty
                  className="text-center text-lg font-bold text-[#002c6a]"
                  description="Hãy chọn khóa học bạn muốn xem học viên"
                />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
