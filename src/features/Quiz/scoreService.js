import axiosInstance from '../../config/axios';

const getNumberUserInQuiz = async (data) => {
  const res = await axiosInstance({
    url: '/e-learning/score/number-user-tested-in-quizs',
    method: 'POST',
    data: data,
  });
  return res.data;
};

const getScoreHasUsersTested = async (data) => {
  const res = await axiosInstance({
    url: '/e-learning/score/scores-has-users-tested',
    method: 'POST',
    data: data,
  });
  return res.data;
};

export const ScoreService = {
  getNumberUserInQuiz,
  getScoreHasUsersTested
}