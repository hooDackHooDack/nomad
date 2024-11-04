import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from 'react-js-pagination';
import { ReviewCard } from './ReviewCard';
import { getReview } from '@/lib/api/activity';
import { ActivitiesReview } from '@/types/activity/activity';

interface ReviewSectionProps {
  activityId: number;
}

export const ReviewSection = ({ activityId }: ReviewSectionProps) => {
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 5;

  const { data: reviewData, isLoading } = useQuery<ActivitiesReview>({
    queryKey: ['reviews', activityId, currentPage],
    queryFn: async () => {
      const response = await getReview(activityId, currentPage, PAGE_SIZE);
      console.log('Review Response:', response.data); // 데이터 확인용
      return response.data;
    },
  });

  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div className="mb-[120px]">
      <div className="flex items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold">후기</h2>
        <div className="flex items-center">
          <span className="text-xl font-semibold">
            {reviewData?.averageRating.toFixed(1)}
          </span>
          <span className="text-yellow-400 ml-1">⭐</span>
          <span className="text-gray-500 ml-2">
            ({reviewData?.totalCount.toLocaleString()}개 후기)
          </span>
        </div>
      </div>

      <div className="space-y-4">
        {reviewData?.reviews.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {reviewData && reviewData.totalCount > 0 && (
        <div className="flex justify-center mt-8">
          <Pagination
            activePage={currentPage}
            itemsCountPerPage={PAGE_SIZE}
            totalItemsCount={reviewData.totalCount}
            pageRangeDisplayed={5}
            prevPageText="‹"
            nextPageText="›"
            onChange={handlePageChange}
            itemClass="px-3 py-1 rounded mx-1"
            linkClass="text-gray-600 hover:text-gray-900"
            activeClass="bg-green-dark gray-50"
            disabledClass="text-gray-300"
          />
        </div>
      )}
    </div>
  );
};
