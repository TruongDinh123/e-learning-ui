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

const getAllUser = async () => {
  const res = await axiosInstance({
    url: "/e-learning/users",
    method: "GET",
  });
  return res;
};

const deleteUser = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/user/" + data,
    method: "DELETE",
  });
  return res;
};

///roles///
const getAllRole = async () => {
  const res = await axiosInstance({
    url: "/e-learning/role",
    method: "GET",
  });
  return res;
};

const updateUserRoles = async (data) => {
  const res = await axiosInstance({
    url: "/e-learning/user/update-user-role",
    method: "PUT",
    data: data,
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
};
