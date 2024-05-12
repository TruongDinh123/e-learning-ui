import {Collapse, Space} from 'antd';
import {memo} from 'react';
import {useSelector} from 'react-redux';

const Rules = () => {
  const courseInfo = useSelector((state) => state.course.courseInfo);

  return (
    courseInfo && (
      <section>
        <div className='container mx-auto px-2 lg:px-4 pt-10 lg:pt-16 pb-6 pb-10 lg:pb-16'>
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
                    label: 'Tóm tắt',
                    children: (
                      <div>
                        <p
                          dangerouslySetInnerHTML={{__html: courseInfo.rules}}
                        ></p>
                        <br />
                        {courseInfo.rule_file_url && (
                            <a
                              href={courseInfo.rule_file_url}
                              alt={courseInfo.rulesFileName}
                              download
                            >
                              File thông tin chi tiết: {courseInfo.rulesFileName}
                            </a>
                        )}
                      </div>
                    ),
                  },
                ]}
              />
            </Space>
          </div>
        </div>
      </section>
    )
  );
};

export default memo(Rules);
