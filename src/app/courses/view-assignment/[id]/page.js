"use client";
import { viewAssignmentByCourseId } from "@/features/Assignment/assignmentSlice";
import { getScore } from "@/features/Quiz/quizSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import { Button, Spin } from "antd";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";

export default function HandleStart({ params }) {
  // const [assignment, setAssigment] = useState([]);
  // const [score, setScore] = useState([]);
  // const dispatch = useDispatch();
  // const router = useRouter();

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

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const [res, scoreRes] = await Promise.all([
  //         dispatch(viewAssignmentByCourseId({ courseId: params?.id })).then(
  //           unwrapResult
  //         ),
  //         dispatch(getScore()).then(unwrapResult),
  //       ]);

  //       if (res.status) {
  //         setAssigment(res.metadata);
  //       }
  //       if (scoreRes.status) {
  //         setScore(scoreRes.metadata);
  //       }
  //     } catch (error) {
  //       console.error(error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };

  //   fetchData();
  // }, [dispatch, params?.id]);

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
  // }, [dispatch, params?.id]);

  // const assignmentId = assignment[0]?._id;
  // const currentScore = score.find((s) => s.assignment?._id === assignmentId);

  return <h1>Hello</h1>;
}
