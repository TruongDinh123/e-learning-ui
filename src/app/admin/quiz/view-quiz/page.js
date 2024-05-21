'use client';
import {
  Button,
  Table,
  Popconfirm,
  Menu,
  Dropdown,
  Space,
  Col,
  message,
} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useCallback, useEffect, useState} from 'react';
import {
  deleteQuiz,
  updateStateQuiz,
  viewInfoQuiz,
} from '@/features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import React from 'react';
import {useRouter} from 'next/navigation';
import UpdateQuiz from '../update-quiz/page';
import '../view-quiz/page.css';
import {useMediaQuery} from 'react-responsive';
import {SELECTED_COURSE_ID} from '../../../../constants';

const ViewQuiz = () => {
  const dispatch = useDispatch();

  const quiz = useSelector((state) => state.quiz.quiz);
  const [updateQuiz, setUpdateQuiz] = useState(0);
  // const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState([]);
  const [columns, setColumns] = useState([]);

  const selectedCourse = localStorage?.getItem('selectedCourseId') || null;

  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});

  const router = useRouter();

  useEffect(() => {
    const handleViewQuiz = () => {
      setIsLoading(true);
      dispatch(viewInfoQuiz({courseIds: SELECTED_COURSE_ID}))
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
          } else {
          }
          setIsLoading(false);
        })
        .catch((error) => {
          setIsLoading(false);
        });
    };

    !quiz && handleViewQuiz();
  }, [dispatch, quiz]);

  const handleDeleteQuiz = useCallback(
    ({quizId}) => {
      const updatedQuizzes = quiz.filter((q) => q._id !== quizId);
      dispatch(updateStateQuiz(updatedQuizzes));

      dispatch(deleteQuiz({quizId}))
        .then(unwrapResult)
        .then((res) => {
          if (!res.status) {
            dispatch(updateStateQuiz(quiz));
            message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
          }
        })
        .catch((error) => {
          dispatch(updateStateQuiz(quiz));
          message.error('Có lỗi xảy ra khi xóa quiz. Vui lòng thử lại.');
        });
    },
    [dispatch, quiz]
  );

  useEffect(() => {
    const columns = [
      {
        title: 'SNo.',
        dataIndex: 'key',
      },
      {
        title: 'Tên đề thi',
        dataIndex: 'name',
        onFilter: (value, record) => record.name.indexOf(value) === 0,
        sorter: (a, b) => a.name.length - b.name.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Loại hình thức',
        dataIndex: 'type',
        render: (text) =>
          text === 'multiple_choice'
            ? 'Trắc Nghiệm'
            : text === 'essay'
            ? 'Tự luận'
            : text,
        onFilter: (value, record) => record.type.indexOf(value) === 0,
        sorter: (a, b) => a.type.localeCompare(b.type),
        sortDirections: ['descend'],
      },
      {
        title: 'Chi tiết câu hỏi',
        dataIndex: 'questions',
        onFilter: (value, record) => record.questions.indexOf(value) === 0,
        sorter: (a, b) => a.questions.length - b.questions.length,
        sortDirections: ['descend'],
      },
      {
        title: 'Chức năng',
        dataIndex: 'action',
      },
    ];
    setColumns(columns);
  }, []);

  useEffect(() => {
    let data = [];
    quiz &&
      quiz?.forEach((i, index) => {
        const menu = (
          <Menu>
            <Menu.Item>
              <UpdateQuiz
                courseIds={selectedCourse}
                quizId={i?._id}
                refresh={() => setUpdateQuiz(updateQuiz + 1)}
              />
            </Menu.Item>
            <Menu.Item>
              <Popconfirm
                title='Xóa bài tập'
                description='Bạn có muốn xóa bài tập?'
                okText='Có'
                cancelText='Không'
                okButtonProps={{
                  style: {backgroundColor: 'red'},
                }}
                onConfirm={() =>
                  handleDeleteQuiz({
                    quizId: i?._id,
                  })
                }
              >
                <Button danger style={{width: '100%'}}>
                  Xóa
                </Button>
              </Popconfirm>
            </Menu.Item>
          </Menu>
        );
        data.push({
          key: index + 1,
          name: i?.name,
          type: i?.type,
          questions: (
            <Button
              className='me-3'
              style={{width: '100%'}}
              onClick={() =>
                router.push(`/admin/quiz/view-list-question/${i?._id}`)
              }
            >
              Xem chi tiết
            </Button>
          ),
          action: isMobile ? (
            <Dropdown overlay={menu}>
              <Button
                className='ant-dropdown-link text-center justify-self-center'
                onClick={(e) => e.preventDefault()}
              >
                Chức năng
              </Button>
            </Dropdown>
          ) : (
            <Col lg='12'>
              <Space
                size='large'
                direction='vertical'
                className='lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between'
              >
                <Space wrap>
                  <UpdateQuiz
                    courseIds={selectedCourse}
                    quizId={i?._id}
                    refresh={() => setUpdateQuiz(updateQuiz + 1)}
                  />
                  <Popconfirm
                    title='Xóa bài tập'
                    description='Bạn có muốn xóa bài tập?'
                    okText='Có'
                    cancelText='Không'
                    okButtonProps={{
                      style: {backgroundColor: 'red'},
                    }}
                    onConfirm={() =>
                      handleDeleteQuiz({
                        quizId: i?._id,
                      })
                    }
                  >
                    <Button danger style={{width: '100%'}}>
                      Xóa
                    </Button>
                  </Popconfirm>
                </Space>
              </Space>
            </Col>
          ),
        });
      });

    setData(data);
  }, [handleDeleteQuiz, isMobile, quiz, router, selectedCourse, updateQuiz]);

  return (
    <div className='p-3'>
      <h1 className='text-2xl font-bold text-[#002c6a] mb-3'>
        Danh sách đề thi
      </h1>
      {columns.length > 0 && (
        <Table
          columns={columns}
          dataSource={data}
          pagination={{pageSize: 5}}
          loading={isLoading}
        />
      )}
    </div>
  );
}

export default ViewQuiz;
