import { createAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { CategoriesService } from "./categoryService";

export const createCategory = createAsyncThunk(
  "/e-learning/create-category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoriesService.createCategory(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllCategoryAndSubCoursesById = createAsyncThunk(
  "/e-learning/get-all-categories/:categoryId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoriesService.getAllCategoryAndSubCoursesById(
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getAllCategoryAndSubCourses = createAsyncThunk(
  "/e-learning/get-all-categories",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoriesService.getAllCategoryAndSubCourses(
        data
      );
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteCategory = createAsyncThunk(
  "/e-learning/delete-category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoriesService.deleteCategory(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateCategory = createAsyncThunk(
  "/e-learning/update-category",
  async (data, { rejectWithValue }) => {
    try {
      const response = await CategoriesService.updateCategory(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

const initialState = {
  categories: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: "",
};

export const resetState = createAction("Reset_all");

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllCategoryAndSubCourses.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllCategoryAndSubCourses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.categories = action.payload;
      })
      .addCase(getAllCategoryAndSubCourses.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      });
  },
});

export default categorySlice.reducer;
