"use client";

import { Image } from "antd";

const logo3 = "/images/logo.jpg";

export default function HeaderExemplOnline({title,logoOrg, bannerUrl}) {
  return (
    <header className="bg-[#002c6a]">
      <nav className="px-4 lg:px-6 py-2.5 text-white">
        <div className="flex items-center justify-between gap-8 mx-auto max-w-screen-xl">
          <a className="flex items-center" href="">
            <img
              src={logoOrg ?? logo3}
              className="lg:w-12"
              alt="logo"
              style={{
                width: "4.5rem",
              }}
            />
          </a>
          <div className="bg-[#00436ad0] flex items-center justify-end lg:grow lg:py-2 lg:px-4 rounded-full">
            <div className="flex items-center lg:order-2">
              <a
                href=""
                className="font-medium rounded-lg lg:text-xl focus:outline-none px-2.5 py-2"
              >
                Đăng ký tham dự
              </a>
            </div>
          </div>
        </div>
      </nav>
      <div className="px-4 lg:px-6">
        <div className="max-w-screen-xl mx-auto mt-4 lg:mt-8">
          <img
            src={bannerUrl ?? "https://myaloha.vn/upload/images/banner/banner_1011571_1684482408_ceafed9c-c81f-4aaa-9abb-3b4954db9d5f.png"}
            className="max-w-full h-auto mx-auto rounded-xl"
          />
        </div>
      </div>
      <div className="px-4 lg:px-6 py-2 uppercase text-lg lg:text-4xl text-center text-white bg-[#00436ad0] mt-4 lg:mt-12">
          {title ?? "Cuộc thi trực tuyến “Tìm hiểu về công tác bảo vệ môi trường” năm 2023"}
      </div>
    </header>
  );
}
