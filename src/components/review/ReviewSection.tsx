import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import Pagination from 'react-js-pagination';
import { ReviewCard } from './ReviewCard';
import { getReview } from '@/lib/api/activity';
import { ActivitiesReview } from '@/types/activity/activity';
import { ChangeRating } from '@/utils/review/ChangeRating';
import Image from 'next/image';

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
      <div className="flex flex-col gap-4 mb-6">
        <h2 className="text-xl font-bold">후기</h2>
        <div className="flex items-center gap-4">
          <div>
            <span className="text-3xl">⭐</span>
            <span className="text-3xl font-bold">
              {reviewData?.averageRating.toFixed(1)}
            </span>
          </div>
          <div className="flex flex-col">
            <span className="text-2lg">
              {reviewData ? ChangeRating(reviewData.averageRating) : null}
            </span>
            <span className="text-gray-500 text-sm ">
              {reviewData?.totalCount.toLocaleString()}개의 리뷰
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {reviewData && reviewData.reviews.length > 0 ? (
          reviewData.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))
        ) : (
          <div className="flex items-center justify-center">
            <Image
              src={'/icons/button/not_yet.png'}
              alt="image"
              width={80}
              height={80}
            />
            <div className="text-gray-500 text-2xl">리뷰는 아직 없는걸요</div>
          </div>
        )}
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
