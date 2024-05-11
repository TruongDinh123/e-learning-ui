
import Image from 'next/image';
import ranking_bg from '/public/images/ranking-bg.jpg';
import star from '/public/images/star.png';


const Ranking = () => {
  return (
    <div className='hidden lg:block w-[250px] '>
      <div
        className='flex justify-center items-end h-full bg-no-repeat bg-cover bg-center rounded-2xl'
        style={{
          position: "relative"
        }}
      >
        <Image src={ranking_bg} alt="ranking-bg" />
        <div className='star-icon-block'>
        <Image src={star} alt="star" />
        </div>
        <div className='grow mx-4 rounded-xl ranking-info'>
          <div className='bg-white rounded-2xl w-full text-center py-2 mb-2'>
            <div className='text-[#002c6a] font-semibold text-3xl'>2079</div>{' '}
            lượt đăng ký
          </div>
        </div>
      </div>
    </div>
  );
};

export default Ranking;
