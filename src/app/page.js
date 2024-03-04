"use client";
import { getCoursePublic } from "@/features/Courses/courseSlice";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Carousel, Image, Input, Select, Tabs } from "antd";
import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
const thumnail1 = "/images/thumnail5.jpg";
const thumnail2 = "/images/thumnail2.jpg";
const avatar = "/images/imagedefault.jpg";
const { Option } = Select;

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

      <div className="bg-white p-6 flex flex-col lg:flex-row justify-center items-center lg:justify-start lg:items-start mt-4">
        <div className="max-w-[80%]">
          <h2 className="text-xl font-bold">ĐƠN VỊ THỰC HIỆN</h2>
          <p className="mt-2">
            Văn phòng Đào tạo Quốc tế (OISP) trực thuộc Trường ĐH Bách khoa (ĐH
            Quốc gia TP.HCM)
          </p>
          <h2 className="mt-4 text-xl font-bold">ĐỘI NGŨ BIÊN SOẠN</h2>
          <p className="mt-2">
            Giảng viên Trường ĐH Bách khoa và các trường thành viên ĐH Quốc gia
            TP.HCM
          </p>
          <h2 className="mt-4 text-xl font-bold">MỤC ĐÍCH KỲ THI</h2>
          <p className="mt-2">
            Giúp thí sinh làm quen với định dạng bài thi Đánh giá năng lực, trải
            nghiệm ngân hàng câu hỏi phong phú, sẵn sàng kiến thức và tâm lý cho
            kỳ thi chính thức.
          </p>
          <h2 className="mt-4 text-xl font-bold">CẤU TRÚC BÀI THI</h2>
          <ul className="list-disc pl-5 mt-2">
            <li>Tổng số lượng câu: 120 câu</li>
            <li>Thời gian làm bài: 150 phút</li>
          </ul>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">Nội dung</h3>
            <table className="w-full mt-2">
              <thead>
                <tr>
                  <th className="text-left font-normal">Số câu</th>
                  <th className="text-left font-normal">Thứ tự câu</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="py-1">Phần 1: Ngôn ngữ</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">1.1. Tiếng Việt</td>
                  <td className="py-1">20</td>
                  <td className="py-1">1-40</td>
                </tr>
                <tr>
                  <td className="pl-4 py-1">1.2. Tiếng Anh</td>
                  <td className="py-1">20</td>
                  <td />
                </tr>
                <tr>
                  <td className="py-1">
                    Phần 2: Toán học, tư duy logic, phân tích số liệu
                  </td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">2.1. Toán học</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">2.2. Tư duy logic</td>
                  <td className="py-1">10</td>
                  <td className="py-1">41-70</td>
                </tr>
                <tr>
                  <td className="pl-4 py-1">2.3. Phân tích số liệu</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
                <tr>
                  <td className="py-1">Phần 3: Giải quyết vấn đề</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">3.1. Hóa học</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">3.2. Vật lý</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">3.3. Sinh học</td>
                  <td className="py-1">10</td>
                  <td className="py-1">71-120</td>
                </tr>
                <tr>
                  <td className="pl-4 py-1">3.4. Địa lý</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
                <tr>
                  <td className="pl-4 py-1">3.5. Lịch sử</td>
                  <td className="py-1">10</td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-semibold">LƯU Ý</h3>
            <ul className="list-disc pl-5 mt-2">
              <li>
                Bài thi thử online chỉ mang tính chất minh họa, không dùng để
                thay thế cho bài thi chính thức.
              </li>
              <li>
                Cách chấm điểm của bài thi thử online: 10 điểm/câu (thang điểm
                cao nhất: 1.200 điểm). Cách chấm điểm của bài thi chính thức
                được xác định bằng phương pháp trắc nghiệm hiện đại theo Lý
                thuyết Ứng đáp Câu hỏi (Item Response Theory – IRT), điểm của
                từng câu hỏi có trọng số khác nhau tùy thuộc vào độ khó và độ
                phân biệt của câu hỏi. Vì vậy, kết quả của bài thi thử online
                chỉ mang tính chất tham khảo, không tương đương với kết quả bài
                thi chính thức.
              </li>
            </ul>
          </div>
          <div className="mt-4">
            <div className="max-w-2xl mx-auto my-8">
              {/* <div className="space-y-4">
                <h1 className="text-xl font-bold">HƯỚNG DẪN CÁCH LÀM BÀI</h1>
                <ul className="list-disc pl-5 space-y-2">
                  <li>
                    Bước 1: Điền thông tin của bạn (có dấu * là bắt buộc) vào
                    form bên dưới, đầy đủ và chính xác nha, vì nhà trường sẽ dựa
                    vào đó để thông báo kết quả thi thử cho bạn. Điền xong thì
                    nhấn “Start Quiz”.
                  </li>
                  <li>
                    Bước 2: Sau khi làm bài xong thì nhấn “Quiz-summary” để rà
                    lại câu nào còn sót. Cần làm hết 120 câu thì mới được công
                    nhận hoàn tất nghen.
                  </li>
                  <li>
                    Bước 3: Khi đã chắc chắn hoàn tất, nhấn “Finish quiz” để kết
                    thúc bài làm hẹn. Chúc bạn thi tốt ^^!
                  </li>
                </ul>
              </div>
              <form className="mt-8 space-y-6">
                <Input placeholder="Họ tên*" type="text" />
                <Input placeholder="Trường THPT*" type="text" />
                <Input placeholder="Số ĐT*" type="tel" />
                <Input placeholder="E-mail*" type="email" />
                <Select
                  showSearch
                  placeholder="Ngành học Bách khoa bạn quan tâm"
                  className="w-full"
                  optionFilterProp="children"
                >
                  <Option value="engineering">Engineering</Option>
                  <Option value="computer-science">Computer Science</Option>
                </Select>
                <Select
                  showSearch
                  placeholder="Chương trình Bách khoa bạn quan tâm"
                  optionFilterProp="children"
                  className="w-full"
                >
                  <Option value="undergraduate">Undergraduate</Option>
                  <Option value="postgraduate">Postgraduate</Option>
                </Select>
                <Button className="w-full">START QUIZ</Button>
              </form> */}
              <div className="mt-12">
                <h2 className="text-center text-2xl font-bold mb-6">
                  TÍCH LŨY THÊM KINH NGHIỆM “THỰC CHIẾN” VỚI CÁC ĐỀ SAU ĐÂY
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col items-center">
                    <div className="bg-[#FDBA74] p-4 rounded-t-lg">
                      <img
                        alt="Đề thi thử online 2022 đợt 1"
                        className="rounded-full"
                        height="200"
                        src={avatar}
                        style={{
                          aspectRatio: "200/200",
                          objectFit: "cover",
                        }}
                        width="200"
                      />
                    </div>
                    <Button className="rounded-b-lg bg-[#FFEDD5] text-[#991B1B]">
                      ĐỀ THI THỬ ONLINE 2022 ĐỢT 1
                    </Button>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="bg-[#93C5FD] p-4 rounded-t-lg">
                      <img
                        alt="Đề minh họa 2022 của ĐHQG-HCM"
                        className="rounded-full"
                        height="200"
                        src={avatar}
                        style={{
                          aspectRatio: "200/200",
                          objectFit: "cover",
                        }}
                        width="200"
                      />
                    </div>
                    <Button className="rounded-b-lg bg-[#DBEAFE] text-[#1D4ED8]">
                      ĐỀ MINH HỌA 2022 CỦA ĐHQG-HCM
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-[#1e40af] text-white w-full lg:max-w-[20%] lg:w-auto lg:mt-0 p-4">
          <div className="flex justify-center mb-4">
            <img
              alt="BK-OISP Logo"
              className="rounded-full"
              height="60"
              src={avatar}
              style={{
                aspectRatio: "60/60",
                objectFit: "cover",
              }}
              width="60"
            />
          </div>
          <div className="text-center mb-4">
            <p className="font-bold">BK-OISP</p>
            <p className="text-xs">TRƯỜNG ĐH BÁCH KHOA</p>
            <p className="text-xs">(ĐH QUỐC GIA TPHCM)</p>
            <p className="text-sm font-bold">TUYỂN SINH 2022</p>
          </div>
          <div className="mb-4">
            <p className="flex items-center">
              <ArrowRightIcon className="text-yellow-300 mr-1" />
              Chương trình
            </p>
            <p className="font-bold">ĐHỌC CHẤT LƯỢNG CAO, TIÊN TIẾN</p>
          </div>
          <div className="mb-4">
            <p>
              21 ngành, dạy bằng tiếng Anh, học phí ~ 36 triệu đồng/HK (chưa kể
              HK Pre-University), kế hoạch đào tạo 4 năm (chưa kể HK
              Pre-University), địa điểm học tại Cơ sở Q1. Chuẩn tiếng Anh đầu
              tuyển đạt IELTS ≥ 4.5/ TOEFL iBT ≥ 34/ TOEIC nghe – đọc ≥ 350 &
              nói – viết ≥ 190/ Duolingo ≥ 65, chuẩn tiếng Anh học chương trình
              chính khóa đạt IELTS ≥ 6.0/ TOEFL iBT ≥ 79/ TOEIC nghe – đọc ≥ 700
              & nói – viết ≥ 245 (Nếu chưa đạt, thí sinh khi trúng tuyển sẽ được
              kiểm tra trình độ tiếng Anh đầu vào và xếp lớp học tiếng Anh trong
              HK Pre-University để đạt chuẩn).
            </p>
          </div>
          <div className="mb-4">
            <p>
              Học bổng khuyến khích học tập mỗi HK lên tới 120% giá trị học
              phí/suất/HK và nhiều học bổng khác dành riêng cho SV chương trình
              đào tạo quốc tế.
            </p>
          </div>
          <div>
            <p>
              Chuẩn kỹ năng ứng dụng CNTT đầu ra MOS (Excel, PowerPoint). Bằng
              tốt nghiệp do Trường ĐHBK cấp.
            </p>
          </div>
          {/* //// */}
          <div className="mb-4">
            <p className="flex items-center">
              <ArrowRightIcon className="text-yellow-300 mr-1" />
              Chương trình
            </p>
            <p className="font-bold">ĐHỌC CHẤT LƯỢNG CAO, TIÊN TIẾN</p>
          </div>
          <div className="mb-4">
            <p>
              21 ngành, dạy bằng tiếng Anh, học phí ~ 36 triệu đồng/HK (chưa kể
              HK Pre-University), kế hoạch đào tạo 4 năm (chưa kể HK
              Pre-University), địa điểm học tại Cơ sở Q1. Chuẩn tiếng Anh đầu
              tuyển đạt IELTS ≥ 4.5/ TOEFL iBT ≥ 34/ TOEIC nghe – đọc ≥ 350 &
              nói – viết ≥ 190/ Duolingo ≥ 65, chuẩn tiếng Anh học chương trình
              chính khóa đạt IELTS ≥ 6.0/ TOEFL iBT ≥ 79/ TOEIC nghe – đọc ≥ 700
              & nói – viết ≥ 245 (Nếu chưa đạt, thí sinh khi trúng tuyển sẽ được
              kiểm tra trình độ tiếng Anh đầu vào và xếp lớp học tiếng Anh trong
              HK Pre-University để đạt chuẩn).
            </p>
          </div>
          <div className="mb-4">
            <p>
              Học bổng khuyến khích học tập mỗi HK lên tới 120% giá trị học
              phí/suất/HK và nhiều học bổng khác dành riêng cho SV chương trình
              đào tạo quốc tế.
            </p>
          </div>
          <div>
            <p>
              Chuẩn kỹ năng ứng dụng CNTT đầu ra MOS (Excel, PowerPoint). Bằng
              tốt nghiệp do Trường ĐHBK cấp.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function ArrowRightIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="m12 5 7 7-7 7" />
    </svg>
  );
}
