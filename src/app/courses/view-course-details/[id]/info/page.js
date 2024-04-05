import { getACourse } from "@/features/Courses/courseSlice";
import { Spin } from "antd";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

const logodefault = "/images/imagedefault.jpg";

export default function InfoCourse() {
  const dispatch = useDispatch();
  const pathname = usePathname();
  const [course, setCourse] = useState({});

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      setIsLoading(true);
      try {
        const courseId = pathname.split("/")[3];
        const res = await dispatch(getACourse(courseId));
        setCourse(res?.payload?.metadata);
      } catch (error) {
        message.error("Có lỗi xảy ra khi tải thông tin khóa học.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchDetails();
  }, [dispatch]);

  return (
    <header
      className="flex items-center space-x-4 pt-20 pb-3 lg:pt-0 lg:mt-4"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      {isLoading ? (
        <Spin />
      ) : (
        <>
          <img
            src={course?.image_url || logodefault}
            className="h-16 w-16 lg:h-24 lg:w-24 object-cover"
            style={{
              aspectRatio: "1 / 1",
            }}
          />
          <h1
            className="text-2xl lg:text-4xl font-bold text-center"
            style={{
              color: "#002c6a",
            }}
          >
            {course?.nameCenter || course?.name}
          </h1>
        </>
      )}
    </header>
  );
}
