import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { courseService } from "./courseService";

export const createCourse = createAsyncThunk(
  "/e-learning/course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.createCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewCourses = createAsyncThunk(
  "/e-learning/get-courses",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.viewCourse();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "/e-learning/course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.deleteCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const editCourse = createAsyncThunk(
  "/e-learning/update-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.editCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getACourse = createAsyncThunk(
  "/e-learning/single/course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getACourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const addStudentToCourse = createAsyncThunk(
  "/e-learning/invite-user-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.addStudentToCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const removeStudentFromCourse = createAsyncThunk(
  "/e-learning/delete-user-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.removeStudentFromCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getStudentCourses = createAsyncThunk(
  "/e-learning/get-student-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getStudentCourses();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCourseCompletion = createAsyncThunk(
  "/e-learning/get-complete-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getCourseCompletion(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getCoursePublic = createAsyncThunk(
  "/e-learning/get-public-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.getPublicCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const buttonPublicCourse = createAsyncThunk(
  "/e-learning/get-public-course/",
  async (data, { rejectWithValue }) => {
    console.log("🚀 ~ data:", data);
    try {
      const response = await courseService.buttonPublicCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const buttonPriavteourse = createAsyncThunk(
  "/e-learning/get-priavte-course/",
  async (data, { rejectWithValue }) => {
    try {
      const response = await courseService.buttonPriavteCourse(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  course: "",
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const courseSlice = createSlice({
  name: "course",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(createCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(createCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(viewCourses.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(viewCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(deleteCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(deleteCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(editCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(editCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(editCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getACourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getACourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getACourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(resetState, () => initialState);
  },
});

export default courseSlice.reducer;
