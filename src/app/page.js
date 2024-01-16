"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Badge, Button, Carousel, Tabs } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

const fakeCourses = [
  {
    id: 1,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
  {
    id: 2,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
  {
    id: 3,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
  {
    id: 4,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
  {
    id: 5,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
  {
    id: 6,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
  },
];

const fakeCourseHighlights = [
  {
    id: 1,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
  {
    id: 2,
    title: "Lập trình C# trong 5 tuần - Nâng cao",
    description:
      "Với lộ trình 65 bài học được chia thành 8 chương, khóa học sẽ cung cấp: - Kiến thức...",
    price: "299,000 đ",
    originalPrice: "599,000 đ",
    badge: "LẬP TRÌNH - CNTT",
    instructor: "Trần Duy Thanh",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "LẬP TRÌNH-CNTT",
  },
  {
    id: 3,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "LẬP TRÌNH-CNTT",
  },
  {
    id: 4,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "LẬP TRÌNH-CNTT",
  },
  {
    id: 5,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "LẬP TRÌNH-CNTT",
  },
  {
    id: 6,
    title: "Procedural Python - Lập trình hàm trong Python",
    description:
      "Mô hình học tập tương tác mới của... Môi trường lập trình trực tuyến ngay...",
    price: "199,999 ₫",
    originalPrice: "399,999 ₫",
    badge: "HOT",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "LẬP TRÌNH-CNTT",
  },
  {
    id: 7,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
  {
    id: 8,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
  {
    id: 9,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
  {
    id: 10,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
  {
    id: 11,
    title: "IELTS Academic - Module Speaking",
    description:
      "Học viên tham gia khóa học được nhận tài khoản miễn phí thực hành IELTS tại website...",
    price: "399,000 đ",
    originalPrice: "699,000 đ",
    badge: "NGOẠI NGỮ",
    instructor: "LƯU THỊ THU HÀ",
    imageUrl:
      "https://img.freepik.com/premium-vector/learn-english-design_24908-7443.jpg?w=740",
    category: "NGOẠI NGỮ",
  },
];

export default function Home() {
  const dispatch = useDispatch();
  const [course, setCourse] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const { TabPane } = Tabs;
  const categories = [...new Set(fakeCourseHighlights.map((i) => i.category))];

  const carouselRef = React.useRef();

  const next = () => {
    carouselRef.current.next();
  };

  const previous = () => {
    carouselRef.current.prev();
  };

  const carouselRef1 = React.useRef();

  const next1 = () => {
    carouselRef1.current.next();
  };

  const previous1 = () => {
    carouselRef1.current.prev();
  };

  //viewCourses api
  // useEffect(() => {
  //   setIsLoading(true);

  //   dispatch(getCoursePublic())
  //     .then(unwrapResult)
  //     .then((res) => {
  //       if (res.status) {
  //         setCourse(res.metadata);
  //       }
  //       setIsLoading(false);
  //     })
  //     .catch((error) => {
  //       
  //       setIsLoading(false);
  //     });
  // }, []);

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
      <div className="bg-white p-4">
        <h1 className="font-bold text-2xl">
          Các khóa được mua nhiều nhất tuần qua
        </h1>
        <span>Các khóa được mua nhiều nhất tuần qua</span>
        <div className="carousel-container relative">
          <Button
            className="carousel-control left"
            onClick={previous}
            icon={<LeftOutlined />}
          />
          <Carousel
            ref={carouselRef}
            dots={false}
            slidesToShow={4.5}
            slidesToScroll={4.5}
            responsive={[
              {
                breakpoint: 1024,
                settings: {
                  slidesToShow: 4.5,
                  slidesToScroll: 4.5,
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
            {fakeCourses.map((course) => (
              <div
                key={course.id}
                className="bg-[#f7f7f7] p-4 rounded-lg shadow-md"
              >
                <Badge className="mb-2" variant="secondary">
                  {course.badge}
                </Badge>
                <img
                  alt={course.title}
                  className="w-full h-auto rounded-lg mb-2"
                  src={course.imageUrl}
                  style={{
                    aspectRatio: "150/150",
                    objectFit: "cover",
                  }}
                  width="150"
                  height="150"
                />
                <h3 className="text-lg font-semibold mb-1">{course.title}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  {course.description}
                </p>
                <div className="text-green-600 text-xl font-bold mb-1">
                  {course.price}
                </div>
                <div className="text-gray-400 text-sm line-through">
                  {course.originalPrice}
                </div>
              </div>
            ))}
          </Carousel>
          <Button
            className="carousel-control right"
            onClick={next}
            icon={<RightOutlined />}
          />
        </div>
      </div>
      <div className="bg-white p-8">
        <h2 className="text-3xl font-bold">Khóa học nổi bật</h2>
        <p className="mt-2 text-sm text-gray-600">
          Khám phá các kỹ năng được tìm kiếm nhiều nhất/hàng đầu trong tuần này
          và bắt đầu việc học của bạn ngay hôm nay
        </p>
        <Tabs defaultActiveKey="1" className="mt-4 flex space-x-4">
          {categories.map((category, index) => (
            <TabPane
              tab={category}
              key={index + 1}
              className="carousel-container relative"
            >
              <Button
                className="carousel-control left"
                onClick={previous1}
                icon={<LeftOutlined />}
              />
              <Carousel
                ref={carouselRef1}
                dots={false}
                slidesToShow={4.5}
                slidesToScroll={4.5}
                responsive={[
                  {
                    breakpoint: 1024,
                    settings: {
                      slidesToShow: 4.5,
                      slidesToScroll: 4.5,
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
                {fakeCourseHighlights
                  .filter((course) => course.category === category)
                  .map((course) => (
                    <div
                      key={course.id}
                      className="bg-[#f7f7f7] p-4 rounded-lg shadow-md"
                    >
                      <Badge className="mb-2" variant="secondary">
                        {course.badge}
                      </Badge>
                      <img
                        alt={course.title}
                        className="w-full h-auto rounded-lg mb-2"
                        src={course.imageUrl}
                        style={{
                          aspectRatio: "150/150",
                          objectFit: "cover",
                        }}
                        width="150"
                        height="150"
                      />
                      <h3 className="text-lg font-semibold mb-1">
                        {course.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {course.description}
                      </p>
                      <div className="text-green-600 text-xl font-bold mb-1">
                        {course.price}
                      </div>
                      <div className="text-gray-400 text-sm line-through">
                        {course.originalPrice}
                      </div>
                    </div>
                  ))}
              </Carousel>
              <Button
                className="carousel-control right"
                onClick={next1}
                icon={<RightOutlined />}
              />
            </TabPane>
          ))}
        </Tabs>
      </div>
    </div>
  );
}
