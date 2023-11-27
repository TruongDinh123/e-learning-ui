"use client";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { unwrapResult } from "@reduxjs/toolkit";
import { viewCourses } from "../features/Courses/courseSlice";
import {
  BanknotesIcon,
  UserPlusIcon,
  UsersIcon,
  ChartBarIcon,
} from "@heroicons/react/24/solid";
import { Typography } from "@material-tailwind/react";
import StatisticsCard from "@/app/admin/dashboard/Card/statistics-card";

const StatisticsCardComponent = () => {
  const dispatch = useDispatch();
  const [courses, setCourses] = useState([]);
  const [statisticsCardsData, setStatisticsCardsData] = useState([
    {
      color: "gray",
      icon: BanknotesIcon,
      title: "Today's Money",
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
      title: "Today's Users",
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
      title: "New Clients",
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
      title: "Sales",
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
          setCourses(res.data.metadata);
          // Update statisticsCardsData here with the courses data
          // For example, if you want to update the "Today's Users" card with the number of courses:
          setStatisticsCardsData((prevData) =>
            prevData.map((card) => {
              if (card.title === "Today's Users") {
                return { ...card, value: courses.length.toString() };
              }
              return card;
            })
          );
        } else {
          console.error(res.message);
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }, [dispatch]);

  return (
    <div>
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
    </div>
  );
};

export default StatisticsCardComponent;
