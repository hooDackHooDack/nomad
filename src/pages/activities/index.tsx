import ActivityCard from '@/components/landing/ActivityCard';
import basicApi from '@/lib/axios/basic';
import { ActivitiesResponse } from '@/types/activity/activity';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import PopularActivities from '@/components/popular/PopularActivities';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import FilterSection from '@/components/landing/FilterSection';

interface FetchActivitiesParams {
  cursorId?: number;
  size?: number;
  category?: string;
  sort?: string;
  keyword?: string;
}

const fetchActivities = async ({
  cursorId,
  size = 9,
  category,
  sort,
  keyword,
}: FetchActivitiesParams) => {
  const params: {
    method: string;
    cursorId?: number;
    size: number;
    category?: string;
    sort?: string;
    keyword?: string;
  } = {
    method: 'cursor',
    size,
  };

  if (cursorId) {
    params.cursorId = cursorId;
  }

  if (category) {
    params.category = category;
  }

  if (sort) {
    params.sort = sort;
  }

  if (keyword) {
    params.keyword = keyword;
  }

  const { data } = await basicApi.get<ActivitiesResponse>('activities', {
    params,
  });
  return data;
};

export default function Home() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // Popular activities query
  const { data: popularActivities } = useQuery<ActivitiesResponse>({
    queryKey: ['popularActivities'],
    queryFn: () => fetchActivities({ size: 10, sort: 'most_reviewed' }),
  });

  // Infinite query for all activities
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<ActivitiesResponse>({
    queryKey: ['infiniteActivities', category, sort, keyword],
    queryFn: async ({ pageParam }) =>
      fetchActivities({
        cursorId: pageParam as number | undefined,
        category,
        sort,
        keyword,
      }),
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.activities.length === 0) return undefined;
      const lastActivity = lastPage.activities[lastPage.activities.length - 1];
      return lastActivity?.id;
    },
  });

  // Sticky header logic with position restoration
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current && filterWrapperRef.current) {
        const filterTop = filterWrapperRef.current.getBoundingClientRect().top;
        const shouldStick = filterTop <= 0;

        if (shouldStick !== isFilterSticky) {
          setIsFilterSticky(shouldStick);
          if (!shouldStick) {
            // Reset styles when returning to original position
            filterRef.current.style.position = '';
            filterRef.current.style.top = '';
            filterRef.current.style.width = '';
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFilterSticky]);

  // Intersection Observer setup
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0.1 },
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const allActivities =
    data?.pages.flatMap((page: ActivitiesResponse) => page.activities) ?? [];

  if (status === 'error' && error instanceof Error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PopularActivities activities={popularActivities?.activities} />

      <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">🛼 모든 체험</h1>
        </div>

        <div ref={filterWrapperRef} className="relative mb-12">
          <div
            ref={filterRef}
            className={`bg-white backdrop-blur-sm transition-all duration-300 ${
              isFilterSticky
                ? 'fixed top-0 left-0 right-0 z-50 shadow-lg'
                : 'rounded-2xl shadow-md'
            }`}
          >
            <div
              ref={filterRef}
              className={`bg-white backdrop-blur-sm transition-all duration-300 ${
                isFilterSticky
                  ? 'fixed top-0 left-0 right-0 z-50 shadow-lg'
                  : 'rounded-2xl shadow-md'
              }`}
            >
              <div
                className={`max-w-[1920px] mx-auto ${isFilterSticky ? 'px-4 py-6 bg-gray-50' : 'p-4'}`}
              >
                <FilterSection
                  category={category}
                  setCategory={setCategory}
                  sort={sort}
                  setSort={setSort}
                  keyword={keyword}
                  setKeyword={setKeyword}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Activity Grid */}
        <div className="grid gap-4 sm:gap-6 lg:gap-8">
          <div
            className={`
      grid gap-8 sm:gap-6 lg:gap-8
      grid-cols-1 
      [@media(max-width:610px)]:grid-cols-1
      sm:grid-cols-2
      md:grid-cols-3 
      lg:grid-cols-4
    `}
          >
            {allActivities.map((activity) => (
              <div
                key={activity.id}
                className="w-full transform transition-transform duration-200 hover:-translate-y-1"
              >
                <ActivityCard activity={activity} />
              </div>
            ))}
          </div>
        </div>

        {/* Loading State */}
        <div ref={loadMoreRef} className="py-12 text-center">
          {isFetchingNextPage ? (
            <div className="inline-block px-8 py-4 bg-white rounded-full shadow-md text-gray-700">
              Loading more...
            </div>
          ) : hasNextPage ? (
            <div className="text-gray-500">Scroll for more</div>
          ) : allActivities.length > 0 ? (
            <div className="text-gray-500">모든 체험을 불러왔습니다</div>
          ) : (
            <div className="text-gray-500">체험이 없습니다</div>
          )}
        </div>
      </div>
    </div>
  );
}
