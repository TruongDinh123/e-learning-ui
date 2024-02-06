"use client";
import { deleteCourse, viewCourses } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Menu, Dropdown, Spin, Image, Space, Empty, Select } from "antd";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { Button, Popconfirm } from "antd";
import EditCourses from "./edit-course/Page";
import { useRouter } from "next/navigation";
import { useMediaQuery } from "react-responsive";
import { BookOutlined } from "@ant-design/icons";
import AddCourse from "./add-course/page";
import { Col } from "react-bootstrap";
import "../courses/page.css";
import { getAllCategoryAndSubCourses } from "@/features/categories/categorySlice";
import { isAdmin } from "@/middleware";

export default function Courses() {
  const dispatch = useDispatch();
  const [course, setCourses] = useState([]);
  const [updateCourse, setUpdateCourse] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [loadingStates, setLoadingStates] = useState({});
  const [filteredCourses, setFilteredCourses] = useState([]);
  const router = useRouter();

  const fetchCategories = () => {
    dispatch(getAllCategoryAndSubCourses())
      .then(unwrapResult)
      .then((res) => {
        setCategories(res.metadata);
      })
      .catch((error) => {
        console.error("Error fetching categories:", error);
      });
  };

  useEffect(() => {
    fetchCategories();
  }, [dispatch, selectedCategory]);

  // Lọc các khóa học theo danh mục được chọn
  // useEffect(() => {
  //   const newFilteredCourses = selectedCategory
  //     ? categories.find((c) => c._id === selectedCategory)?.courses || []
  //     : course;
  //   setFilteredCourses(newFilteredCourses);
  // }, [course, selectedCategory, categories]);

  useEffect(() => {
    const currentTeacherId = localStorage.getItem("x-client-id");
    const user = JSON.parse(localStorage?.getItem("user"));
    // const isAdmin = user?.roles?.includes("Admin") || user?.roles?.includes("Super-Admin");

    let visibleCourses = course;
    if (!isAdmin() && currentTeacherId) {
      visibleCourses = course.filter(
        (course) => course.teacher === currentTeacherId
      );
    }

    const newFilteredCourses = selectedCategory
      ? categories
          .find((c) => c._id === selectedCategory)
          ?.courses.filter(
            (course) => isAdmin || course.teacher === currentTeacherId
          ) || []
      : visibleCourses;

    setFilteredCourses(newFilteredCourses);
  }, [course, selectedCategory, categories]);

  // Xử lý khi danh mục được chọn thay đổi
  const handleCategoryChange = (value) => {
    setSelectedCategory(value);
  };

  // viewCourses api
  useEffect(() => {
    setIsLoading(true);
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          const currentTeacherId = localStorage.getItem("x-client-id");
          const user = JSON.parse(localStorage?.getItem("user"));

          // const isAdmin =
          //   user?.roles?.includes("Admin") ||
          //   user?.roles?.includes("Super-Admin");
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
      .catch((error) => {
        setIsLoading(false);
      });
  }, [updateCourse]);

  const isMobile = useMediaQuery({ query: "(max-width: 1280px)" });

  //table data
  let data = [];
  course.forEach((i, index) => {
    data.push({
      key: index + 1,
      title: i?.title,
      _id: i?._id,
      name: i?.name,
      image_url: i?.image_url,
      lessons: i?.lessons,
      showCourse: i?.showCourse,
    });
  });

  //handleDeleteCourse
  const handleDeleteCourse = (id) => {
    setLoadingStates((prev) => ({ ...prev, [id]: true }));
    dispatch(deleteCourse(id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setUpdateCourse(updateCourse + 1);
          fetchCategories();
        }
        setUpdateCourse(updateCourse + 1);
        fetchCategories();
      })
      .catch((error) => {
        setIsLoading(false);
      })
      .finally(() => {
        setLoadingStates((prev) => ({ ...prev, [id]: false }));
      });
  };

  return (
    <>
      <div className="max-w-screen-2xl mx-auto min-h-screen relative p-3">
        <AddCourse
          refresh={() => setUpdateCourse(updateCourse + 1)}
          fetchCategories={fetchCategories}
        />
        <div className="space-y-4 mt-2 mb-3">
          <label htmlFor="category-select">Chọn danh mục:</label>
          <Select
            showSearch
            style={{ width: 200 }}
            placeholder="Chọn danh mục"
            optionFilterProp="children"
            onChange={handleCategoryChange}
            filterOption={(input, option) =>
              option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
            }
            defaultValue={null}
            className="mx-3"
          >
            <Select.Option value={null}>Tất cả</Select.Option>
            {categories.map((category) => (
              <Select.Option key={category._id} value={category._id}>
                {category.name}
              </Select.Option>
            ))}
          </Select>
        </div>

        <div className="space-y-4">
          <div className="grid scrollbar-thin sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-4 gap-4 pt-3 grid-container-courses">
            {filteredCourses.map((item, index) => {
              const menu = (
                <Menu>
                  <Menu.Item>
                    <EditCourses
                      course={item}
                      id={item?._id}
                      categoryId={selectedCategory}
                      refresh={() => setUpdateCourse(updateCourse + 1)}
                      fetchCategories={fetchCategories}
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
                      Xem chi tiết
                    </Button>
                  </Menu.Item>
                  <Menu.Item>
                    <Popconfirm
                      title="Xóa khóa học"
                      description="Bạn muốn chắc xóa khóa học?"
                      okText="Có"
                      cancelText="Không"
                      okButtonProps={{
                        style: { backgroundColor: "red" },
                      }}
                      onConfirm={() => handleDeleteCourse(item?._id)}
                    >
                      <Button
                        danger
                        style={{ width: "100%" }}
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
                  className="group hover:shadow-sm transition overflow-hidden border rounded-lg p-3 min-h-[100px]"
                >
                  <div className="relative w-full aspect-video rounded-md overflow-hidden">
                    <Image
                      width={330}
                      height={186}
                      fill
                      className="object-cover"
                      alt="course image"
                      fallback="data:image/png;base64,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"
                      src={item?.image_url}
                    />
                  </div>
                  <div className="flex flex-col pt-2">
                    <div className="text-lg md:text-base font-medium group-hover:text-sky-700 transition line-clamp-2">
                      {item.name} ({item.showCourse ? "Công khai" : "Riêng tư"})
                    </div>
                    <p className="text-xs text-muted-foreground"></p>
                    <div className="my-3 flex items-center gap-x-2 text-sm md:text-xs">
                      <div className="flex items-center gap-x-1 text-slate-500">
                        <BookOutlined />
                        <span>bài học: {item.lessons?.length}</span>
                      </div>
                    </div>
                    {isMobile ? (
                      <Dropdown overlay={menu}>
                        <Button
                          className="ant-dropdown-link text-center justify-self-center"
                          onClick={(e) => e.preventDefault()}
                        >
                          Chức năng
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
                              course={item}
                              categoryId={selectedCategory}
                              refresh={() => setUpdateCourse(updateCourse + 1)}
                              fetchCategories={fetchCategories}
                            />
                            <Button
                              courseId={item?._id}
                              onClick={() =>
                                router.push(
                                  `/admin/courses/Lesson/${item?._id}`
                                )
                              }
                            >
                              Xem chi tiết
                            </Button>
                            <Button
                              courseId={item?._id}
                              onClick={() =>
                                router.push(
                                  `/courses/view-details/${item?._id}`
                                )
                              }
                            >
                              Học viên
                            </Button>
                            <Popconfirm
                              title="Xóa khóa học"
                              description="Bạn có chắc xóa khóa học?"
                              okText="Có"
                              cancelText="Không"
                              okButtonProps={{
                                style: { backgroundColor: "red" },
                              }}
                              onConfirm={() => handleDeleteCourse(item?._id)}
                              style={{ margin: 0 }}
                            >
                              <Button
                                danger
                                style={{ margin: 0 }}
                                loading={loadingStates[item?._id]}
                              >
                                Xóa
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
            <div className="flex justify-center items-center h-screen">
              <Spin />
            </div>
          ) : (
            filteredCourses?.length === 0 && (
              <Empty className="text-center text-sm text-muted-foreground mt-10">
                Không có khóa học nào
              </Empty>
            )
          )}
        </div>
      </div>
    </>
  );
}
