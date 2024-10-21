/* eslint-disable @next/next/no-img-element */
import { Activity } from '@/types/activity/activity';

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <div className="w-full">
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
);

export default ActivityCard;