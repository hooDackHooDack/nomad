import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import Link from 'next/link';
import CustomImage from '../fallback/CustomImage';

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
        breakpoint: 1400,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 1080,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 700,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 610,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="w-full h-[600px] flex items-center overflow-hidden bg-green-dark rounded-md">
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
          color: white;
        }
      `}</style>

      <div className="max-w-[1800px] w-full mx-auto px-4">
        <Slider {...settings}>
          {activities?.map((activity) => (
            <div key={activity.id} className="px-2">
              <Link href={`/activities/${activity.id}`}>
                <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden cursor-pointer group">
                  {/* Best Icon */}
                  <div className="absolute top-4 left-4 z-20">
                    <CustomImage
                      src="/icons/button/best.png"
                      width={80}
                      height={80}
                      alt="Best Activity"
                      className="w-12 h-12"
                    />
                  </div>

                  {/* Background Image */}
                  <div className="absolute inset-0">
                    <CustomImage
                      src={activity.bannerImageUrl}
                      fallbackSrc="/logo/logo_col_white.svg"
                      fill
                      className="object-cover"
                      alt={activity.title}
                    />
                  </div>

                  {/* Dark Gradient Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

                  {/* Content */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white z-10">
                    {/* Title */}
                    <h3 className="text-3xl font-bold mb-2 line-clamp-2">
                      {activity.title}
                    </h3>
                    {/* Price */}
                    <div className="flex justify-between items-center">
                      <div className="flex items-center gap-1">
                        <span className="font-semibold text-xl">
                          ₩ {activity.price?.toLocaleString()}
                        </span>
                        <span className="text-md text-gray-300">/ 1인</span>
                      </div>
                      {/* Rating */}
                      <div className="flex items-center gap-1 mb-2">
                        <div>⭐</div>
                        <div className="text-lg">
                          {activity.rating} ({activity.reviewCount || 0})
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hover Effect */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                </div>
              </Link>
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularActivities;
