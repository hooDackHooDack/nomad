import { useEffect, useRef, useState } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import ActivityCard from '@/components/acitivitesSection/allActivites/card/ActivityCard';
import FilterSection from '@/components/acitivitesSection/allActivites/fillter/FilterSection';
import { fetchActivities } from '@/lib/api/activity';
import { ActivitiesResponse } from '@/types/activity/activity';

export default function AllActivitiesSection() {
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isFilterSticky, setIsFilterSticky] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);
  const filterWrapperRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    error,
  } = useInfiniteQuery<ActivitiesResponse>({
    queryKey: ['infiniteActivities', category, sort, keyword],
    queryFn: async ({ pageParam }) => {
      const response = await fetchActivities({
        cursorId: pageParam as number | undefined,
        category,
        sort,
        keyword,
      });
      return response.data;
    },
    initialPageParam: undefined,
    getNextPageParam: (lastPage) => {
      if (lastPage.activities.length === 0) return undefined;
      const lastActivity = lastPage.activities[lastPage.activities.length - 1];
      return lastActivity?.id;
    },
    staleTime: 1000 * 60 * 5, // 3분
    gcTime: 1000 * 60 * 15, // 10분
  });

  // Sticky header logic
  useEffect(() => {
    const handleScroll = () => {
      if (filterRef.current && filterWrapperRef.current) {
        const filterTop = filterWrapperRef.current.getBoundingClientRect().top;
        const shouldStick = filterTop <= 0;
        setIsFilterSticky(shouldStick);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isFilterSticky]);

  // Intersection Observer for infinite loading
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

  const allActivities = data?.pages.flatMap((page) => page.activities) ?? [];

  if (status === 'error' && error instanceof Error) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );
  }

  return (
    <section>
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
            className={`max-w-[1920px] mx-auto ${
              isFilterSticky ? 'px-4 py-6 bg-gray-50' : 'p-4'
            }`}
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
    </section>
  );
}
