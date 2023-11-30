"use client";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import { Button } from "@material-tailwind/react";
import { unwrapResult } from "@reduxjs/toolkit";
import { Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function HandleStart({ params }) {
  const [assignment, setAssigment] = useState([]);
  const [score, setScore] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleStart = async () => {
    try {
      setIsLoading(true);
      const res = await dispatch(
        viewAssignmentByCourseId({ courseId: params?.id })
      ).then(unwrapResult);
      if (res.status) {
        router.push(`/courses/view-assignment/list-assignment/${params?.id}`);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [res, scoreRes] = await Promise.all([
          dispatch(viewAssignmentByCourseId({ courseId: params?.id })).then(
            unwrapResult
          ),
          dispatch(getScore()).then(unwrapResult),
        ]);

        if (res.status) {
          setAssigment(res.metadata);
        }
        if (scoreRes.status) {
          setScore(scoreRes.metadata);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [dispatch, params?.id]);

  const assignmentId = assignment[0]?._id;
  const currentScore = score.find((s) => s.assignment?._id === assignmentId);

  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : (
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
      )}
    </div>
  );
}
