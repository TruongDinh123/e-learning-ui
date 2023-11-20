import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { lessonService } from "./lessonService";

export const createLesson = createAsyncThunk(
  "/e-learning/create-lesson",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.createLesson(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const createVdLesson = createAsyncThunk(
  "/e-learning/create-vd-lesson",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.createVdLesson(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewLesson = createAsyncThunk(
  "/e-learning/view-lesson/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.viewLeson(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewALesson = createAsyncThunk(
  "/e-learning/single-lesson/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.viewAlesson(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteLesson = createAsyncThunk(
  "/e-learning/delete-lesson/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.deleteLesson(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteVdLesson = createAsyncThunk(
  "/e-learning/delete-vd-lesson/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.deleteVdLesson(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const completeLesson = createAsyncThunk(
  "/e-learning/complete-lesson/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await lessonService.completeLesson(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  lesson: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const lessonSlice = createSlice({
  name: "lesson",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createLesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(createVdLesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createVdLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createVdLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(viewLesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(viewLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(deleteLesson.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteLesson.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteLesson.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      // .addCase(viewALesson.pending, (state, action) => {
      //   state.isLoading = true;
      // })
      // .addCase(viewALesson.fulfilled, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = false;
      //   state.isSuccess = true;
      // })
      // .addCase(viewALesson.rejected, (state, action) => {
      //   state.isLoading = false;
      //   state.isError = true;
      //   state.isSuccess = false;
      //   state.message = "Something went wrong!";
      // })
      .addCase(resetState, () => initialState);
  },
});

export default lessonSlice.reducer;
