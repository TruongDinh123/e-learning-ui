"use client";
import {
  buttonPriavteourse,
  buttonPublicCourse,
  deleteCourse,
  viewCourses,
} from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Menu, Dropdown, Spin, Image, Space } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import EditCourses from "../edit-course/Page";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { BookOutlined } from "@ant-design/icons";
import AddCourse from "../add-course/page";
import { Col } from "react-bootstrap";

export default function Courses() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [updateCourse, setUpdateCourse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [shouldRefresh, setShouldRefresh] = useState(false);
  const router = useRouter();

  //viewCourses api
  // useEffect(() => {
  //   setIsLoading(true);
  //   dispatch(viewCourses())
  //     .then(unwrapResult)
  //     .then((res) => {
  //       if (res.status) {
  //         setCourse(res.data.metadata);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       console.log(error);
  //       setIsLoading(false);
  //     });
  // }, [updateCourse]);

  useEffect(() => {
    if (!shouldRefresh) {
      return;
    }

    setIsLoading(true);
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourse(res.data.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });

    // Reset the refresh state after the API call
    setShouldRefresh(false);
  }, [shouldRefresh]);

  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  //table data
  let data = [];
  course.forEach((i, index) => {
    data.push({
      key: index + 1,
      title: i?.title,
      _id: i?._id,
      name: i?.name,
      lessons: i?.lessons,
      showCourse: i?.showCourse,
    });
  });

  //handleDeleteCourse
  const handleDeleteCourse = (id) => {
    setIsLoading(true);
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          // setUpdateCourse(updateCourse + 1);
          setShouldRefresh(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleCoursePublic = (courseId) => {
    setIsLoading(true);
    dispatch(buttonPublicCourse(courseId))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          // setUpdateCourse(updateCourse + 1);
          setShouldRefresh(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  const handleCoursePrivate = (courseId) => {
    setIsLoading(true);
    dispatch(buttonPriavteourse(courseId))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          // setUpdateCourse(updateCourse + 1);
          setShouldRefresh(true);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.log(error);
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading ? (
        <Spin />
      ) : (
        <div className="max-w-screen-2xl mx-auto">
          <h1>View Course</h1>
          <AddCourse refresh={() => setUpdateCourse(updateCourse + 1)} />
          <div className="p-6 space-y-4">
            <div className="grid sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3">
              {data.map((item) => {
                const menu = (
                  <Menu>
                    <Menu.Item>
                      <EditCourses
                        id={item?._id}
                        refresh={() => setUpdateCourse(updateCourse + 1)}
                      />
                    </Menu.Item>
                    <Menu.Item>
                      <Button
                        className="me-3"
                        style={{ width: "100%" }}
                        courseId={item?._id}
                        onClick={() =>
                          router.push(`/admin/courses/Lesson/${item?._id}`)
                        }
                      >
                        View details
                      </Button>
                    </Menu.Item>
                    <Menu.Item>
                      <Popconfirm
                        title="Delete the Course"
                        description="Are you sure to delete this Course?"
                        okText="Yes"
                        cancelText="No"
                        onConfirm={() => handleDeleteCourse(item?._id)}
                      >
                        <Button danger style={{ width: "100%" }}>
                          Delete
                        </Button>
                      </Popconfirm>
                    </Menu.Item>
                    <Menu.Item>
                      <Button
                        onClick={() => handleCoursePublic(item?._id)}
                        style={{ width: "100%" }}
                      >
                        {item.showCourse ? "Make Private" : "Make Public"}
                      </Button>
                    </Menu.Item>
                  </Menu>
                );
                return (
                  <>
                    <div className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 h-full">
                      <div className="relative w-full aspect-video rounded-md overflow-hidden">
                        <Image
                          fill
                          className="object-cover"
                          alt="course image"
                          src="https://www.codewithantonio.com/_next/image?url=https%3A%2F%2Futfs.io%2Ff%2F7b009b26-3dd8-4947-a3d6-c3f7e7420990-c91s7l.png&w=1920&q=75"
                        />
                      </div>
                      <div className="flex flex-col pt-2">
                        <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                          {item.title}
                        </div>
                        <p className="text-xs text-muted-foreground"></p>
                        <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                          <div className="flex items-center gap-x-1 text-slate-500">
                            <BookOutlined />
                            <span>lessons: {item.lessons.length}</span>
                          </div>
                        </div>
                        {isMobile ? (
                          <Dropdown overlay={menu}>
                            <Button
                              className="ant-dropdown-link text-center justify-self-center"
                              onClick={(e) => e.preventDefault()}
                            >
                              Actions
                            </Button>
                          </Dropdown>
                        ) : (
                          <Col lg="12">
                            <Space
                              size="large"
                              direction="vertical"
                              className="lg:flex lg:flex-row lg:space-x-4 flex-wrap justify-between"
                            >
                              <Space wrap>
                                <EditCourses
                                  id={item?._id}
                                  refresh={() =>
                                    setUpdateCourse(updateCourse + 1)
                                  }
                                />
                                <Button
                                  courseId={item?._id}
                                  onClick={() =>
                                    router.push(
                                      `/admin/courses/Lesson/${item?._id}`
                                    )
                                  }
                                >
                                  View details
                                </Button>
                                <Button
                                  onClick={() =>
                                    item.showCourse
                                      ? handleCoursePrivate(item._id)
                                      : handleCoursePublic(item._id)
                                  }
                                >
                                  {item.showCourse
                                    ? "Make Private"
                                    : "Make Public"}
                                </Button>
                                <Popconfirm
                                  title="Delete the Course"
                                  description="Are you sure to delete this Course?"
                                  okText="Yes"
                                  cancelText="No"
                                  okButtonProps={{
                                    style: { backgroundColor: "red" },
                                  }}
                                  onConfirm={() =>
                                    handleDeleteCourse(item?._id)
                                  }
                                  style={{ margin: 0 }}
                                >
                                  <Button danger style={{ margin: 0 }}>
                                    Delete
                                  </Button>
                                </Popconfirm>
                              </Space>
                            </Space>
                          </Col>
                        )}
                      </div>
                    </div>
                  </>
                );
              })}
            </div>
            {data?.length === 0 && (
              <div className="text-center text-sm text-muted-foreground mt-10">
                No courses found
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
