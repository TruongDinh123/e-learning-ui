'use client';
import {Collapse, Space, theme} from 'antd';
import './page.css';
import Countdown from './countdown';
import RankingImage from './rankingImage';
import RankingContent from './rankingContent';

export default function ContentExemplOnline({params}) {
  const text = `
  A dog is a type of domesticated animal.
  Known for its loyalty and faithfulness,
  it can be found as a welcome guest in many households across the world.
`;
  const getItems = (panelStyle) => [
    {
      key: '1',
      label: 'This is panel header 1',
      children: <p>{text}</p>,
      style: panelStyle,
    },
    {
      key: '2',
      label: 'This is panel header 2',
      children: <p>{text}</p>,
      style: panelStyle,
    },
    {
      key: '3',
      label: 'This is panel header 3',
      children: <p>{text}</p>,
      style: panelStyle,
    },
  ];
  const {token} = theme.useToken();
  const panelStyle = {
    marginBottom: 24,
    background: token.colorFillAlter,
    borderRadius: token.borderRadiusLG,
    border: 'none',
  };

  return (
    <main
      style={{
        maxHeight: '80%',
        minHeight: '80%',
      }}
    >
      <Countdown params={params} />

      <section id='leaderboard'>
        <div className='container mx-auto px-2 lg:px-4 mt-6 lg:mt-16'>
          <div className='flex gap-8'>
            <RankingImage />
            <div className='block grow'>
              <div className='block md:flex items-center mb-6'>
                <div className='text-2xl lg:text-4xl text-[#002c6a] font-bold grow mb-2 md:mb-0'>
                  BẢNG XẾP HẠNG
                </div>
                <div className='flex items-center gap-4'>
                  <div>
                    <select
                      name=''
                      id=''
                      className='border custom-select appearance-none border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pl-4 pr-8'
                    >
                      <option value='group'>Tập thể</option>
                      <option value='personal'>Cá nhân</option>
                    </select>
                  </div>
                  <div>
                    <select
                      className='border custom-select appearance-none border-gray-300 text-gray-900 text-sm rounded-full focus:ring-blue-500 focus:border-blue-500 block w-full p-2 pl-4 pr-8'
                      style={{
                        display: 'none',
                      }}
                    ></select>
                  </div>
                </div>
              </div>
              <RankingContent />
            </div>
          </div>
        </div>
      </section>
      <section>
        <div className='container mx-auto px-2 lg:px-4 mt-6 lg:mt-16'>
          <div className='text-center text-xl lg:text-4xl font-bold text-[#002c6a]'>
            THỂ LỆ CUỘC THI
          </div>
          <div className='mt-6 lg:mt-12'>
            <Space
              direction='vertical'
              style={{
                width: '100%',
              }}
            >
              <Collapse
                collapsible='header'
                defaultActiveKey={['1']}
                items={[
                  {
                    key: '1',
                    label: 'This panel can only be collapsed by clicking text',
                    children: <p>{text}</p>,
                  },
                ]}
              />
              <Collapse
                collapsible='icon'
                defaultActiveKey={['1']}
                items={[
                  {
                    key: '1',
                    label: 'This panel can only be collapsed by clicking icon',
                    children: <p>{text}</p>,
                  },
                ]}
              />
              <Collapse
                collapsible='icon'
                defaultActiveKey={['1']}
                items={[
                  {
                    key: '1',
                    label: 'This panel can only be collapsed by clicking icon',
                    children: <p>{text}</p>,
                  },
                ]}
              />
            </Space>
          </div>
        </div>
      </section>
      <div className='container mx-auto px-2 lg:px-4 mt-6 lg:mt-16'>
        <section id='blog'>
          <div className='text-[#002c6a] text-center text-xl lg:text-4xl font-bold'>
            THÔNG BÁO BAN TỔ CHỨC
          </div>
          <div className='my-6 lg:my-12'>
            <div className='flex items-center gap-8'>
              <div className='basis-1/2 hidden lg:block'>
                <img
                  src='https://myaloha.vn/upload/images/banner/banner_1011571_1684482408_ceafed9c-c81f-4aaa-9abb-3b4954db9d5f.png'
                  alt
                  className='object-contain rounded-lg shadow w-full h-auto'
                />
              </div>
              <div className='grow lg:basis-1/2'>
                <ul>
                  <li>
                    <a
                      href=''
                      className='flex items-center gap-6 border-slate-300 border-t border-b px-2 py-4'
                    >
                      <div className='shrink-0 text-theme-color text-sm'>
                        5-4
                      </div>
                      <div className='w-2 h-2 bg-slate-300 rounded-full'></div>
                      <div className='grow line-clamp-1'>
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
