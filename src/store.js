import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from 'redux-persist/lib/storage';
import { persistReducer, persistStore } from 'redux-persist';
import userReducer from "./features/User/userSlice";
import courseReducer from "./features/Courses/courseSlice";
import lessonReducer from "./features/Lesson/lessonSlice";
import quizReducer from "./features/Quiz/quizSlice";
import categoryReducer from "./features/categories/categorySlice";

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['course', 'quiz', 'user', 'lesson', 'quiz', 'category'] // chỉ lưu trữ user và course reducers, thêm hoặc bỏ qua các reducers khác tùy ý
};

const rootReducer = combineReducers({
  user: userReducer,
  course: courseReducer,
  lesson: lessonReducer,
  quiz: quizReducer,
  category: categoryReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  devTools: true,
});

export const persistor = persistStore(store);