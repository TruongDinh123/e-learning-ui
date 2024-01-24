const { default: axiosInstance } = require("@/config/axios");

const loginAUser = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/login",
    method: "POST",
    data: data,
  });
  return res.data;
};

const registerAUser = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/signup",
    method: "POST",
    data: data,
  });
  return res.data;
};

const getAllUser = async (page, limit) => {
  const res = await axiosInstance({
    url: `/e-learning/users?page=${page}&limit=${limit}`,
    method: "GET",
  });
  return res.data;
};

const getAUser = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/user/" + data,
    method: "GET",
  });
  return res.data;
};

const uploadImageUser = async (data) => {
  const formData = new FormData();
  formData.append("filename", data.filename);
  const res = await axiosInstance({
    url: `/e-learning/user/${data.userId}/upload-image`,
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};

const deleteUser = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/user/" + data,
    method: "DELETE",
  });
  return res;
};

const updateUser = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/update-user/${data.id}`,
    method: "PUT",
    data: data.values,
  });
  return res;
};

const changePassword = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/change-password",
    method: "POST",
    data: data,
  });
  return res;
};

const forgotPassword = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/forgot-password",
    method: "POST",
    data: data,
  });
  return res;
};

const logOut = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/logout",
    method: "POST",
  });
  return res;
};

///roles///
const getAllRole = async () => {
  const res = await axiosInstance({
    url: "/e-learning/role",
    method: "GET",
  });
  return res.data;
};

const updateUserRoles = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/user/update-user-role",
    method: "PUT",
    data: data,
  });
  return res;
};

const createRole = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/role",
    method: "POST",
    data: data.values,
  });
  return res.data;
};

const deleteRole = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/role/${data.id}`,
    method: "DELETE",
  });
  return res;
};

const updateRole = async (data) => {
  const res = await axiosInstance({
    url: `/e-learning/role/${data.id}`,
    method: "PUT",
    data: data.values,
  });
  return res;
};

export const authService = {
  loginAUser,
  registerAUser,
  getAllUser,
  deleteUser,
  getAllRole,
  updateUserRoles,
  createRole,
  deleteRole,
  updateRole,
  updateUser,
  getAUser,
  logOut,
  changePassword,
  forgotPassword,
  uploadImageUser,
};
