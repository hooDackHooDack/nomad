import { Activity } from '@/types/activity/activity';
import Link from 'next/link';
import CustomImage from '../../../fallback/CustomImage';

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <Link
    href={`/activities/${activity.id}`}
    className="block w-full h-full transition-transform duration-200 hover:scale-105"
  >
    <div className="w-full h-full bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 cursor-pointer overflow-hidden">
      <div className="relative w-full aspect-[4/3]">
        <CustomImage
          src={activity.bannerImageUrl}
          alt={activity.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      <div className="p-5">
        <div className="flex items-center mb-4">
          <span className="flex items-center text-lg text-yellow-500">
            ⭐ {activity.rating}
          </span>
          <span className="text-gray-500 ml-2">
            리뷰 {activity.reviewCount}개
          </span>
        </div>

        <h3 className="text-xl font-semibold mb-4 line-clamp-2 min-h-[3.5rem]">
          {activity.title}
        </h3>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <p className="text-2xl font-bold text-green-dark">
            ₩ {activity.price.toLocaleString()}
            <span className="text-lg text-gray-600 font-normal ml-1">/ 인</span>
          </p>
        </div>
      </div>
    </div>
  </Link>
);

export default ActivityCard;
