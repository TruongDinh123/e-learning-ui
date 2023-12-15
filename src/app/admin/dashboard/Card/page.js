"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import StatisticsCard from "@/app/admin/dashboard/Card/statistics-card";
import { viewCourses } from "@/features/Courses/courseSlice";

const StatisticsCardComponent = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [statisticsCardsData, setStatisticsCardsData] = useState([
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Total Students",
      value: "$53k",
      footer: {
        color: "text-green-500",
        value: "+55%",
        label: "than last week",
      },
    },
    {
      color: "gray",
      icon: UsersIcon,
      title: "Total Course",
      value: "2,300",
      footer: {
        color: "text-green-500",
        value: "+3%",
        label: "than last month",
      },
    },
    {
      color: "gray",
      icon: UserPlusIcon,
      title: "Public Course",
      value: "3,462",
      footer: {
        color: "text-red-500",
        value: "-2%",
        label: "than yesterday",
      },
    },
    {
      color: "gray",
      icon: ChartBarIcon,
      title: "Private Course",
      value: "$103,430",
      footer: {
        color: "text-green-500",
        value: "+5%",
        label: "than yesterday",
      },
    },
  ]);

  useEffect(() => {
    dispatch(viewCourses())
      .then(unwrapResult)
      .then((res) => {
        if (res.status) {
          setCourses(res.metadata);
        } else {
          console.error(res.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch]);

  useEffect(() => {
    const uniqueStudents = new Set();
    const publicCourses = [];
    const privateCourses = [];

    courses.forEach((course) => {
      course.students.forEach((student) => {
        uniqueStudents.add(student._id);
      });
      if (course.showCourse) {
        publicCourses.push(course);
      } else {
        privateCourses.push(course);
      }
    });
    setStatisticsCardsData((prevData) =>
      prevData.map((card) => {
        switch (card.title) {
          case "Total Students":
            return { ...card, value: uniqueStudents.size.toString() };
          case "Total Course":
            return { ...card, value: courses.length.toString() };
          case "Public Course":
            return { ...card, value: publicCourses.length.toString() };
          case "Private Course":
            return { ...card, value: privateCourses.length.toString() };
          default:
            return card;
        }
      })
    );
  }, [courses]);

  return (
    <>
      {statisticsCardsData.map(({ icon, title, footer, ...rest }) => (
        <StatisticsCard
          key={title}
          {...rest}
          title={title}
          icon={React.createElement(icon, {
            className: "w-6 h-6 text-white",
          })}
          footer={
            <Typography className="font-normal text-blue-gray-600">
              <strong className={footer.color}>{footer.value}</strong>
              &nbsp;{footer.label}
            </Typography>
          }
        />
      ))}
    </>
  );
};

export default StatisticsCardComponent;
