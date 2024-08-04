import { createAsyncThunk } from '@reduxjs/toolkit';
import { ScoreService } from './scoreService';

export const getScoreHasUsersTested = createAsyncThunk(
  '/e-learning/score/scores-has-users-tested',
  async (data, {rejectWithValue}) => {
    try {
      const response = await ScoreService.getScoreHasUsersTested(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const getNumberUserInQuiz = createAsyncThunk(
  '/e-learning/score/number-user-tested-in-quizs',
  async (data, {rejectWithValue}) => {
    try {
      const response = await ScoreService.getNumberUserInQuiz(data);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
