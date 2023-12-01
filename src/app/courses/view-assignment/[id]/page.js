"use client";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import { Button } from "@material-tailwind/react";
import { unwrapResult } from "@reduxjs/toolkit";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import ButtonStart from "../handle-start/page";

export default function HandleStart({ params }) {
  const [assignment, setAssigment] = useState([]);
  const [score, setScore] = useState([]);
  const dispatch = useDispatch();
  const router = useRouter();

  // const handleStart = async () => {
  //   try {
  //     const res = await dispatch(
  //       viewAssignmentByCourseId({ courseId: params?.id })
  //     ).then(unwrapResult);
  //     if (res.status) {
  //       router.push(`/courses/view-assignment/list-assignment/${params?.id}`);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //   }
  // };

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const assignmentPromise = dispatch(
  //         viewAssignmentByCourseId({ courseId: params?.id })
  //       ).then(unwrapResult);
  //       const scorePromise = dispatch(getScore()).then(unwrapResult);

  //       const res = await assignmentPromise;
  //       if (res.status) {
  //         setAssigment(res.metadata);
  //       }

  //       const scoreRes = await scorePromise;
  //       if (scoreRes.status) {
  //         setScore(scoreRes.metadata);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   };

  //   fetchData();
  // }, [params?.id]);

  const assignmentId = assignment[0]?._id;
  const currentScore = score.find((s) => s.assignment?._id === assignmentId);

  return score?.some(
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
    <ButtonStart courseId={params?.id} />
  );
}
