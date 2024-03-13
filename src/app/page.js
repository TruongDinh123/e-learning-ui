"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Carousel, Image, Tabs } from "antd";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import {
  CarouselProvider,
  Slider,
  Slide,
  ButtonBack,
  ButtonNext,
} from "pure-react-carousel";
import "pure-react-carousel/dist/react-carousel.es.css";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useMediaQuery } from "react-responsive";
import "react-quill/dist/quill.snow.css";

const thumnail1 = "/images/thumnail1.jpg";
const thumnail2 = "/images/thumnail3.jpg";
const thumnail3 = "/images/thumnail4.jpg";
const thumnail4 = "/images/thumnail6.jpg";
const thumnail5 = "/images/thumnail7.jpg";
const thumnail6 = "/images/thumnail8.jpg";
const thumnail7 = "/images/thumnail9.jpg";

export default function Home1() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const isMobile = useMediaQuery({ query: "(max-width: 768px)" });

  const { TabPane } = Tabs;
  const categories = [
    ...new Set(
      course
        .filter(
          (i) =>
            course.filter((c) => c.category?.name === i.category?.name).length >
            0
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
        <div>
          <img src={thumnail3} alt="Second" className="w-full" />
        </div>
        <div>
          <img src={thumnail4} alt="Second" className="w-full" />
        </div>
        <div>
          <img src={thumnail5} alt="Second" className="w-full" />
        </div>
        <div>
          <img src={thumnail6} alt="Second" className="w-full" />
        </div>
        <div>
          <img src={thumnail7} alt="Second" className="w-full" />
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
            {/* <Button
              className="carousel-control left"
              onClick={() => carouselRefs.current.all.current.prev()}
              icon={<LeftOutlined />}
            /> */}
            <CarouselProvider
              naturalSlideWidth={100}
              naturalSlideHeight={125}
              totalSlides={course.length}
              // visibleSlides={Math.min(5, course.length)}
              visibleSlides={
                isMobile
                  ? Math.min(1, course.length)
                  : Math.min(5, course.length)
              }
              isIntrinsicHeight={true}
            >
              {course.length < (isMobile ? 2 : 5) ? null : (
                <ButtonBack className="carousel-control left">
                  <IoIosArrowBack />
                </ButtonBack>
              )}

              <Slider>
                {course.map((course, index) => (
                  <Slide index={index} key={index} className="pr-3">
                    <div className="bg-[#f7f7f7] p-4 rounded-lg shadow-md cursor-pointer flex flex-col items-center min-w-0">
                      <Link
                        href={`/courses/view-course-details/${course._id}`}
                        className="cursor-pointer"
                      >
                        <img
                          alt="Hình ảnh khóa học"
                          className="w-full h-auto rounded-lg mb-2"
                          src={course.image_url}
                          style={{
                            aspectRatio: "150/150",
                            objectFit: "cover",
                          }}
                          width="150"
                          height="150"
                        />
                        <div className="flex-grow">
                          <div className="text-yellow-500 text-lg font-semibold mb-1">
                            {course.category?.name}
                          </div>
                          <h3 className="text-lg font-semibold text-blue-950 mb-1 line-clamp-1">
                            {course.name}
                          </h3>
                          <p
                            className={`overflow-hidden text-sm text-gray-600 mb-4 line-clamp-2 ${
                              isMobile ? "view ql-editor" : ""
                            }`}
                            dangerouslySetInnerHTML={{
                              __html: `${
                                course?.title ||
                                "Thông tin khóa học chưa được cập nhật"
                              }`,
                            }}
                          />
                          <p className="text-sm text-gray-900 font-medium mb-4 line-clamp-1">
                            {course?.teacher?.lastName
                              ? `${course.teacher.lastName} ${course.teacher.firstName}`
                              : "Chưa có giáo viên"}
                          </p>
                        </div>
                      </Link>
                    </div>
                  </Slide>
                ))}
                {course.length < (isMobile ? 2 : 5) &&
                  [...Array((isMobile ? 2 : 5) - course.length)].map(
                    (_, index) => (
                      <Slide
                        index={course.length + index}
                        key={course.length + index}
                      ></Slide>
                    )
                  )}
              </Slider>

              {course.length < (isMobile ? 2 : 5) ? null : (
                <ButtonNext className="carousel-control right">
                  <IoIosArrowForward />
                </ButtonNext>
              )}
            </CarouselProvider>
          </TabPane>

          {/* // Cấu hình Carousel cho từng category */}
          {categories.map((category, index) => {
            return (
              <TabPane
                tab={category}
                key={index + 1}
                className="carousel-container relative"
              >
                <CarouselProvider
                  naturalSlideWidth={100}
                  naturalSlideHeight={125}
                  totalSlides={course.length}
                  visibleSlides={
                    isMobile
                      ? Math.min(1, course.length)
                      : Math.min(5, course.length)
                  }
                  isIntrinsicHeight={true}
                >
                  {course.length < (isMobile ? 2 : 5) ? null : (
                    <ButtonBack className="carousel-control left">
                      <IoIosArrowBack />
                    </ButtonBack>
                  )}

                  <Slider>
                    {course
                      .filter((course) => course.category?.name === category)
                      .map((course, index) => (
                        <Slide index={index} key={index} className="pr-3">
                          <div className="bg-[#f7f7f7] p-4 rounded-lg shadow-md cursor-pointer flex flex-col items-center min-w-0">
                            <Link
                              href={`/courses/view-course-details/${course._id}`}
                              className="cursor-pointer"
                            >
                              <img
                                alt="Hình ảnh khóa học"
                                className="w-full h-auto rounded-lg mb-2"
                                src={course.image_url}
                                style={{
                                  aspectRatio: "150/150",
                                  objectFit: "cover",
                                }}
                                width="150"
                                height="150"
                              />
                              <div className="flex-grow">
                                <div className="text-yellow-500 text-lg font-semibold mb-1">
                                  {course.category?.name}
                                </div>
                                <h3 className="text-lg font-semibold text-blue-950 mb-1 line-clamp-1">
                                  {course.name}
                                </h3>
                                <p
                                  className={`overflow-hidden text-sm text-gray-600 mb-4 line-clamp-2 ${
                                    isMobile ? "view ql-editor" : ""
                                  }`}
                                  dangerouslySetInnerHTML={{
                                    __html: `${
                                      course?.title ||
                                      "Thông tin khóa học chưa được cập nhật"
                                    }`,
                                  }}
                                />
                                <p className="text-sm text-gray-900 font-medium mb-4 line-clamp-1">
                                  {course?.teacher?.lastName
                                    ? `${course.teacher.lastName} ${course.teacher.firstName}`
                                    : "Chưa có giáo viên"}
                                </p>
                              </div>
                            </Link>
                          </div>
                        </Slide>
                      ))}
                    {course.length < (isMobile ? 2 : 5) &&
                      [...Array((isMobile ? 2 : 5) - course.length)].map(
                        (_, index) => (
                          <Slide
                            index={course.length + index}
                            key={course.length + index}
                          />
                        )
                      )}
                  </Slider>

                  {course.length < (isMobile ? 2 : 5) ? null : (
                    <ButtonNext className="carousel-control right">
                      <IoIosArrowForward />
                    </ButtonNext>
                  )}
                </CarouselProvider>
                {/* <Button
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
                  {course &&
                    course
                      .filter((course) => course.category?.name === category)
                      .map((course, index) => (
                        <div key={index}>
                          <Link
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
                        </div>
                      ))}
                </Carousel>
                <Button
                  className="carousel-control right"
                  onClick={() => next(index)}
                  icon={<RightOutlined />}
                /> */}
              </TabPane>
            );
          })}
        </Tabs>
      </div>
    </div>
  );
}
