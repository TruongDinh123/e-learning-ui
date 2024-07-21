'use client';
import './page.css';
import Countdown from './countdown';
import RankingImage from './rankingImage';
import RankingContent from './rankingContent';
import Rules from './rules';
import {useDispatch, useSelector} from 'react-redux';
import {useEffect} from 'react';
import {message} from 'antd';
import {updateIsSubmitSuccess} from '../../../../features/Quiz/quizSlice';

export default function ContentExemplOnline({}) {
  const isSubmitSuccess = useSelector((state) => state.quiz.isSubmitSuccess);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isSubmitSuccess) {
      message.success('Nộp bài thi thành công!', 4).then(() => {
        dispatch(updateIsSubmitSuccess(false));
      });
    }
  }, [dispatch, isSubmitSuccess]);
  return (
    <main
      style={{
        maxHeight: '80%',
        minHeight: '80%',
      }}
    >
      <Countdown />

      <section id='leaderboard'>
        <div className='container mx-auto px-2 lg:px-4 pt-6 lg:pt-16'>
          <div className='flex gap-8'>
            <RankingImage />
            <div className='block grow'>
              <div className='block md:flex items-center mb-6'>
                <div className='text-2xl lg:text-4xl text-[#002c6a] font-bold grow mb-2 md:mb-0'>
                  BẢNG XẾP HẠNG
                </div>
              </div>
              <RankingContent />
            </div>
          </div>
        </div>
      </section>
      <Rules />
      {/* <div className='container mx-auto px-2 lg:px-4 mt-6 lg:mt-16'> */}
      {/*<section id='blog'>*/}
      {/*  <div className='text-[#002c6a] text-center text-xl lg:text-4xl font-bold'>*/}
      {/*    THÔNG BÁO BAN TỔ CHỨC*/}
      {/*  </div>*/}
      {/*  <div className='my-6 lg:my-12'>*/}
      {/*    <div className='flex items-center gap-8'>*/}
      {/*      <div className='basis-1/2 hidden lg:block'>*/}
      {/*        <img*/}
      {/*          src='https://myaloha.vn/upload/images/banner/banner_1011571_1684482408_ceafed9c-c81f-4aaa-9abb-3b4954db9d5f.png'*/}
      {/*          alt*/}
      {/*          className='object-contain rounded-lg shadow w-full h-auto'*/}
      {/*        />*/}
      {/*      </div>*/}
      {/*      <div className='grow lg:basis-1/2'>*/}
      {/*        <ul>*/}
      {/*          <li>*/}
      {/*            <a*/}
      {/*              href=''*/}
      {/*              className='flex items-center gap-6 border-slate-300 border-t border-b px-2 py-4'*/}
      {/*            >*/}
      {/*              <div className='shrink-0 text-theme-color text-sm'>*/}
      {/*                5-4*/}
      {/*              </div>*/}
      {/*              <div className='w-2 h-2 bg-slate-300 rounded-full'></div>*/}
      {/*              <div className='grow line-clamp-1'>*/}
      {/*                TÀI LIỆU SHHV: NGHỊ QUYẾT ĐẠI HỘI PHỤ NỮ TOÀN QUỐC LẦN*/}
      {/*                THỨ XIII*/}
      {/*              </div>*/}
      {/*            </a>*/}
      {/*          </li>*/}
      {/*        </ul>*/}
      {/*      </div>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</section>*/}
    </main>
  );
}
