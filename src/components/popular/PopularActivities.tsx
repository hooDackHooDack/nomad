import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Image from 'next/image';
import Link from 'next/link';

const PopularActivities = ({ activities }) => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 5000,
    arrows: true,
    responsive: [
      {
        breakpoint: 1919,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1101,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full h-[600px] flex items-center overflow-hidden bg-green-dark">
      <style jsx global>{`
        .slick-prev,
        .slick-next {
          width: 40px;
          height: 40px;
          z-index: 10;
        }
        .slick-prev {
          left: 25px;
        }
        .slick-next {
          right: 25px;
        }
        .slick-prev:before,
        .slick-next:before {
          font-size: 40px;
          color: green;
        }
      `}</style>

      <div className="max-w-[1800px] w-full mx-auto px-4">
        <Slider {...settings}>
          {activities?.map((activity) => (
            <div key={activity.id} className="px-2">
              <div className="relative w-full min-[701px]:w-[350px] min-[1102px]:w-[400px] h-[500px] cursor-pointer bg-gray-100 rounded-lg flex flex-col justify-around group">
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center rounded-lg z-10">
                  <Link href={`/activities/${activity.id}`}>
                    <div className="text-white text-xl font-semibold px-6 py-3 border-2 border-white rounded-full hover:bg-white hover:text-black transition-colors duration-300">
                      체험 자세히 보기
                    </div>
                  </Link>
                </div>

                <div className="overflow-hidden flex justify-center">
                  <Image
                    src={activity.bannerImageUrl}
                    width={300}
                    height={250}
                    alt={activity.title}
                    className="object-cover rounded-lg"
                  />
                </div>
                <div className="px-4 min-[701px]:px-12 min-[1102px]:px-16">
                  <div className="w-full border-t border-green-dark"></div>
                  <div className="mt-4 flex flex-col">
                    <div>⭐ {activity.rating}</div>
                    <h3 className="text-lg min-[701px]:text-xl min-[1102px]:text-2xl font-bold">
                      {activity.title}
                    </h3>
                    <div className="flex items-center">
                      <span className="text-base min-[701px]:text-lg font-semibold">
                        ₩ {activity.price?.toLocaleString()} / 1인
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularActivities;
