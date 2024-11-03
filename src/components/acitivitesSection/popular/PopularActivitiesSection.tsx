import { useQuery } from '@tanstack/react-query';
import { fetchActivities } from '@/lib/api/activity';
import { ActivitiesResponse } from '@/types/activity/activity';
import Slider from 'react-slick';
import PopularActivityCard from './card/PopularActivityCard';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const PopularActivities = () => {
  const { data: popularActivitiesData } = useQuery<ActivitiesResponse>({
    queryKey: ['popularActivities'],
    queryFn: async () => {
      const response = await fetchActivities({
        size: 10,
        sort: 'most_reviewed',
      });
      return response.data;
    },
    staleTime: 1000 * 60 * 10, // 10분
    gcTime: 1000 * 60 * 20, // 20분
  });

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
          {popularActivitiesData?.activities?.map((activity) => (
            <div key={activity.id} className="px-2">
              <PopularActivityCard activity={activity} />
            </div>
          ))}
        </Slider>
      </div>
    </div>
  );
};

export default PopularActivities;
