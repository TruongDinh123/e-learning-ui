'use client';
import React from 'react';
import {Statistic, Breadcrumb} from 'antd';
import Link from 'next/link';
import 'react-quill/dist/quill.snow.css';

const BreadCrumbBlock = ({
  quiz,
  isComplete,
  handleSubmit,
  loading,
  showCountdown,
  deadline,
}) => {
  return (
    <>
      {!loading && showCountdown && !isComplete && deadline && (
        <>
          <a className='fixedButton flex' href='javascript:void(0)'>
            <div className='roundedFixedBtn flex'>
              <Statistic.Countdown
                style={{color: 'white'}}
                value={deadline}
                onFinish={handleSubmit}
              />
            </div>
          </a>
        </>
      )}
      <Breadcrumb className='pb-4 pt-24 '>
        <Breadcrumb.Item key='homepage'>
          <Link href='/'>Trang chủ</Link>
        </Breadcrumb.Item>
        {quiz?.map((quiz, quizIndex) => (
          <>
            <Breadcrumb.Item key={quizIndex}>
              <Link
                className='font-bold'
                href={`/user/exem-online/${
                  quiz.courseIds[0]?._id || quiz.lessonId?.courseId?._id
                }`}
              >
                {quiz.courseIds[0]?.name || quiz.lessonId?.courseId?.name}
              </Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              <span className='font-bold'> {quiz.name}</span>
            </Breadcrumb.Item>
          </>
        ))}
      </Breadcrumb>
    </>
  );
};

export default BreadCrumbBlock;
