const { default: axiosInstance } = require("@/config/axios");

const createLesson = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/lesson/" + data.courseId,
    method: "POST",
    data: data.values,
  });
  return res.data;
};

const createVdLesson = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.lessonId}/upload-video`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const viewLeson = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/lessons/" + data.courseId,
    method: "GET",
    data: data.values,
  });
  return res;
};

const viewAlesson = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/lesson/" + data.lessonId,
    method: "GET",
  });
  return res.data;
};

const deleteLesson = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.courseId}/${data.lessonId}`,
    method: "DELETE",
  });
  return res;
};

const deleteVdLesson = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/lesson/${data.lessonId}/video/${data.videoLessonId}`,
    method: "DELETE",
  });
  return res;
};

const completeLesson = async (data) =>
  await axiosInstance({
    url: `/e-learning/complete-lesson/${data.lessonId}`,
    method: "PUT",
  });

export const lessonService = {
  createLesson,
  createVdLesson,
  viewLeson,
  viewAlesson,
  deleteLesson,
  deleteVdLesson,
  completeLesson,
};
