"use client";
import CustomCard from "@/components/comman/CustomCard";

export default function Course() {
  // const [courses, setCourses] = useState([]);

  // const getCourses = async () => {
  //   const courses = await axiosInstance({
  //     method: "GET",
  //     url: "/get-courses",
  //   });
  //   console.log("🚀 ~ courses:", courses);

  //   if (courses.status === 200) {
  //     setCourses(courses.data);
  //   }
  // };

  // useEffect(() => {
  //   getCourses();
  // });
  return (
    <main className="py-5">
      <div className="container-fluid">
        <div className="row">
          <div className="col-4">
            <CustomCard />
          </div>
        </div>
      </div>
    </main>
  );
}
