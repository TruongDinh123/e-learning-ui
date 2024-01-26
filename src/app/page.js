"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Badge, Button, Carousel, Image, Tabs } from "antd";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
const thumnail1 = "/images/thumnail5.jpg";
const thumnail2 = "/images/thumnail2.jpg";

export default function Home() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { TabPane } = Tabs;
  const categories = [
    ...new Set(
      course
        .filter(
          (i) =>
            course.filter((c) => c.category?.name === i.category?.name).length >
            3
        )
        .map((i) => i.category?.name)
    ),
  ];

  // Tạo một object để lưu trữ các refs, bao gồm cả ref cho tab "Tất cả"
  const carouselRefs = useRef({
    all: React.createRef(),
    ...categories.reduce((acc, _, index) => {
      acc[index] = React.createRef();
      return acc;
    }, {}),
  });

  // Cập nhật các hàm next và previous để sử dụng ref dựa trên category
  const next = (categoryIndex) => {
    carouselRefs.current[categoryIndex].current.next();
  };

  const previous = (categoryIndex) => {
    carouselRefs.current[categoryIndex].current.prev();
  };

  // viewCourses api
  useEffect(() => {
    setIsLoading(true);
    dispatch(getCoursePublic())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourse(res.metadata);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        setIsLoading(false);
      });
  }, []);

  const getSlidesToShow = (coursesInCategory) => {
    return coursesInCategory.length < 4 ? coursesInCategory.length : 4;
  };

  return (
    <div className="max-w-[105rem] mx-auto px-4 sm:px-6 lg:px-8">
      <Carousel autoplay>
        <div>
          <img src={thumnail1} alt="First" className="w-full" />
        </div>
        <div>
          <img src={thumnail2} alt="Second" className="w-full" />
        </div>
      </Carousel>

      <div className="bg-white p-8">
        <h2 className="text-3xl font-bold">Khóa học nổi bật</h2>
        <p className="mt-2 text-sm text-gray-600">
          Khám phá các kỹ năng được tìm kiếm nhiều nhất/hàng đầu trong tuần này
          và bắt đầu việc học của bạn ngay hôm nay
        </p>
        <Tabs defaultActiveKey="1" className="mt-4 flex space-x-4">
          <TabPane tab="Tất cả" key="all">
            <Button
              className="carousel-control left"
              onClick={() => carouselRefs.current.all.current.prev()}
              icon={<LeftOutlined />}
            />
            <Carousel
              ref={carouselRefs.current.all}
              dots={false}
              slidesToShow={4}
              slidesToScroll={4}
              responsive={[
                {
                  breakpoint: 1024,
                  settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                  },
                },
                {
                  breakpoint: 600,
                  settings: {
                    slidesToShow: 2,
                    slidesToScroll: 2,
                  },
                },
                {
                  breakpoint: 480,
                  settings: {
                    slidesToShow: 1,
                    slidesToScroll: 1,
                  },
                },
              ]}
            >
              {course.map((course) => (
                <Link
                  href={`/courses/view-course-details/${course?._id}`}
                  key={course?._id}
                  className="bg-[#f7f7f7] p-4 rounded-lg shadow-md cursor-pointer flex flex-col items-center min-w-0"
                >
                  <img
                    alt={course.title}
                    className="w-full h-auto rounded-lg mb-2"
                    src={course.image_url}
                    style={{
                      aspectRatio: "150/150",
                      objectFit: "cover",
                    }}
                    width="150"
                    height="150"
                  />
                  <div className="text-yellow-500 text-lg font-semibold mb-1">
                    {course.category?.name}
                  </div>
                  <h3 className="text-lg font-semibold text-blue-950 mb-1 line-clamp-1">
                    {course.name}
                  </h3>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {course?.title || "Thông tin khóa học chưa được cập nhật"}
                  </p>
                  <p className="text-sm text-gray-900 font-medium mb-4 line-clamp-1">
                    {course?.teacher?.lastName
                      ? `${course.teacher.lastName} ${course.teacher.firstName}`
                      : "Chưa có giáo viên"}
                  </p>
                  {/* <div className="text-green-600 text-xl font-bold mb-1">
                    {course?.price || "Giá chưa được xác định"}
                  </div>
                  <div className="text-gray-400 text-sm line-through">
                    {course?.originalPrice || "Giá gốc chưa được xác định"}
                  </div> */}
                </Link>
              ))}
            </Carousel>
            <Button
              className="carousel-control right"
              onClick={() => carouselRefs.current.all.current.next()}
              icon={<RightOutlined />}
            />
          </TabPane>
          {/* // Cấu hình Carousel cho từng category */}
          {categories.map((category, index) => {
            const coursesInCategory = course.filter(
              (c) => c.category?.name === category
            );
            const slidesToShow = getSlidesToShow(coursesInCategory);
            if (!carouselRefs.current[index]) {
              carouselRefs.current[index] = React.createRef();
            }
            return (
              <TabPane
                tab={category}
                key={index + 1}
                className="carousel-container relative"
              >
                <Button
                  className="carousel-control left"
                  onClick={() => previous(index)}
                  icon={<LeftOutlined />}
                />
                <Carousel
                  ref={carouselRefs.current[index]}
                  dots={false}
                  slidesToShow={4}
                  slidesToScroll={4}
                  responsive={[
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: 4,
                        slidesToScroll: 4,
                      },
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: 2,
                        slidesToScroll: 2,
                      },
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1,
                      },
                    },
                  ]}
                >
                  {course
                    .filter((course) => course.category?.name === category)
                    .map((course) => (
                      <Link
                        key={course?._id}
                        href={`/courses/view-course-details/${course?._id}`}
                        className="bg-[#f7f7f7] p-4 rounded-lg shadow-md cursor-pointer"
                      >
                        <img
                          alt={course.title}
                          className="w-full h-auto rounded-lg mb-2"
                          src={course.image_url}
                          style={{
                            aspectRatio: "150/150",
                            objectFit: "cover",
                          }}
                          width="150"
                          height="150"
                        />
                        <div className="text-yellow-500 text-lg font-semibold mb-1">
                          {course.category?.name}
                        </div>
                        <h3 className="text-lg font-semibold text-blue-950 mb-1 line-clamp-1">
                          {course.name}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                          {course?.title ||
                            "Thông tin khóa học chưa được cập nhật"}
                        </p>
                        <p className="text-sm text-gray-900 font-medium mb-4 line-clamp-1">
                          {course?.teacher?.lastName
                            ? `${course.teacher.lastName} ${course.teacher.firstName}`
                            : "Chưa có giáo viên"}
                        </p>
                        <div className="text-green-600 text-xl font-bold mb-1">
                          {course?.price}
                        </div>
                        <div className="text-gray-400 text-sm line-through">
                          {course?.originalPrice}
                        </div>
                      </Link>
                    ))}
                </Carousel>
                <Button
                  className="carousel-control right"
                  onClick={() => next(index)}
                  icon={<RightOutlined />}
                />
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
