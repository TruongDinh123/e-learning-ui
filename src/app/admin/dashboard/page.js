"use client";
import React, { useEffect, useState } from "react";
import { Typography } from "@material-tailwind/react";
import StatisticsCard from "@/components/Card/statistics-card";
import {
  BanknotesIcon,
  ChartBarIcon,
  ClockIcon,
  UserPlusIcon,
  UsersIcon,
} from "@heroicons/react/24/solid";
import statisticsCardsData from "@/data/statistics-cards-data";
import statisticsChartsData from "@/data/statistics-charts-data";
import dynamic from "next/dynamic";

const StatisticsChartDynamic = dynamic(
  () => import('@/components/Chart/statistics-chart'),
  { ssr: false }
)

export default function Dashboard() {
  return (
    <div className="mt-12">
      <div className="mb-12 grid gap-y-10 gap-x-6 md:grid-cols-2 xl:grid-cols-4">
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
      <div className="mb-6 grid grid-cols-1 gap-y-12 gap-x-6 md:grid-cols-2 xl:grid-cols-3">
        {statisticsChartsData.map((props) => (
          <StatisticsChartDynamic
            key={props.title}
            {...props}
            footer={
              <Typography
                variant="small"
                className="flex items-center font-normal text-blue-gray-600"
              >
                <ClockIcon
                  strokeWidth={2}
                  className="h-4 w-4 text-blue-gray-400"
                />
                &nbsp;{props.footer}
              </Typography>
            }
          />
        ))}
      </div>
    </div>
  );
}
