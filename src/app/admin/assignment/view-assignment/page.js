"use client";
import {
  Button,
  Table,
  Typography,
  List,
  Collapse,
  Popconfirm,
  Select,
  Spin,
  Modal,
} from "antd";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { deleteQuiz, viewQuiz } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "@/features/Courses/courseSlice";
import UpdateQuiz from "../../courses/Lesson/edit-quiz/page";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";

const { Option } = Select;

export default function ViewAssignment() {
  const dispatch = useDispatch();
  const [assignment, setAssignment] = useState([]);
  const [updateQuiz, setUpdateAssignment] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [currentQuestions, setCurrentQuestions] = useState([]);

  const showModal = (questions) => {
    setCurrentQuestions(questions);
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  const { Text } = Typography;
  const { Panel } = Collapse;

  // Hàm xử lý khi chọn khóa học
  const handleCourseChange = (value) => {
    setSelectedCourse(value);
    const selectedCourse = courses.find((course) => course._id === value);
  };

  useEffect(() => {
    setIsLoading(true);
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.data.metadata);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  }, []);

  useEffect(() => {
    dispatch(viewAssignmentByCourseId({ courseId: selectedCourse }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setAssignment(res.metadata);
        } else {
        }
      })
      .catch((error) => {
        console.log(error);
      });
  }, [updateQuiz]);

  const handleViewQuiz = () => {
    setIsLoading(true);
    dispatch(viewAssignmentByCourseId({ courseId: selectedCourse }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setAssignment(res.metadata);
          setUpdateAssignment(updateQuiz + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const columns = [
    {
      title: "SNo.",
      dataIndex: "key",
    },
    {
      title: "Name Quiz",
      dataIndex: "name",
      onFilter: (value, record) => record.name.indexOf(value) === 0,
      sorter: (a, b) => a.name.length - b.name.length,
      sortDirections: ["descend"],
    },
    {
      title: "Questions",
      dataIndex: "questions",
      onFilter: (value, record) => record.questions.indexOf(value) === 0,
      sorter: (a, b) => a.questions.length - b.questions.length,
      sortDirections: ["descend"],
    },
    {
      title: "Action",
      dataIndex: "action",
    },
  ];

  let data = [];
  assignment?.forEach((i, index) => {
    // const questions = i.questions.map((question) => (
    //   <Panel header={question.question} key={question._id}>
    //     <List
    //       dataSource={question.options}
    //       renderItem={(option, optionIndex) => (
    //         <List.Item>
    //           <Text>
    //             {optionIndex + 1}: {option}
    //           </Text>
    //         </List.Item>
    //       )}
    //     />
    //     <Text strong>Answer: {question.answer}</Text>
        // <div className="mt-3">
        //   <Popconfirm
        //     title="Delete the quiz"
        //     description="Are you sure to delete this Quiz?"
        //     okText="Yes"
        //     cancelText="No"
        //     onConfirm={() =>
        //       handleDeleteQuiz({
        //         quizId: i?._id,
        //         questionId: question?._id,
        //       })
        //     }
        //   >
        //     <Button danger>Delete</Button>
        //   </Popconfirm>
        // </div>
    //   </Panel>
    // ));
    const questions = i.questions.map((question, questionIndex) => (
      <div key={question._id} className="mb-4">
        <h2 className="text-xl font-bold">Question {questionIndex + 1}</h2>
        <p>{question.question}</p>
        <ul className="list-disc ml-5">
          {question.options.map((option, optionIndex) => (
            <li key={optionIndex}>{option}</li>
          ))}
        </ul>
        <p><strong>Answer:</strong> {question.answer}</p>
        <div className="mt-3">
          <Popconfirm
            title="Delete the quiz"
            description="Are you sure to delete this Quiz?"
            okText="Yes"
            cancelText="No"
            onConfirm={() =>
              handleDeleteQuiz({
                quizId: i?._id,
                questionId: question?._id,
              })
            }
          >
            <Button danger>Delete</Button>
          </Popconfirm>
        </div>
      </div>
    ));
  
    data.push({
      key: index + 1,
      name: i?.name,
      questions: (
        // <>
        //   <Collapse accordion>{questions}</Collapse>
        // </>
        <>
      <Button type="primary" 
       style={{ color: "#fff", backgroundColor: "#1890ff" }}
       onClick={() => showModal(i.questions)}>
        View Questions
      </Button>
      <Modal
            title="Questions"
            visible={isModalVisible}
            onCancel={handleCancel}
            style={{ overflow: 'auto', maxHeight: '60vh' }}
            footer={
          <>
          <>
          </>
            <Button key="back" onClick={handleCancel}>
              Cancel
            </Button>
          </>
        }
          >
            {questions}
          </Modal>
        </>
      ),
      action: (
        <>
          <UpdateQuiz
            quizId={i?._id}
            refresh={() => setUpdateAssignment(updateQuiz + 1)}
          />
        </>
      ),
    });
  });

  const handleDeleteQuiz = ({ quizId, questionId }) => {
    setIsLoading(true);

    dispatch(deleteQuiz({ quizId, questionId }))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateAssignment(updateQuiz + 1);
        } else {
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="">
      <>
        {isLoading ? (
          <Spin />
        ) : (
          <>
            <div className="pb-3">
              <div style={{ display: "flex", paddingBottom: "20px" }}>
                <Select
                  placeholder="Select a course"
                  onChange={handleCourseChange}
                  value={selectedCourse}
                  className="me-3"
                >
                  {courses.map((course) => (
                    <Option key={course._id} value={course._id}>
                      {course.name}
                    </Option>
                  ))}
                </Select>
              </div>
              <Button
                type="primary"
                onClick={handleViewQuiz}
                style={{ color: "#fff", backgroundColor: "#1890ff" }}
              >
                View
              </Button>
            </div>
            <h3>Table Assignment</h3>
            <Table columns={columns} dataSource={data} />

          </>
        )}
      </>
    </div>
  );
}