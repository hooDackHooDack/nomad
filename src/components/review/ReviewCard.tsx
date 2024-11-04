import Image from 'next/image';
import { Review } from '@/types/activity/activity';

interface ReviewCardProps {
  review: Review;
}

export const ReviewCard = ({ review }: ReviewCardProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
    });
  };

  return (
    <div className="border-b border-gray-200 py-6 last:border-none">
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-12 h-12 rounded-full overflow-hidden">
          <Image
            src={review.user.profileImageUrl}
            alt={review.user.nickname}
            fill
            className="object-cover"
          />
        </div>
        <div>
          <h3 className="font-semibold">{review.user.nickname}</h3>
          <div className="flex items-center gap-2 text-sm text-gray-600">
            <span className="flex items-center gap-1">
              ⭐ {review.rating.toFixed(1)}
            </span>
            <span className="text-gray-300">|</span>
            <span>{formatDate(review.createdAt)}</span>
          </div>
        </div>
      </div>
      <p className="text-gray-700 whitespace-pre-line">{review.content}</p>
    </div>
  );
};
