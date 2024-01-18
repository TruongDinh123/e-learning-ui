"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Badge, Button, Carousel, Image, Tabs } from "antd";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";

export default function Home() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  console.log("🚀 ~ course:", course);
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
          <img
            src="https://cdn2.topica.vn/b92eed95-8a0f-4ba6-bc37-aaa9205437f5/product/63b68ce8d45fde00262e81cd"
            alt="First"
            className="w-full"
          />
        </div>
        <div>
          <img
            src="https://cdn2.topica.vn/b92eed95-8a0f-4ba6-bc37-aaa9205437f5/product/63898019af47c60040e48ea7"
            alt="Second"
            className="w-full"
          />
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
                  href={`/courses/lessons/${course?._id}`}
                  key={course?._id}
                  className="bg-[#f7f7f7] p-4 rounded-lg shadow-md"
                >
                  <Badge className="mb-2" variant="secondary">
                    {course?.badge}
                  </Badge>
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
                  <h3 className="text-lg font-semibold mb-1">{course.name}</h3>
                  <p className="text-sm text-gray-600 mb-4">
                    {course?.description}
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
                  slidesToShow={slidesToShow}
                  slidesToScroll={slidesToShow}
                  centerMode={slidesToShow}
                  responsive={[
                    {
                      breakpoint: 1024,
                      settings: {
                        slidesToShow: slidesToShow < 4.5 ? slidesToShow : 4.5,
                        slidesToScroll: slidesToShow < 4.5 ? slidesToShow : 4.5,
                      },
                    },
                    {
                      breakpoint: 600,
                      settings: {
                        slidesToShow: slidesToShow < 2 ? slidesToShow : 2,
                        slidesToScroll: slidesToShow < 2 ? slidesToShow : 2,
                      },
                    },
                    {
                      breakpoint: 480,
                      settings: {
                        slidesToShow: slidesToShow < 1 ? slidesToShow : 1,
                        slidesToScroll: slidesToShow < 1 ? slidesToShow : 1,
                      },
                    },
                  ]}
                >
                  {course
                    .filter((course) => course.category?.name === category)
                    .map((course) => (
                      <Link
                        key={course?._id}
                        href={`/courses/lessons/${course?._id}`}
                        className="bg-[#f7f7f7] p-4 rounded-lg shadow-md cursor-pointer"
                      >
                        <Badge className="mb-2" variant="secondary">
                          {course?.badge}
                        </Badge>
                        <Image
                          alt={course.title}
                          className="h-auto rounded-lg mb-2"
                          src={course.image_url}
                          style={{
                            aspectRatio: "150/150",
                            objectFit: "cover",
                          }}
                        />
                        <h3 className="text-lg font-semibold mb-1 line-clamp-1">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-600 mb-4">
                          {course?.description}
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
