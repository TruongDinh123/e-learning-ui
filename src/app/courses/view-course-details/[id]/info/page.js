"use client";
import "react-quill/dist/quill.snow.css";
import dynamic from "next/dynamic";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getACourse } from "@/features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { usePathname } from "next/navigation";
const logo = "/images/logoimg.jpg";
const logodefault = "/images/placeholder.jpg";

export default function InfoCourse() {

  const stateACourse = useSelector(
    (state) => state?.course?.getACourse?.metadata
  );
  return (
    <header
      className="flex items-center space-x-4 pt-20 pb-3 lg:pt-0 lg:mt-4"
      style={{
        display: "flex",
        alignItems: "center",
      }}
    >
      <img
        src={stateACourse?.image_url || logodefault}
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
        {stateACourse?.nameCenter || "Tên trung tâm đang cập nhật..."}
      </h1>
    </header>
  );
}
