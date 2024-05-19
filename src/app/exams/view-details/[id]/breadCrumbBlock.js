'use client';
import React, {memo} from 'react';
import {Statistic, Breadcrumb} from 'antd';
import Link from 'next/link';
import 'react-quill/dist/quill.snow.css';
import {useSelector} from 'react-redux';

const BreadCrumbBlock = ({
  quiz,
  isComplete,
  handleSubmit,
  loading,
  showCountdown,
  deadline,
}) => {
  const courseCurrent = useSelector((state) => state.course.courseInfo);

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
        {!loading && (
          <>
            <Breadcrumb.Item>
              <Link className='font-bold' href={'/'}>
                {courseCurrent?.name}
              </Link>
            </Breadcrumb.Item>
            {quiz && (
              <Breadcrumb.Item>
                <span className='font-bold'> {quiz.name}</span>
              </Breadcrumb.Item>
            )}
          </>
        )}
      </Breadcrumb>
    </>
  );
};

export default memo(BreadCrumbBlock);
