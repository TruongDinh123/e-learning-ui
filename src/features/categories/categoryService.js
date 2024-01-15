const { default: axiosInstance } = require("@/config/axios");

const createCategory = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/create-category",
    method: "POST",
    data: data,
  });
  return res.data;
};

const getAllCategoryAndSubCoursesById = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/get-all-categories/:categoryId",
    method: "GET",
  });
  return res.data;
};

const getAllCategoryAndSubCourses = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/get-all-categories",
    method: "GET",
  });
  return res.data;
};

const deleteCategory = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/delete-category/${data}`,
    method: "DELETE",
  });
  return res.data;
};

const updateCategory = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/update-category/${data.categoryId}`,
    method: "PUT",
  });
  return res.data;
};

export const CategoriesService = {
  createCategory,
  getAllCategoryAndSubCoursesById,
  getAllCategoryAndSubCourses,
  deleteCategory,
  updateCategory,
};
