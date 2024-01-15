const { default: axiosInstance } = require("@/config/axios");

const createCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/course",
    method: "POST",
    data: data,
  });
  return res.data;
};

const uploadImageCourse = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/upload-image`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const viewCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/get-courses",
    method: "GET",
    data: data,
  });
  return res;
};

const deleteCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/course/" + data,
    method: "DELETE",
  });
  return res.data;
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

const addTeacherToCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/invite-teacher-course/" + data.courseId,
    method: "POST",
    data: data.values,
  });
  return res.data;
};

const updateCourseTeacher = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/update-teacher-course/" + data.courseId,
    method: "PUT",
    data: data.values,
  });
  return res.data;
};

const removeStudentFromCourse = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/delete-user-course/user/${data.userId}/course/${data.courseId}`,
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

const getPublicCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/public-course/",
    method: "GET",
  });
  return res.data;
};

const buttonPublicCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/public-course/" + data,
    method: "POST",
  });
  return res;
};

const buttonPriavteCourse = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/priavte-course/" + data,
    method: "POST",
  });
  return res;
};

const createNotification = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/course/${data.courseId}/notifications`,
    method: "POST",
    data: data,
  });
  return res;
};

//sub-course
const getAllSubCoursesById = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/get-all-subcourses/${data.subCourseId}`,
    method: "GET",
  });
  return res.data;
};

const getAllSubCourses = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/get-all-subcourses",
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
  getPublicCourse,
  buttonPublicCourse,
  buttonPriavteCourse,
  addTeacherToCourse,
  createNotification,
  uploadImageCourse,
  updateCourseTeacher,
  getAllSubCourses,
  getAllSubCoursesById,
};
