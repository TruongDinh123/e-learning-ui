"use client";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import { Button } from "@material-tailwind/react";
import { unwrapResult } from "@reduxjs/toolkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function ButtonStart(props) {
  const { courseId } = props;
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStart = async () => {
    try {
      const res = await dispatch(
        viewAssignmentByCourseId({ courseId: courseId })
      ).then(unwrapResult);
      if (res.status) {
        router.push(`/courses/view-assignment/list-assignment/${courseId}`);
      }
    } catch (error) {
      console.error(error);
    }
  };
  
  // if (!startQuiz) {
  //   return (
  //     <div className="pt-52 pb-52 flex justify-center items-center">
  //       <div className="rounded-lg bg-slate-100 p-4 items-center justify-center">
  //         <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
  //           Bài kiểm tra
  //         </h3>
  //         <p className="w-[230px] text-center font-bold text-red-600">
  //           Không được phép thoát ra khỏi màn hình khi thời gian chưa kết thúc.
  //         </p>
  //         <Button
  //           type="primary"
  //           onClick={handleStartQuiz}
  //           className="mx-auto block px-6 custom-button text-white font-bold rounded mt-10 text-center text-base"
  //         >
  //           Kiểm tra
  //         </Button>
  //       </div>
  //     </div>
  //   );
  // }

  return (
    <div className="flex items-center justify-center">
      <div className="rounded-lg bg-gray-50 px-16 py-14 items-center justify-center">
        <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
          Test!!!
        </h3>
        <p className="w-[230px] text-center font-bold text-red-600">
          Please do not exit at the beginning of the test!!!
        </p>
        <Button
          type="primary"
          onClick={handleStart}
          className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300"
        >
          Start
        </Button>
      </div>
    </div>
  );
}
