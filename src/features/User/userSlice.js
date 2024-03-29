import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { authService } from "./userService";

export const login = createAsyncThunk(
  "/e-learning/login",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.loginAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const registerUser = createAsyncThunk(
  "/e-learning/signup",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.registerAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllUser = createAsyncThunk(
  "/e-learning/users",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.getAllUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteUser = createAsyncThunk(
  "/e-learning/user/delete",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.deleteUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUser = createAsyncThunk(
  "/e-learning/update-user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.updateUser(data);
      if (response.status) {
        const userName =
          (response.data?.metadata.firstName
            ? response.data?.metadata.firstName + " "
            : "") +
          (response.data?.metadata.lastName
            ? response.data?.metadata.lastName
            : "");
        localStorage.setItem("userName", JSON.stringify(userName));
      }
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadImageUser = createAsyncThunk(
  "/e-learning/user/upload-image",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.uploadImageUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAUser = createAsyncThunk(
  "/e-learning/user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.getAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const refreshAUser = createAsyncThunk(
  "/e-learning/user",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.getAUser(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const logOut = createAsyncThunk(
  "/e-learning/log-out",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.logOut(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

//roles

export const getAllRole = createAsyncThunk(
  "/e-learning/role",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.getAllRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateUserRoles = createAsyncThunk(
  "/e-learning/user/update-user-role",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.updateUserRoles(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateRole = createAsyncThunk(
  "/e-learning/role/update",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.updateRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteRole = createAsyncThunk(
  "/e-learning/role/delete",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.deleteRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createRole = createAsyncThunk(
  "/e-learning/role/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.createRole(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const changePassword = createAsyncThunk(
  "/e-learning/change-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.changePassword(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const forgotPassword = createAsyncThunk(
  "/e-learning/forgot-password",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.forgotPassword(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

let userFromLocalStorage = null;
let userNameFromLocalStogare = null;

if (typeof window !== "undefined") {
  userFromLocalStorage = JSON.parse(localStorage?.getItem("user"));
  userNameFromLocalStogare = JSON.parse(localStorage?.getItem("userName"));
}

const initialState = {
  user: userFromLocalStorage,
  userName: userNameFromLocalStogare,
  profile: {},
  allUsers: [],
  allRoles: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUserName: (state, action) => {
      state.userName = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = action.error;
        state.message = "Something went wrong!";
      })
      .addCase(registerUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.user = action.error;
      })
      .addCase(getAllUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allUsers = action.payload;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allUsers = state.allUsersStore?.metadata?.users?.filter(user => user._id !== action.meta.arg);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(getAllRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.allRoles = action.payload;
      })
      .addCase(getAllRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateUserRoles.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUserRoles.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateUserRoles.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(createRole.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createRole.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(updateUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const { firstName, lastName, email, phoneNumber, dob, gender } =
          action.payload.metadata;
        if (firstName) state.user.firstName = firstName;
        if (lastName) state.user.lastName = lastName;
        if (email) state.user.email = email;
        if (phoneNumber) state.user.phoneNumber = phoneNumber;
        if (dob) state.user.dob = dob;
        if (gender) state.user.gender = gender;

        // Lấy dữ liệu người dùng hiện tại từ localStorage
        const currentUser = JSON.parse(localStorage.getItem("user"));

        // Cập nhật dữ liệu người dùng với thông tin mới
        const updatedUser = {
          ...currentUser,
          ...(firstName && { firstName }),
          ...(lastName && { lastName }),
          ...(email && { email }),
        };

        // Lưu dữ liệu người dùng đã cập nhật vào localStorage
        localStorage.setItem("user", JSON.stringify(updatedUser));
      })

      .addCase(updateUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(uploadImageUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(uploadImageUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        const { image_url } = action.payload.metadata;

        if (image_url) state.user.image_url = image_url;

        const currentUserImg = JSON.parse(localStorage.getItem("user"));

        const updatedUser = {
          ...currentUserImg,
          ...(image_url && { image_url }),
        };

        localStorage.setItem("user", JSON.stringify(updatedUser));
      })
      .addCase(uploadImageUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(refreshAUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(refreshAUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.user = action.payload.metadata;
      })

      .addCase(refreshAUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(resetState, () => initialState);
  },
});

export const { setUser, setUserName } = userSlice.actions;

export default userSlice.reducer;
