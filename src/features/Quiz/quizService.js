const { default: axiosInstance } = require("@/config/axios");

const createQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz`,
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const viewQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseIds}/quizzes`,
    method: "GET",
  });
  return res.data;
};

const getQuizzesByStudentAndCourse = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/list-quizzes`,
    method: "GET",
  });
  return res.data;
};

const viewAQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}`,
    method: "GET",
  });
  return res.data;
};

const updateQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}`,
    method: "PUT",
    data: data.formattedValues,
  });
  return res.data;
};

const deleteQuizQuestion = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/question/${data.questionId}`,
    method: "DELETE",
  });
  return res.data;
};

const deleteQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}`,
    method: "DELETE",
  });
  return res.data;
};

const getQuizsByCourse = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/quizzes`,
    method: "GET",
  });
  return res.data;
};

const submitQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/submit`,
    method: "POST",
    data: data,
  });
  return res.data;
};

const getScore = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/score`,
    method: "GET",
    data: data,
  });
  return res.data;
};

const getScoreByUserId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/${data.quizId}/${data.userId}/score`,
    method: "GET",
    data: data,
  });
  return res.data;
};

export const QuizService = {
  createQuiz,
  viewQuiz,
  deleteQuizQuestion,
  deleteQuiz,
  updateQuiz,
  getQuizsByCourse,
  submitQuiz,
  getScore,
  getScoreByUserId,
  viewAQuiz,
  getQuizzesByStudentAndCourse,
};
