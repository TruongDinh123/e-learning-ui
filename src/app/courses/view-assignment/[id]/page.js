"use client";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import { Button } from "@material-tailwind/react";
import { unwrapResult } from "@reduxjs/toolkit";
import {  Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
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
    setIsLoading(true);
    Promise.all([
      dispatch(viewAssignmentByCourseId({ courseId: params?.id })).then(
        unwrapResult
      ),
      dispatch(getScore()).then(unwrapResult),
    ])
      .then(([res, scoreRes]) => {
        if (res.status) {
          setAssigment(res.metadata);
        }
        if (scoreRes.status) {
          setScore(scoreRes.metadata);
        }
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  // const assignmentId = assignment[0]?._id;
  // const currentScore = score.find((s) => s.assignment?._id === assignmentId);

  const assignmentId = useMemo(() => assignment[0]?._id, [assignment]);
  const currentScore = useMemo(
    () => score.find((s) => s.assignment?._id === assignmentId),
    [score, assignmentId]
  );
  return (
    <div>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Spin />
        </div>
      ) : score?.some(
          (s) => s?.assignment?._id === assignmentId && s?.isComplete
        ) ? (
        <div className="flex items-center justify-center">
          <div className="rounded-lg bg-gray-50 px-16 py-14">
            <div className="flex justify-center">
              <div className="rounded-full bg-green-200 p-6">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-500 p-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="h-8 w-8 text-white"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4.5 12.75l6 6 9-13.5"
                    />
                  </svg>
                </div>
              </div>
            </div>
            <h3 className="my-4 text-center text-3xl font-semibold text-gray-700">
              Complete!!!
            </h3>
            <p className="w-[230px] text-center font-normal text-gray-600">
              You finished with a score: {currentScore?.score}
            </p>
            <div>
              <Link href="/courses/view-course">
                <div className="mx-auto mt-10 block rounded-xl border-4 border-transparent bg-orange-400 px-6 py-3 text-center text-base font-medium text-orange-100 outline-8 hover:outline hover:duration-300">
                  Home
                </div>
              </Link>
            </div>
          </div>
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
