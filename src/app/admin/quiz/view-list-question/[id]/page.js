'use client';
import {Spin, Breadcrumb, Tabs} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect, useState} from 'react';
import {
  getScoreByQuizId,
  updateOneQuizInfo,
  updateScoreByQuizIdInfo,
  viewAQuiz,
} from '@/features/Quiz/quizSlice';
import {unwrapResult} from '@reduxjs/toolkit';
import React from 'react';
import Link from 'next/link';
import TabPane from 'antd/es/tabs/TabPane';
import ViewListScore from '../score-trainee/page';
import '../[id]/page.css';
import moment from 'moment';
import ScoreStatisticsCourse from '../score-statistics/page';
import 'react-quill/dist/quill.snow.css';
import {useMediaQuery} from 'react-responsive';
import {decrypt} from '../../../../../utils';
import Image from 'next/image';
import {Fragment} from 'react';
import {useCallback} from 'react';

export default function ViewListQuestion({params}) {
  const dispatch = useDispatch();
  const quiz = useSelector((state) => state.quiz.oneQuizInfo);
  const score = useSelector((state) => state.quiz.scoreByQuizIdInfo);
  const [quizAnswerDecrypt, setQuizAnswerDecrypt] = useState(null);

  const isDesktop = useMediaQuery({minWidth: 992});

  useEffect(() => {
    if (params?.id && quiz && quiz.length) {
      const checkExist = quiz.findIndex((item) => item._id === params.id);
      if (checkExist !== -1) return;
    }

    !quiz && dispatch(viewAQuiz({quizId: params?.id})).then(unwrapResult);
  }, [dispatch, params, quiz]);

  useEffect(() => {
    if (params?.id && score && score.length) {
      const checkExist = score.findIndex((item) => item.quiz._id === params.id);
      if (checkExist !== -1) return;
    }

    !score &&
      dispatch(getScoreByQuizId({quizId: params?.id})).then(unwrapResult);
  }, [dispatch, params, score]);

  const getElements = useCallback(async () => {
    let answerDeCrypt = [];

    for (var i = 0; i < quiz[0].questions.length; i++) {
      const quizAnswer = await decrypt(quiz[0].questions[i].answer);

      answerDeCrypt.push(quizAnswer);
    }

    return answerDeCrypt;
  }, [quiz]);

  useEffect(() => {
    if (quiz) {
      getElements().then((res) => setQuizAnswerDecrypt(res));
    }
  }, [getElements, quiz]);

  const totalQuestions = quiz?.[0]?.questions?.length;

  return (
    <div className='mx-auto px-4 sm:px-6 lg:px-8 p-3'>
      {!quiz ? (
        <div className='flex justify-center items-center h-screen'>
          <Spin />
        </div>
      ) : (
        <Fragment>
          <div className='sticky'>
            {quiz?.map((quiz, quizIndex) => (
              <div
                className='bg-blue-100 p-4 rounded-md shadow-md'
                key={quizIndex}
              >
                <h2 className='text-2xl font-bold text-blue-700'>
                  Tên khóa học: {quiz.courseIds[0]?.name}{' '}
                  {quiz.lessonId?.courseId?.name}
                </h2>
                {quiz?.submissionTime && (
                  <p className='text-blue-600'>
                    Thời gian hoàn thành:{' '}
                    {moment(quiz.submissionTime).format('DD/MM/YYYY HH:mm')}
                  </p>
                )}
                <p className='text-blue-600'>
                  Loại bài tập:{' '}
                  {quiz.type === 'multiple_choice' ? 'Trắc nghiệm' : 'Tự luận'}
                </p>
              </div>
            ))}
          </div>
          <Tabs defaultActiveKey='0'>
            {quiz?.map((quizItem, quizIndex) => (
              <>
                <TabPane tab={`Câu hỏi`} key={quizIndex}>
                  {quizItem.type === 'multiple_choice' ? (
                    <div className=''>
                      <div className='flex flex-col sm:flex-row justify-between items-center'>
                        <div className='border-gray-300'>
                          <span className='pr-4 text-green-600 block sm:inline'>
                            Đã nộp:{' '}
                            {score && score.filter((s) => s.isComplete).length}
                          </span>
                        </div>
                      </div>
                      <div className='flex flex-col items-center justify-center '>
                        <div className='p-6 m-5 bg-white rounded shadow-md w-full sm:w-1/2 lg:w-1/2'>
                          <h2 className='text-2xl font-bold text-center mb-5'>
                            Đề thi: {quizItem.name}
                          </h2>
                          {quizItem.questions?.map(
                            (question, questionIndex) => {
                              return (
                                <ul key={questionIndex}>
                                  <li className='border p-3 mb-2 li-content'>
                                    <div className='mb-2'>
                                      <div>
                                        <span className='font-bold'>
                                          Câu {questionIndex + 1}:
                                        </span>{' '}
                                        <span
                                          className={`overflow-hidden ${
                                            isDesktop ? 'view ql-editor' : ''
                                          }`}
                                          dangerouslySetInnerHTML={{
                                            __html: `${question.question}`,
                                          }}
                                        />
                                      </div>
                                    </div>
                                    {question?.image_url && (
                                      <div className='mb-2'>
                                        <Image
                                          src={question.image_url}
                                          alt={`Câu hỏi ${questionIndex + 1}`}
                                          className='max-w-auto'
                                        />
                                      </div>
                                    )}
                                    {question.options.map(
                                      (option, optionIndex) => (
                                        <label
                                          className='block mb-2'
                                          key={optionIndex}
                                        >
                                          <span className='font-mono'>
                                            Câu {optionIndex + 1}: {option}
                                          </span>
                                        </label>
                                      )
                                    )}
                                    <span className='text-sm text-green-700 font-bold text-center mb-5'>
                                      Đáp án:{' '}
                                      {quizAnswerDecrypt &&
                                        quizAnswerDecrypt[questionIndex]}
                                    </span>
                                  </li>
                                </ul>
                              );
                            }
                          )}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className='grid-container bg-white shadow overflow-hidden sm:rounded-lg p-6'>
                      <div className='border-2 border-gray-300 p-4 rounded-md'>
                        <div className='flex items-center space-x-4'>
                          <div>
                            <h2 className='text-2xl font-bold mb-5 text-blue-600'>
                              {quizItem.essay.title}
                            </h2>
                            <div
                              className='mb-5 text-gray-700'
                              dangerouslySetInnerHTML={{
                                __html: quizItem.essay.content,
                              }}
                            />
                          </div>
                        </div>
                        <div className='border-l-2 border-gray-300 pl-4'>
                          <span className='pr-4 text-green-600'>
                            Đã nộp:{' '}
                            {score && score.filter((s) => s.isComplete).length}
                          </span>
                          <span className='px-4 border-l-2 border-gray-300 text-yellow-600'>
                            Chưa nộp:{' '}
                            {score &&
                              quizItem.studentIds.length -
                                score.filter((s) => s.isComplete).length}
                          </span>
                          <span className='pl-4 text-red-600'>
                            Đã giao: {quizItem.studentIds.length}
                          </span>
                        </div>
                      </div>
                      {quizItem.essay.attachment && (
                        <div>
                          <h3 className='text-lg font-bold mb-2'>
                            File đính kèm:
                          </h3>
                          <a
                            href={quizItem.essay.attachment}
                            target='_blank'
                            rel='noopener noreferrer'
                            className='text-blue-500 underline'
                          >
                            Download File
                          </a>
                        </div>
                      )}
                    </div>
                  )}
                </TabPane>
                <TabPane tab={`Điểm học viên`} key={quizIndex + 1}>
                  <ViewListScore
                    quizId={params?.id}
                    totalQuestions={totalQuestions}
                  />
                </TabPane>
                <TabPane tab={`Thống kê điểm`}>
                  <ScoreStatisticsCourse quizId={params?.id} />
                </TabPane>
              </>
            ))}
          </Tabs>
        </Fragment>
      )}
    </div>
  );
}
