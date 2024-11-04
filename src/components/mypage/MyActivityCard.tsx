/* eslint-disable @next/next/no-img-element */
import { Star, MoreVertical } from 'lucide-react';
import Dropdown, { DropdownOption } from '@/components/Dropdown';

const MyActivityCard = ({ activity, onDelete }) => {
  const options: DropdownOption[] = [
    { label: '수정하기', value: `edit` },
    { label: '삭제하기', value: `delete` },
  ];

  const handleSelect = (value: string | number) => {
    if (value === 'edit') {
      window.location.href = `/activities/edit/basic?id=${activity.id}`;
    } else if (value === 'delete') {
      onDelete?.(activity.id);
    }
  };

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
          <Dropdown
            trigger={
              <MoreVertical
                size={20}
                className="text-gray-500 hover:text-gray-700 cursor-pointer"
              />
            }
            options={options}
            onSelect={handleSelect}
            align="end"
          />
        </div>
      </div>
    </div>
  );
};

export default MyActivityCard;
