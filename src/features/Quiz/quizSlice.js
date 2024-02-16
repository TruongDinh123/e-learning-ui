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

export const startQuiz = createAsyncThunk(
  "/e-learning/start-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.startQuiz(data);
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

export const viewInfoQuiz = createAsyncThunk(
  "/e-learning/view-quiz-info",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.viewQuizInfo(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewQuizTemplates = createAsyncThunk(
  "/e-learning/view-quiz-templates",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.viewQuizTemplates(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteTemplates = createAsyncThunk(
  "/e-learning/deleteTemplates",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.deleteQuizTempplate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateTemplates = createAsyncThunk(
  "/e-learning/updateTemplates",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.updateQuizTemplate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByQuizId = createAsyncThunk(
  "/e-learning/get-score-by-quizId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getScoreByQuizId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadFileQuiz = createAsyncThunk(
  "/e-learning/upload-file-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.uploadFileQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadQuestionImage = createAsyncThunk(
  "/e-learning/upload-image-question",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.uploadQuestionImage(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadFileUserSubmit = createAsyncThunk(
  "/e-learning/upload-file-user-submit",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.uploadFileUserSubmit(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getQuizzesByStudentAndCourse = createAsyncThunk(
  "/e-learning/view-quiz-by-student-and-course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getQuizzesByStudentAndCourse(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAQuiz = createAsyncThunk(
  "/e-learning/view-a-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.viewAQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAQuizTemplate = createAsyncThunk(
  "/e-learning/view-a-quiz-template",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.viewAQuizTemplate(data);
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

export const deleteQuizQuestion = createAsyncThunk(
  "/e-learning/delete-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.deleteQuizQuestion(data);
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

export const getQuizsByCourse = createAsyncThunk(
  "/e-learning/get-quizs-by-course",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getQuizsByCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  "/e-learning/submit-quiz",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.submitQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitQuizEsay = createAsyncThunk(
  "/e-learning/submit-quiz-essay",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.submitQuizEssay(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScore = createAsyncThunk(
  "/e-learning/get-score",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getScore(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByInfo = createAsyncThunk(
  "/e-learning/get-info-score",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getScoreByInfo(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByUserId = createAsyncThunk(
  "/e-learning/get-score-userId",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.getScoreByUserId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateScore = createAsyncThunk(
  "/e-learning/update-score",
  async (data, { rejectWithValue }) => {
    try {
      const response = await QuizService.updateScore(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  quiz: "",
  getQuizzesByStudentAndCourse: [],
  getScoreState: [],
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
      .addCase(getQuizsByCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getQuizsByCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getQuizsByCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(submitQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(submitQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(submitQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getScoreByUserId.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getScoreByUserId.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getScoreByUserId.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getScore.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getScore.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
      })
      .addCase(getScore.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getScoreByInfo.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getScoreByInfo.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getScoreState = action.payload;
      })
      .addCase(getScoreByInfo.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(getQuizzesByStudentAndCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getQuizzesByStudentAndCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getQuizzesByStudentAndCourse = action.payload;
      })
      .addCase(getQuizzesByStudentAndCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = "Something went wrong!";
      })
      .addCase(resetState, () => initialState);
  },
});

export default quizSlice.reducer;
