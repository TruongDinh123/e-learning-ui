const { default: axiosInstance } = require("@/config/axios");

const createQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz`,
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const viewQuizTemplates = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/templates`,
    method: "GET",
    data: data,
  });
  return res.data;
};

const deleteQuizTempplate = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/templates/${data.quizTemplateId}`,
    method: "DELETE",
    data: data,
  });
  return res.data;
};

const updateQuizTemplate = (data) => {
  return axiosInstance({
    url: `/e-learning/quiz/templates/${data.quizTemplateId}`,
    method: "PUT",
    data: data.formattedValues,
  });
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

const uploadFileQuiz = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/upload-file`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const uploadFileUserSubmit = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/upload-file-user`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
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

const getScoreByQuizId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/all-score`,
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

const submitQuizEssay = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/submit-essay`,
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

const updateScore = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/score/update`,
    method: "PUT",
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
  uploadFileQuiz,
  submitQuizEssay,
  getScoreByQuizId,
  updateScore,
  uploadFileUserSubmit,
  viewQuizTemplates,
  deleteQuizTempplate,
  updateQuizTemplate,
};
