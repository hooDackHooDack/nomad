/* eslint-disable @next/next/no-img-element */
import { Activity } from "@/types/activity/activity";

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={activity.bannerImageUrl}
      alt={activity.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{activity.title}</h2>
      <h1 className="text-sm text-gray-500 mb-2">{activity.id}</h1>
      <p className="text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
      <p className="text-sm text-gray-500 mb-1">{activity.address}</p>
      <p className="text-sm text-gray-500 mb-1">{activity.category}</p>
      <p className="text-lg font-bold text-green-600 mb-2">${activity.price}</p>
      <p className="text-sm text-yellow-500">
        Rating: {activity.rating} ({activity.reviewCount} reviews)
      </p>
    </div>
  </div>
);

export default ActivityCard;