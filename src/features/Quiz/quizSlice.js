import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { QuizService } from "./quizService";

export const createQuiz = createAsyncThunk(
  "/e-learning/create-quiz",
  async (data, { rejectWithValue }) => {
    console.log("🚀 ~ data:", data);
    try {
      const response = await QuizService.createQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewQuiz = createAsyncThunk(
  "/e-learning/view-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.viewQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  "/e-learning/update-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.updateQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  "/e-learning/delete-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.deleteQuiz(data);
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

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(viewQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(viewQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(updateQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(updateQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(updateQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(resetState, () => initialState);
  },
});

export default quizSlice.reducer;
