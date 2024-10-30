import { Activity } from '@/types/activity/activity';
import Link from 'next/link';

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <Link
    href={`/activities/${activity.id}`}
    className="block w-full transition-transform duration-200 hover:scale-105"
  >
    <div className="w-full cursor-pointer">
      <img
        src={activity.bannerImageUrl}
        alt={activity.title}
        className="w-full h-48 object-cover rounded-xl mb-4"
      />
      <p className="text-lg mb-3">
        ⭐ {activity.rating}
        <span className="text-gray-500 ml-1">({activity.reviewCount})</span>
      </p>
      <p className="text-2xl font-semibold mb-2 truncate">{activity.title}</p>
      <p className="text-2xl font-bold mb-2">
        ₩ {activity.price}
        <span className="text-lg text-gray-700 ml-1">/ 인</span>
      </p>
    </div>
  </Link>
);

export default ActivityCard;
