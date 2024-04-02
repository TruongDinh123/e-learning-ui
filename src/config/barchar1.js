"use client";
import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const BarChart1 = ({ chartData }) => {
  const labels = chartData.map((data) => data.x);
  const dataValues = chartData.map((data) => data.y);
  const data = {
    defaultFontFamily: "Poppins",
    labels: labels,
    datasets: [
      {
        label: "Điểm số",
        data: dataValues,
        borderColor: "rgba(58, 128, 255, 1)",
        borderWidth: "0",
        backgroundColor: "rgba(58, 128, 255, 0.8)",
        barThickness: 40,
      },
    ],
  };

  const options = {
    plugins: {
      legend: false,
    },
    scales: {
      y: {
        ticks: {
          beginAtZero: true,
        },
      },
      x: {
        barPercentage: 0.5,
      },
    },
  };

  return <Bar data={data} height={150} options={options} />;
};

export default BarChart1;
