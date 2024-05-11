import { memo } from 'react';

const RankingContent = ({rankingCalculator}) => {
  return (
    <div>
      <div className='min-h-[550px]'>
        {
          rankingCalculator.length === 0 ? (
                  <div>
                    <div className="text-center py-4 mt-4 typewriter"> Chưa có dữ liệu thống kê <span
                        className="elipsis-blink">...</span></div>
                  </div>
              ) :

                  rankingCalculator.map((item, index) => (
                      <div className='grid-cols-12 rounded-xl py-6 px-6 mt-4 first:bg-[#ffe8ac] bg-[#F8F5F5] shadow-md grid'>
                          <div className='col-span-6 flex items-center gap-4'>
                              <div className='shrink-0 relative w-8 h-8 flex items-center justify-center font-semibold text-base bg-yellow-300 after:border-t-yellow-300 after:block after:absolute after:left-0 after:w-auto after:border-solid after:border-transparent after:mt-9 after:h-0 after:border-t-4 after:border-l-[16px] after:border-r-[16px]'>
                                  {index + 1}
                              </div>
                          </div>
                          <div className='col-span-6 flex items-center'>
                                <span>
                                  <div>{item.cap}</div>
                                </span>
                          </div>
                      </div>
                  ))
        }
      </div>
    </div>
  );
};

export default memo(RankingContent);
