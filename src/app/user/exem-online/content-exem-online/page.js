"use client";
import { Collapse, Space, theme } from "antd";
import "./page.css";

export default function ContentExemplOnline() {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const getItems = (panelStyle) => [
    {
      key: "1",
      label: "This is panel header 1",
      children: <p>{text}</p>,
      style: panelStyle,
    },
    {
      key: "2",
      label: "This is panel header 2",
      children: <p>{text}</p>,
      style: panelStyle,
    },
    {
      key: "3",
      label: "This is panel header 3",
      children: <p>{text}</p>,
      style: panelStyle,
    },
  ];
  const { token } = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: "none",
  };
  return (
    <main
      style={{
        maxHeight: "80%",
        minHeight: "80%",
      }}
    >
      <section>
        <div className="mx-auto py-6 lg:py-16 bg-[length:33%_95%,_33%_95%] bg-no-repeat bg-flower">
          <div className="text-center text-[#002c6a] text-xl lg:text-4xl font-bold uppercase">
            Cuộc thi đã kết thúc
          </div>
          <div className="mt-4 lg:mt-8">
            <div className="flex items-center justify-center gap-4 lg:gap-8">
              <div className="px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg">
                <div className="text-xl lg:text-4xl text-[#002c6a] font-bold">
                  --
                </div>
                <div className="lg:text-xl mt-2 text-[#686868]">Ngày</div>
              </div>
              <div className="px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg">
                <div className="text-xl lg:text-4xl text-[#002c6a] font-bold">
                  --
                </div>
                <div className="lg:text-xl mt-2 text-[#686868]">Tháng</div>
              </div>
              <div className="px-4 py-6 shadow-md min-w-[70px] lg:min-w-[130px] text-center rounded-lg">
                <div className="text-xl lg:text-4xl text-[#002c6a] font-bold">
                  --
                </div>
                <div className="lg:text-xl mt-2 text-[#686868]">Năm</div>
              </div>
            </div>
          </div>
          <div className="mt-4 lg:mt-8 flex items-center justify-center gap-4 lg:gap-8">
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]"
            >
              Tham gia
            </button>
            <button
              type="button"
              className="inline-flex justify-center items-center px-4 py-2 border shadow-sm transition ease-in-out duration-150 gap-2 cursor-pointer min-h-[40px] disabled:cursor-not-allowed font-sans rounded-full bg-[#002c6a] border-[#002c6a] text-white hover:shadow-sm min-w-[125px] text-lg lg:text-2xl min-w-[150px] lg:min-w-[200px]"
            >
              Thể lệ
            </button>
            <div></div>
          </div>
          <div className="mt-4 lg:mt-8 text-lg lg:text-2xl text-[#002c6a] text-center">
            <div className="bg-[#FFF4D9] w-fit py-3 px-12 mx-auto rounded-full">
              Bạn cần đăng nhập để dự thi
            </div>
          </div>
        </div>
      </section>
      <section id="leaderboard">
        <div className="container mx-auto px-2 lg:px-4 mt-6 lg:mt-16">
          <div className="flex gap-8">
            <div className="hidden lg:block min-w-[250px]">
              <div className="flex justify-center items-end h-full bg-no-repeat bg-cover bg-center rounded-2xl bg-img">
                <div className="grow mx-4">
                  <div className="bg-white rounded-2xl w-full text-center py-2 mb-6">
                    <div className="text-[#002c6a] font-semibold text-3xl">
                      2079
                    </div>{" "}
                    lượt đăng ký
                  </div>
                </div>
              </div>
            </div>
            <div className="block grow">
              <div className="block md:flex items-center mb-6">
                <div className="text-2xl lg:text-4xl text-[#002c6a] font-bold grow mb-2 md:mb-0">
                  BẢNG XẾP HẠNG
                </div>
                <div className="flex items-center gap-4">
                  <div>
                    <select
                      name=""
                      id=""
                      className="border custom-select appearance-none border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pl-4 pr-8"
                    >
                      <option value="group">Tập thể</option>
                      <option value="personal">Cá nhân</option>
                    </select>
                  </div>
                  <div>
                    <select
                      className="border custom-select appearance-none border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pl-4 pr-8"
                      style={{
                        display: "none",
                      }}
                    ></select>
                  </div>
                </div>
              </div>
              <div>
                <div className="min-h-[550px]">
                  <div className="grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md grid">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]">
                        1
                      </div>
                      <span className="hidden md:inline-block">
                        349 lượt dự thi
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span>
                        <div>Quận Hải Châu - Phường Thanh Bình</div>
                      </span>
                    </div>
                  </div>
                  <div className="grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md bg-[#fff1cd] grid">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]">
                        1
                      </div>
                      <span className="hidden md:inline-block">
                        349 lượt dự thi
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span>
                        <div>Quận Hải Châu - Phường Thanh Bình</div>
                      </span>
                    </div>
                  </div>
                  <div className="grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md bg-[#fffaed] grid">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]">
                        1
                      </div>
                      <span className="hidden md:inline-block">
                        349 lượt dự thi
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span>
                        <div>Quận Hải Châu - Phường Thanh Bình</div>
                      </span>
                    </div>
                  </div>
                  <div className="grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md grid">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]">
                        1
                      </div>
                      <span className="hidden md:inline-block">
                        349 lượt dự thi
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span>
                        <div>Quận Hải Châu - Phường Thanh Bình</div>
                      </span>
                    </div>
                  </div>
                  <div className="grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md grid">
                    <div className="col-span-6 flex items-center gap-4">
                      <div className="shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]">
                        1
                      </div>
                      <span className="hidden md:inline-block">
                        349 lượt dự thi
                      </span>
                    </div>
                    <div className="col-span-6 flex items-center">
                      <span>
                        <div>Quận Hải Châu - Phường Thanh Bình</div>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className="container mx-auto px-2 lg:px-4 mt-6 lg:mt-16">
          <div className="text-center text-xl lg:text-4xl font-bold text-[#002c6a]">
            THỂ LỆ CUỘC THI
          </div>
          <div className="mt-6 lg:mt-12">
            <Space
              direction="vertical"
              style={{
                width: "100%",
              }}
            >
              <Collapse
                collapsible="header"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: "This panel can only be collapsed by clicking text",
                    children: <p>{text}</p>,
                  },
                ]}
              />
              <Collapse
                collapsible="icon"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: "This panel can only be collapsed by clicking icon",
                    children: <p>{text}</p>,
                  },
                ]}
              />
              <Collapse
                collapsible="icon"
                defaultActiveKey={["1"]}
                items={[
                  {
                    key: "1",
                    label: "This panel can only be collapsed by clicking icon",
                    children: <p>{text}</p>,
                  },
                ]}
              />
            </Space>
          </div>
        </div>
      </section>
      <div className="container mx-auto px-2 lg:px-4 mt-6 lg:mt-16">
        <section id="blog">
          <div className="text-[#002c6a] text-center text-xl lg:text-4xl font-bold">
            THÔNG BÁO BAN TỔ CHỨC
          </div>
          <div className="my-6 lg:my-12">
            <div className="flex items-center gap-8">
              <div className="basis-1/2 hidden lg:block">
                <img
                  src="https://myaloha.vn/upload/images/banner/banner_1011571_1684482408_ceafed9c-c81f-4aaa-9abb-3b4954db9d5f.png"
                  alt
                  className="object-contain rounded-lg shadow w-full h-auto"
                />
              </div>
              <div className="grow lg:basis-1/2">
                <ul>
                  <li>
                    <a
                      href=""
                      className="flex items-center gap-6 border-slate-300 border-t border-b px-2 py-4"
                    >
                      <div className="shrink-0 text-theme-color text-sm">
                        5-4
                      </div>
                      <div className="w-2 h-2 bg-slate-300 rounded-full"></div>
                      <div className="grow line-clamp-1">
                        TÀI LIỆU SHHV: NGHỊ QUYẾT ĐẠI HỘI PHỤ NỮ TOÀN QUỐC LẦN
                        THỨ XIII
                      </div>
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
