'use client';
import {deleteCourse, viewCourses} from '@/features/Courses/courseSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import {Menu, Dropdown, Spin, Image, Space, Empty, message} from 'antd';
import {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import {Button, Popconfirm} from 'antd';
import EditCourses from './edit-course/Page';
import {useRouter} from 'next/navigation';
import {useMediaQuery} from 'react-responsive';
import AddCourse from './add-course/page';
import {Col} from 'react-bootstrap';
import '../courses/page.css';
import {isAdmin} from '@/middleware';
import useCoursesData from '@/hooks/useCoursesData';
import 'react-quill/dist/quill.snow.css';
import {IMAGE_DEFAULT} from '../../../constants';

export default function Courses() {
  const dispatch = useDispatch();
  const courses = useCoursesData();
  const [course, setCourses] = useState([]);
  const [updateCourse, setUpdateCourse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [filteredCourses, setFilteredCourses] = useState([]);
  const router = useRouter();
  const isMobile = useMediaQuery({query: '(max-width: 1280px)'});

  useEffect(() => {
    const currentTeacherId = localStorage.getItem('x-client-id');

    let visibleCourses = course;
    if (!isAdmin() && currentTeacherId) {
      visibleCourses = course.filter(
        (course) => course.teacher === currentTeacherId
      );
    }

    setFilteredCourses(visibleCourses);
  }, [course]);

  // viewCourses api
  useEffect(() => {
    if (courses.length === 0 && !isLoading) {
      setIsLoading(true);
      dispatch(viewCourses())
        .then(unwrapResult)
        .then((res) => {
          if (res.status) {
            const currentTeacherId = localStorage.getItem('x-client-id');
            let visibleCourses;
            if (isAdmin()) {
              visibleCourses = res.metadata;
            } else {
              visibleCourses = res.metadata.filter(
                (course) => course.teacher === currentTeacherId
              );
            }
            setCourses(visibleCourses);
          }
          setIsLoading(false);
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else {
      setCourses(courses?.metadata || courses);
    }
  }, [courses, dispatch, isLoading]);

  // handleDeleteCourse
  const handleDeleteCourse = (id) => {
    setLoadingStates((prev) => ({...prev, [id]: true}));
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateCourse(updateCourse + 1);
        }
        setUpdateCourse(updateCourse + 1);
      })
      .catch((error) => {
        message.error('Có lỗi xảy ra khi xóa khóa học. Vui lòng thử lại.');
      })
      .finally(() => {
        setLoadingStates((prev) => ({...prev, [id]: false}));
      });
  };

  return (
    <>
      <div className='max-w-screen-2xl mx-auto min-h-screen relative p-3'>
        <AddCourse refresh={() => setUpdateCourse(updateCourse + 1)} />

        <div className='space-y-4'>
          <div className='grid scrollbar-thin sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3 grid-container-courses'>
            {filteredCourses.map((item, index) => {
              const menu = (
                <Menu>
                  <Menu.Item>
                    <EditCourses
                      course={item}
                      id={item?._id}
                      categoryId={selectedCategory}
                      refresh={() => setUpdateCourse(updateCourse + 1)}
                    />
                  </Menu.Item>
                  <Menu.Item>
                    <Button
                      className='me-3'
                      style={{width: '100%'}}
                      courseId={item?._id}
                      onClick={() =>
                        router.push(`/user/exem-online/${item?._id}`)
                      }
                    >
                      View Detail
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Popconfirm
                      title='Xóa khóa học'
                      description='Bạn muốn chắc xóa khóa học?'
                      okText='Có'
                      cancelText='Không'
                      okButtonProps={{
                        style: {backgroundColor: 'red'},
                      }}
                      onConfirm={() => handleDeleteCourse(item?._id)}
                    >
                      <Button
                        danger
                        style={{width: '100%'}}
                        loading={loadingStates[item?._id]}
                      >
                        Xóa
                      </Button>
                    </Popconfirm>
                  </Menu.Item>
                </Menu>
              );
              return (
                <div
                  key={index}
                  className='group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 min-h-[100px]'
                >
                  <div className='relative w-full aspect-video rounded-md overflow-hidden'>
                    <Image
                      width={330}
                      height={186}
                      fill
                      className='object-cover'
                      alt='Hình ảnh khóa học'
                      fallback={IMAGE_DEFAULT}
                      src={item?.image_url}
                    />
                  </div>
                  <div className='flex flex-col pt-2'>
                    <a
                      className='text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2'
                      onClick={() =>
                        router.push(`/user/exem-online/${item?._id}`)
                      }
                    >
                      {item.name}
                    </a>

                    {isMobile ? (
                      <Dropdown overlay={menu}>
                        <Button
                          className='ant-dropdown-link text-center justify-self-center'
                          onClick={(e) => e.preventDefault()}
                        >
                          Chức năng
                        </Button>
                      </Dropdown>
                    ) : (
                      <Col lg='12' className='mt-5'>
                        <Space
                          size='large'
                          direction='vertical'
                          className='lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between'
                        >
                          <Space wrap>
                            <EditCourses
                              id={item?._id}
                              course={item}
                              categoryId={selectedCategory}
                              refresh={() => setUpdateCourse(updateCourse + 1)}
                            />
                            <Popconfirm
                              title='Detele the Contest'
                              description='Confirm to delete the contest'
                              okText='Yes'
                              cancelText='No'
                              okButtonProps={{
                                style: {backgroundColor: 'red'},
                              }}
                              onConfirm={() => handleDeleteCourse(item?._id)}
                              style={{margin: 0}}
                            >
                              <Button
                                danger
                                style={{margin: 0}}
                                loading={loadingStates[item?._id]}
                              >
                                Delete
                              </Button>
                            </Popconfirm>
                          </Space>
                        </Space>
                      </Col>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {isLoading ? (
            <div className='flex justify-center items-center h-screen'>
              <Spin />
            </div>
          ) : (
            filteredCourses?.length === 0 && (
              <Empty
                className='text-center text-sm text-muted-foreground mt-10'
                description='
                Không có khóa học nào
              '
              />
            )
          )}
        </div>
      </div>
    </>
  );
}
