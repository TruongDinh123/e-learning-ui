import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getActiveCoursePresent,
  updateCourseCurrent,
} from "../features/Courses/courseSlice";
import { unwrapResult } from "@reduxjs/toolkit";
import {
  getSubmissionTimeActiveQuizByCourseId,
  getQuizForUserScreen,
} from "../features/Quiz/quizSlice";
import { message } from "antd";

const useInitUserScreen = ({ idCourse }) => {
  const dispatch = useDispatch();
  const [messageApi] = message.useMessage();
  const user = useSelector((state) => state.user.user);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await dispatch(getActiveCoursePresent()).then(unwrapResult);
        if (res.status === 200) {
          const desiredCourse = res.metadata;

          dispatch(
            getSubmissionTimeActiveQuizByCourseId({
              courseId: desiredCourse._id,
            })
          );
          dispatch(updateCourseCurrent({ quizCurrent: desiredCourse }));
        }
      } catch (error) {
        console.error(error);
      }
    };

    fetchData();
  }, [dispatch, idCourse]);

  useEffect(() => {
    const fetchQuizInfo = () => {
      dispatch(getQuizForUserScreen())
        .then(unwrapResult)
        .then((res) => {
          console.log("🚀 ~ res:", res);
          if (!res.status) {
            messageApi.error(res.message);
          }
        });
    };
    user && fetchQuizInfo();
  }, [dispatch, messageApi, user]);
};

export default useInitUserScreen;
