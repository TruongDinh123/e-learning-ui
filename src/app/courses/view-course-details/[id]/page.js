"use client";
import { Avatar, Breadcrumb, Button, Collapse } from "antd";
import "../[id]/page.css";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { List } from "@material-tailwind/react";
import { useRouter } from "next/navigation";

export default function CourseDetails({ params }) {
  const dispatch = useDispatch();
  const { Panel } = Collapse;
  const [dataCourse, setDataCourse] = useState([]);
  const router = useRouter();

  useEffect(() => {
    dispatch(getACourse(params?.id))
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setDataCourse(res.metadata);
        }
      });
  }, []);

  return (
    <div className="jss1197">
      <div className="jss1189">
        <div className="jss1190"></div>
        <div className="jss1191"></div>
        <img
          src="https://res.cloudinary.com/dbrdml9bf/image/upload/v1638449082/topica/wave_iabqmr.png"
          className="jss1192"
        ></img>
        <div className="jss1185">
          <div className="jss1207">
            <Breadcrumb className="pb-2">
              <Breadcrumb.Item>
                <Link href="/">Trang chủ</Link>
              </Breadcrumb.Item>
              <Breadcrumb.Item>
                <span>{dataCourse?.name}</span>
              </Breadcrumb.Item>
            </Breadcrumb>
          </div>
          <h1 className="jss1610">{dataCourse?.name}</h1>
          <p className="jss1611">{dataCourse?.title}</p>
          <div className="mt-4">
            <Button
              type="primary"
              size="large"
              className="custom-button"
              onClick={() => router.push(`/courses/lessons/${params.id}`)}
            >
              Học ngay
            </Button>
          </div>
        </div>
      </div>
      <div className="MuiGrid-container MuiGrid-grid-xs-12 MuiGrid-grid-md-12">
        <div className="MuiGrid-root MuiGrid-container MuiGrid-justify-content-xs-center MuiGrid-grid-xs-12 MuiGrid-grid-md-12">
          <div className="MuiGrid-root jss1200 MuiGrid-item MuiGrid-grid-xs-12 MuiGrid-grid-md-8">
            <div className="p-0">
              <div className="MuiGrid-root jss1201 jss1222 MuiGrid-grid-xs-12 MuiGrid-grid-md-12">
                <div id="course-lesson-area">
                  <div className="jss1230">
                    <h2 className="jss1229">Danh sách bài học</h2>
                  </div>
                  <div className="jss1234">
                    <div className="jss1231">
                      <Collapse bordered={false}>
                        {dataCourse?.lessons?.map((lesson, index) => (
                          <Panel header={lesson.name} key={index}>
                            <p>{lesson.content}</p>
                          </Panel>
                        ))}
                      </Collapse>
                    </div>
                  </div>
                </div>
              </div>
              <div className="block md:hidden MuiGrid-root jss1201 jss1222 MuiGrid-grid-xs-12 MuiGrid-grid-md-12">
                <div className="jss1230">
                  <h2 className="jss1229">Giáo viên</h2>
                </div>
                <div className="p-4 bg-white shadow rounded-lg flex items-center">
                  <div className="flex-shrink-0">
                    <img
                      className="h-12 w-12 rounded-full"
                      src={dataCourse?.teacher?.image_url}
                      alt="Teacher avatar"
                    />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-yellow-500">
                      {`${dataCourse?.teacher?.lastName} ${dataCourse?.teacher?.firstName}`}
                    </p>
                    <p className="text-xs font-medium text-gray-700">
                      Email: {dataCourse?.teacher?.email}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* card */}
          <div
            className="MuiGrid-root MuiGrid-item MuiGrid-grid-md-3 relative flex justify-center z-[1000] hidden md:flex lg:flex"
            style={{ marginTop: "-335px" }}
          >
            <div className="jss1195">
              <div className="jss1622">
                <div className="courseImg">
                  <div className="jss1634">
                    <img
                      src="https://storage.googleapis.com/topica-media/811e34a8-702e-4d32-9137-4bf4df38488a/product/62e1ef2c2386b30026fdd90f"
                      className="jss1628 jss1636"
                    />
                    <div className="jss1638"></div>
                    <ul className="MuiList-root overviewList">
                      <li className="MuiListItem-root overviewListItem MuiListItem-gutters">
                        <div className="MuiListItemText-root overviewName">
                          <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">
                            <a className="font-bold">Giáo viên:</a>
                            {dataCourse?.teacher?.lastName}
                            {dataCourse?.teacher?.firstName}
                          </span>
                        </div>
                      </li>
                      <li className="MuiListItem-root overviewListItem MuiListItem-gutters">
                        <div className="MuiListItemText-root overviewName">
                          <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">
                            <a className="font-bold">Email:</a>
                            {dataCourse?.teacher?.email}
                          </span>
                        </div>
                      </li>
                    </ul>
                  </div>
                </div>
                <div></div>
                <div className="courseDetails">
                  <ul className="MuiList-root overviewList">
                    <h2 className="text-lg font-bold">Danh sách bài tập</h2>
                    {dataCourse?.quizzes?.slice(0, 3).map((quiz, index) => (
                      <li
                        className="MuiListItem-root overviewListItem MuiListItem-gutters"
                        key={index}
                      >
                        <div className="MuiListItemText-root overviewName">
                          <span className="MuiTypography-root MuiListItemText-primary MuiTypography-body1 MuiTypography-displayBlock">
                            {`Quiz ${index + 1}: ${quiz.name}`}
                          </span>
                        </div>
                      </li>
                    ))}
                    {dataCourse?.quizzes?.length > 3 && (
                      <Link
                        href={`/courses/view-details/${dataCourse?._id}`}
                        className="pl-4 text-blue-500"
                      >
                        Xem tất cả
                      </Link>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
