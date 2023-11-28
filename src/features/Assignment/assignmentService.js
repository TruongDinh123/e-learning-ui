const { default: axiosInstance } = require("@/config/axios");

const createAssignment = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/assignment",
    method: "POST",
    data: data.formattedValues,
  });
  return res.data;
};

const viewAssignmentByCourseId = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/assignment`,
    method: "GET",
  });
  return res.data;
};

const submitAssignment = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/assignment/${data.assignmentId}/submit`,
    method: "POST",
    data: data,
  });
  return res.data;
};

const updateAssignment = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/assignment/${data.assignmentId}`,
    method: "PUT",
    data: data.formattedValues,
  });
  return res.data;
};

const deleteQuizAssignment = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/assignment/${data.assignmentId}/question/${data.questionId}`,
    method: "DELETE",
  });
  return res.data;
};

export const AssignmentService = {
  createAssignment,
  viewAssignmentByCourseId,
  submitAssignment,
  updateAssignment,
  deleteQuizAssignment,
};
