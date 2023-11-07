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
      const response = await authService.getAllUser();
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

//roles

export const getAllRole = createAsyncThunk(
  "/e-learning/role",
  async (data, { rejectWithValue }) => {
    try {
      const response = await authService.getAllRole();
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

let userFromLocalStorage = null;

if (typeof window !== "undefined") {
  userFromLocalStorage = localStorage?.getItem("user");
}

const initialState = {
  user: JSON.parse(userFromLocalStorage),
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const userSlice = createSlice({
  name: "login",
  initialState,
  reducers: {},
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
      })
      .addCase(getAllUser.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
      })
      .addCase(deleteUser.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
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
      .addCase(resetState, () => initialState);
  },
});

export default userSlice.reducer;
