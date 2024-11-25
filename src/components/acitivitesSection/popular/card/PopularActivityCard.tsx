import Link from 'next/link';
import CustomImage from '@/components/fallback/CustomImage';
import { Activity } from '@/types/activity/activity';

interface PopularActivityCardProps {
  activity: Activity;
}

const PopularActivityCard = ({ activity }: PopularActivityCardProps) => {
  return (
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
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            src={activity.bannerImageUrl}
            fallbackSrc="/logo/logo_col_white.svg"
            fill
            className="object-cover"
            alt={activity.title}
            priority
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
          {/* Price and Rating */}
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
  );
};

export default PopularActivityCard;
