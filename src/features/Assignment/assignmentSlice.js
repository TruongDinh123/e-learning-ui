import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AssignmentService } from "./assignmentService";

export const createAssignment = createAsyncThunk(
  "/e-learning/create-assignment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignmentService.createAssignment(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAssignmentByCourseId = createAsyncThunk(
  "/e-learning/view-assignment-by-course-id",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignmentService.viewAssignmentByCourseId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitAssignment = createAsyncThunk(
  "/e-learning/submit-assignment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignmentService.submitAssignment(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateAssignment = createAsyncThunk(
  "/e-learning/update-assignment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignmentService.updateAssignment(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteQuizAssignment = createAsyncThunk(
  "/e-learning/delete-assignment",
  async (data, { rejectWithValue }) => {
    try {
      const response = await AssignmentService.deleteQuizAssignment(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  quiz: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const assignmentSlice = createSlice({
  name: "assignment",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createAssignment.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(viewAssignmentByCourseId.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewAssignmentByCourseId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(viewAssignmentByCourseId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(submitAssignment.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(submitAssignment.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(submitAssignment.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      });
  },
});

export default assignmentSlice.reducer;
