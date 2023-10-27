import { combineReducers, configureStore } from "@reduxjs/toolkit";
import userReducer from "./features/User/userSlice";
import courseReducer from "./features/Courses/courseSlice";
import lessonReducer from "./features/Lesson/lessonSlice";
import quizReducer from "./features/Quiz/quizSlice";

export function makeStore() {
  return configureStore({
    reducer: combineReducers({
      user: userReducer,
      course: courseReducer,
      lesson: lessonReducer,
      quiz: quizReducer,
    }),
    devTools: true,
  });
}

export const store = makeStore();
