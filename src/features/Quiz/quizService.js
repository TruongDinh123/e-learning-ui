const { default: axiosInstance } = require("@/config/axios");

const createQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.lessonId}/quiz`,
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const viewQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.lessonId}/quizs`,
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

const deleteQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/question/${data.questionId}`,
    method: "DELETE",
  });
  return res.data;
};

const getQuizsByLesson = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.lessonId}/quizs`,
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

export const QuizService = {
  createQuiz,
  viewQuiz,
  deleteQuiz,
  updateQuiz,
  getQuizsByLesson,
  submitQuiz,
  getScore,
};
