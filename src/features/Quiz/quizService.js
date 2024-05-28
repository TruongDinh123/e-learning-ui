const { default: axiosInstance } = require("@/config/axios");

const createQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz`,
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const draftQuiz = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/quiz/draft",
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const DeletedraftQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/draft/${data.quizIdDraft}`,
    method: "DELETE",
    data: data,
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

const getDraftQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/draft-quiz`,
    method: "GET",
  });
  return res.data;
};

const viewQuizInfo = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseIds}/info-quizz`,
    method: "GET",
  });
  return res.data;
};

const startQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/${data.quizId}/start`,
    method: "POST",
  });
  return res.data;
};

const getQuizzesByStudentAndCourse = async (data) => {
  try {
    const res = await axiosInstance({
      url: `/e-learning/course/${data.courseId}/list-quizzes`,
      method: "GET",
    });
    return res;
  } catch (error) {
    // Xử lý lỗi ở đây mà không cần in ra console
    return null;
  }
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

const uploadQuestionImage = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/quiz/upload-image-question`,
    method: "POST",
    data: data,
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

const viewAQuizForUserScreen = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quizForUserScreen/${data.quizId}`,
    method: "GET",
  });
  return res.data;
};

const viewAQuizTemplate = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz-template/${data.quizTemplateId}`,
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

const deleteQuestionImage = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/quiz/delete-image-question`,
    method: "DELETE",
    data: data,
  });
  return res.data;
}

const deleteScorebyQuiz = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/score/${data.scoreId}/delete-score`,
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

const getScoreByInfo = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/info-score`,
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

const getAllScoresByCourseId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/get-all-score/${data.courseId}`,
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

const getSubmissionTimeLatestQuizByCourseId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/quizzeLatesSubmissionTime`,
    method: "GET",
    data: data,
  });
  return res.data;
};

const getInfoCommonScoreByUserId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/score/quizzeLatesInfoCommon`,
    method: "GET",
    data: data,
  });
  return res.data;
};

const getAllUserFinishedCourse = async (data) => {
    const res = await axiosInstance({
        url: `/e-learning/userFinishedCourses/${data._id}`,
        method: "GET",
        data: data,
    });
    return res.data;
}

const getTestCount = async (userId) => {
  const res = await axiosInstance({
      url: `/e-learning/quiz/getTestCount/${userId}`,
      method: "GET",
  });
  return res.data;
}

const getUserTested = async (quizId) => {
  const res = await axiosInstance({
      url: `/e-learning/quiz/${quizId}/user-tested`,
      method: "GET",
  });
  return res.data;
}


export const QuizService = {
  createQuiz,
  draftQuiz,
  viewQuiz,
  deleteQuizQuestion,
  deleteQuiz,
  updateQuiz,
  getQuizsByCourse,
  submitQuiz,
  getScore,
  getScoreByUserId,
  getScoreByInfo,
  viewAQuiz,
  viewAQuizForUserScreen,
  getQuizzesByStudentAndCourse,
  uploadFileQuiz,
  submitQuizEssay,
  getScoreByQuizId,
  updateScore,
  uploadFileUserSubmit,
  viewQuizTemplates,
  viewAQuizTemplate,
  deleteQuizTempplate,
  updateQuizTemplate,
  startQuiz,
  uploadQuestionImage,
  viewQuizInfo,
  deleteScorebyQuiz,
  getAllScoresByCourseId,
  getDraftQuiz,
  DeletedraftQuiz,
  deleteQuestionImage,
  getSubmissionTimeLatestQuizByCourseId,
  getInfoCommonScoreByUserId,
  getAllUserFinishedCourse,
  getTestCount,
  getUserTested
};
