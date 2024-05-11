'use client';

import HeaderUser from '@/components/Header/Header';
import './page.css';
import {useSelector} from 'react-redux';
import { Image } from 'antd';

const logo3 = '/images/logo.jpg';

export default function HeaderExemplOnline() {
  const courseInfo = useSelector((state) => state.course.courseInfo);

  return (
    <div className='bg-[#002c6a]'>
      {/*<nav className="px-4 lg:px-6 py-2.5 text-white">*/}
      {/*<div className="flex items-center justify-between gap-8 mx-auto max-w-screen-xl">*/}
      {/*  <a className="flex items-center" href="/">*/}
      {/*    <img*/}
      {/*      src={logoOrg ?? logo3}*/}
      {/*      className="lg:w-12"*/}
      {/*      alt="logo"*/}
      {/*      style={{*/}
      {/*        width: "4.5rem",*/}
      {/*      }}*/}
      {/*    />*/}
      {/*  </a>*/}
      {/*  <div className="bg-[#00436ad0] flex items-center justify-end lg:grow lg:py-2 lg:px-4 rounded-full">*/}
      {/*    <div className="flex items-center lg:order-2">*/}
      {/*      <a*/}
      {/*        href="/"*/}
      {/*        className="font-medium rounded-lg lg:text-xl focus:outline-none px-2.5 py-2"*/}
      {/*      >*/}
      {/*        Trở về trang chủ*/}
      {/*      </a>*/}
      {/*    </div>*/}
      {/*  </div>*/}
      {/*</div>*/}

      {/*</nav>*/}

      <HeaderUser />
      <div className='px-4 lg:px-6 header-exem-online-block'>
        <div className='max-w-screen-xl mx-auto mt-4 lg:mt-8'>
          <Image
            src={
              courseInfo?.bannerUrl ??
              'https://myaloha.vn/upload/images/banner/banner_1011571_1684482408_ceafed9c-c81f-4aaa-9abb-3b4954db9d5f.png'
            }
            className='max-w-full h-auto mx-auto rounded-xl'
            alt="img-banner"
          />
        </div>
      </div>
      <div
        dangerouslySetInnerHTML={{
          __html:
            courseInfo?.title ??
            'Cuộc thi trực tuyến “Tìm hiểu về công tác bảo vệ môi trường” năm 2023',
        }}
        className='px-4 lg:px-6 py-2 uppercase text-lg lg:text-4xl text-center text-white bg-[#00436ad0] mt-4 lg:mt-12'
      ></div>
    </div>
  );
}
