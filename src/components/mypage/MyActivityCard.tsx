/* eslint-disable @next/next/no-img-element */
import { Star } from 'lucide-react';
import { MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';

const MyActivityCard = ({ activity, onDelete }) => {
  return (
    <div className="flex bg-white rounded-lg shadow-md h-36">
      <div className="size-36 flex-shrink-0">
        <img
          src={activity.bannerImageUrl}
          alt="Activity Image"
          className="w-full h-full object-cover rounded-l-lg"
        />
      </div>
      <div className="flex-1 p-4 flex flex-col justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Star size={16} className="text-yellow fill-yellow" />
            {activity.rating}
            <span className="text-gray-500 ml-1">
              ({activity.reviewCount} reviews)
            </span>
          </div>
          <h2 className="text-lg font-bold leading-tight">{activity.title}</h2>
        </div>
        <div className="flex justify-between items-center">
          <p className="font-bold">₩ {activity.price.toLocaleString()}</p>
          <DropdownMenu>
            <DropdownMenuTrigger className="border-none focus:outline-none">
              <MoreVertical
                size={20}
                className="text-gray-500 hover:text-gray-700 outline-none"
              />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-32">
              <Link href={`/activities/edit/basic?id=${activity.id}`}>
                <DropdownMenuItem className="flex items-center justify-center cursor-pointer">
                  수정하기
                </DropdownMenuItem>
              </Link>
              <DropdownMenuItem
                onClick={() => onDelete?.(activity.id)}
                className="flex items-center justify-center cursor-pointer"
              >
                삭제하기
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
};

export default MyActivityCard;
