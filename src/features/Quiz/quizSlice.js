import {createAction, createAsyncThunk, createSlice} from '@reduxjs/toolkit';
import {QuizService} from './quizService';
import { encryptQuiz } from '../../utils';

export const createQuiz = createAsyncThunk(
  '/e-learning/create-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.createQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const draftQuiz = createAsyncThunk(
  '/e-learning/draft-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.draftQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const DeldraftQuiz = createAsyncThunk(
  '/e-learning/draft-quiz/delete',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.DeletedraftQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const startQuiz = createAsyncThunk(
  '/e-learning/start-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.startQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewQuiz = createAsyncThunk(
  '/e-learning/view-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getDraftQuiz = createAsyncThunk(
  '/e-learning/get-draft-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getDraftQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllScoresByCourseId = createAsyncThunk(
  '/e-learning/get-all-score-by-course-id',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getAllScoresByCourseId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewInfoQuiz = createAsyncThunk(
  '/e-learning/view-quiz-info',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewQuizInfo(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewQuizTemplates = createAsyncThunk(
  '/e-learning/view-quiz-templates',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewQuizTemplates(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteTemplates = createAsyncThunk(
  '/e-learning/deleteTemplates',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.deleteQuizTempplate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateTemplates = createAsyncThunk(
  '/e-learning/updateTemplates',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.updateQuizTemplate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByQuizId = createAsyncThunk(
  '/e-learning/get-score-by-quizId',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getScoreByQuizId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadFileQuiz = createAsyncThunk(
  '/e-learning/upload-file-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.uploadFileQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadQuestionImage = createAsyncThunk(
  '/e-learning/upload-image-question',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.uploadQuestionImage(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const uploadFileUserSubmit = createAsyncThunk(
  '/e-learning/upload-file-user-submit',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.uploadFileUserSubmit(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getQuizzesByStudentAndCourse = createAsyncThunk(
  '/e-learning/view-quiz-by-student-and-course',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getQuizzesByStudentAndCourse(data);
      return response.data;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAQuiz = createAsyncThunk(
  '/e-learning/view-a-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewAQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAQuizForUserScreen = createAsyncThunk(
  '/e-learning/quiz-for-user-screen',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewAQuizForUserScreen(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const viewAQuizTemplate = createAsyncThunk(
  '/e-learning/view-a-quiz-template',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.viewAQuizTemplate(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateQuiz = createAsyncThunk(
  '/e-learning/update-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.updateQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteQuizQuestion = createAsyncThunk(
  '/e-learning/delete-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.deleteQuizQuestion(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteQuestionImage = createAsyncThunk(
  '/e-learning/delete-question-img',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.deleteQuestionImage(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteQuiz = createAsyncThunk(
  '/e-learning/delete-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.deleteQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getQuizsByCourse = createAsyncThunk(
  '/e-learning/get-quizs-by-course',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getQuizsByCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitQuiz = createAsyncThunk(
  '/e-learning/submit-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.submitQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const submitQuizEsay = createAsyncThunk(
  '/e-learning/submit-quiz-essay',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.submitQuizEssay(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScore = createAsyncThunk(
  '/e-learning/get-score',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getScore(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByInfo = createAsyncThunk(
  '/e-learning/get-info-score',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getScoreByInfo(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getScoreByUserId = createAsyncThunk(
  '/e-learning/get-score-userId',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getScoreByUserId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const updateScore = createAsyncThunk(
  '/e-learning/update-score',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.updateScore(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const deleteScorebyQuiz = createAsyncThunk(
  '/e-learning/delete-score-by-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.deleteScorebyQuiz(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getSubmissionTimeLatestQuizByCourseId = createAsyncThunk(
  '/e-learning/sumbmiss-tiontime-latest-quiz',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getSubmissionTimeLatestQuizByCourseId(
        data
      );
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getInfoCommonScoreByUserId = createAsyncThunk(
  '/e-learning/is-complete-score',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getInfoCommonScoreByUserId(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getAllUserFinishedCourse = createAsyncThunk(
  '/e-learning/userFinishedCourses',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getAllUserFinishedCourse(data);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

export const getTestCount = createAsyncThunk(
  '/e-learning/quiz/getTestCount/:userId',
  async (data, {rejectWithValue}) => {
    try {
      const response = await QuizService.getTestCount(data.userId);
      return response;
    } catch (err) {
      return rejectWithValue(err);
    }
  }
);

const initialState = {
  quiz: '',
  getQuizzesByStudentAndCourse: [],
  getScoreState: [],
  getQuizTemplates: [],
  getdraftQuiz: [],
  isError: false,
  isSuccess: false,
  isLoading: false,
  newQuizCreated: false,
  isLoadingQuiz: false,
  message: '',
  latestQuizByCourseId: null,
  allUserFinishedCourse: null,
  infoCommonScoreByUserId: null,
  oneQuizInfo: null,
  scoreByQuizIdInfo: null,
  quizsExisted: {},
};

export const resetStateQuiz = createAction('Reset_all_quiz');

const quizSlice = createSlice({
  name: 'quiz',
  initialState,
  reducers: {
    resetNewQuizCreatedFlag: (state) => {
      state.newQuizCreated = false;
    },
    setSubmissionTimeLatestQuizByCourseId: (state) => {
      state.latestQuizByCourseId = state.payload;
    },
    updateStateQuiz: (state) => {
      state.quiz = state.payload;
    },
    updateOneQuizInfo: (state) => {
      state.oneQuizInfo = state.payload;
    },
    updateScoreByQuizIdInfo: (state) => {
      state.scoreByQuizIdInfo = state.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createQuiz.pending, (state, action) => {
        state.isLoading = true;
        state.isLoadingQuiz = true;
      })
      .addCase(createQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isLoadingQuiz = false;
        state.isError = false;
        state.isSuccess = true;
        state.newQuizCreated = true;
      })
      .addCase(createQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isLoadingQuiz = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
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
        state.message = 'Something went wrong!';
      })
      .addCase(viewQuizTemplates.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewQuizTemplates.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getQuizTemplates = action.payload;
      })
      .addCase(viewQuizTemplates.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(draftQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(draftQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const index = state.getdraftQuiz.findIndex(
          (quiz) => quiz._id === action.payload.metadata._id
        );
        if (index !== -1) {
          const updatedQuestions = action.payload.metadata.questions.filter(
            (question) =>
              !action.meta.arg.formattedValues.deletedQuestionIds.includes(
                question._id
              )
          );
          state.getdraftQuiz[index] = {
            ...action.payload.metadata,
            questions: updatedQuestions,
          };
        } else {
          state.getdraftQuiz.push(action.payload.metadata);
        }
      })
      .addCase(draftQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(uploadQuestionImage.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(uploadQuestionImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        if (action.payload.metadata.quiz.isDraft) {
          const updatedQuizInfo = action.payload.metadata.quiz;
          const updatedQuestionId = action.meta.arg.questionId;

          const quizIndex = state.getdraftQuiz.findIndex(
            (quiz) => quiz._id === updatedQuizInfo._id
          );

          if (quizIndex !== -1) {
            const questionIndex = state.getdraftQuiz[
              quizIndex
            ].questions.findIndex(
              (question) => question._id === updatedQuestionId
            );

            if (questionIndex !== -1) {
              const updatedQuestion = updatedQuizInfo.questions.find(
                (question) => question._id === updatedQuestionId
              );
              if (updatedQuestion && updatedQuestion.image_url) {
                state.getdraftQuiz[quizIndex].questions[
                  questionIndex
                ].image_url = updatedQuestion.image_url;
              }
            }
          }
        }
      })
      .addCase(uploadQuestionImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(deleteQuestionImage.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(deleteQuestionImage.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const {quizId, questionId} = action.meta.arg;

        const quizIndex = state.getdraftQuiz.findIndex(
          (quiz) => quiz._id === quizId
        );

        if (quizIndex !== -1) {
          const questionIndex = state.getdraftQuiz[
            quizIndex
          ].questions.findIndex((question) => question._id === questionId);

          if (questionIndex !== -1) {
            state.getdraftQuiz[quizIndex].questions[questionIndex].image_url =
              '';
          }
        }
      })
      .addCase(deleteQuestionImage.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(getDraftQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getDraftQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        state.getdraftQuiz = action.payload.metadata;
      })
      .addCase(getDraftQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(DeldraftQuiz.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(DeldraftQuiz.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const draftQuizId = action.meta.arg.quizIdDraft;
        if (state.getdraftQuiz && Array.isArray(state.getdraftQuiz)) {
          state.getdraftQuiz = state.getdraftQuiz.filter(
            (draftQuiz) => draftQuiz._id !== draftQuizId
          );
        }
      })
      .addCase(DeldraftQuiz.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;
        state.message = 'Something went wrong!';
      })
      .addCase(resetNewQuizCreatedFlag, (state) => {
        state.newQuizCreated = false;
      })
      .addCase(resetStateQuiz, () => initialState)
      .addCase(
        getSubmissionTimeLatestQuizByCourseId.pending,
        (state, action) => {
          state.isLoading = true;
        }
      )
      .addCase(
        getSubmissionTimeLatestQuizByCourseId.fulfilled,
        (state, action) => {
          state.isLoading = false;
          state.isError = false;
          state.isSuccess = true;

          state.latestQuizByCourseId = action.payload.metadata[0];
        }
      )
      .addCase(
        getSubmissionTimeLatestQuizByCourseId.rejected,
        (state, action) => {
          state.isLoading = false;
          state.isError = true;
          state.isSuccess = false;

          state.message = 'Something went wrong!';
        }
      )
      .addCase(getAllUserFinishedCourse.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(getAllUserFinishedCourse.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;

        state.allUserFinishedCourse = action.payload.metadata;
      })
      .addCase(getAllUserFinishedCourse.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;

        state.message = 'Something went wrong!';
      })
      .addCase(getInfoCommonScoreByUserId.fulfilled, (state, action) => {
        state.infoCommonScoreByUserId = action.payload.metadata;
      })
      .addCase(viewInfoQuiz.fulfilled, (state, action) => {
        state.quiz = action.payload.metadata;
      })
      .addCase(getScoreByQuizId.fulfilled, (state, action) => {
        state.scoreByQuizIdInfo = action.payload.metadata;
      })
      .addCase(viewAQuiz.fulfilled, (state, action) => {
        state.oneQuizInfo = action.payload.metadata;
      })
      .addCase(viewAQuizForUserScreen.pending, (state, action) => {
        state.isLoading = true;
      })
      .addCase(viewAQuizForUserScreen.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isError = false;
        state.isSuccess = true;
        const quizData = JSON.stringify(action.payload.metadata);
        
        state.quizsExisted = Object.assign(state.quizsExisted, {
          [action.payload.metadata._id]: encryptQuiz(`${quizData}`),
        });
      })
      .addCase(viewAQuizForUserScreen.rejected, (state, action) => {
        state.isLoading = false;
        state.isError = true;
        state.isSuccess = false;

        state.message = 'viewAQuizForUserScreen: Something went wrong!';
      });
  },
});

export const {
  resetNewQuizCreatedFlag,
  setSubmissionTimeLatestQuizByCourseId,
  updateStateQuiz,
  updateOneQuizInfo,
  updateScoreByQuizIdInfo,
} = quizSlice.actions;

export default quizSlice.reducer;
