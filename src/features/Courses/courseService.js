const { default: axiosInstance } = require("@/config/axios");

const createCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/course",
    method: "POST",
    data: data,
  });
  return res.data;
};

const viewCourse = async () => {
  const res = await axiosInstance({
    url: "/e-learning/get-courses",
    method: "GET",
  });
  return res;
};

const deleteCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/course/" + data,
    method: "DELETE",
  });
  return res;
};

const editCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/update-course/" + data.id,
    method: "PUT",
    data: data.values,
  });
  return res.data;
};

const getACourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/course/" + data,
    method: "GET",
  });
  return res.data;
};

const addStudentToCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/invite-user-course/" + data.courseId,
    method: "POST",
    data: data.values,
  });
  return res.data;
};

const removeStudentFromCourse = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/delete-user-course/user/${userId}/course/${courseId}`,
    method: "DELETE",
  });
  return res;
};

const getStudentCourses = async () => {
  const res = await axiosInstance({
    url: "/e-learning/get-student-course",
    method: "GET",
  });
  return res.data;
};

const getCourseCompletion = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/get-complete-course/" + data.courseId,
    method: "GET",
  });
  return res.data;
};

export const courseService = {
  createCourse,
  viewCourse,
  deleteCourse,
  editCourse,
  getACourse,
  addStudentToCourse,
  removeStudentFromCourse,
  getStudentCourses,
  getCourseCompletion,
};
