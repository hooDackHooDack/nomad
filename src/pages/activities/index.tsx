import ActivityCard from '@/components/landing/ActivityCard';
import basicApi from '@/lib/axios/basic';
import { ActivitiesResponse } from '@/types/activity/activity';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import { useEffect, useRef, useState } from 'react';
import PopularActivities from '@/components/popular/PopularActivities';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

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

  const handleSortChange = (selectedSort: string) => {
    setSort(selectedSort);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    if (category === selectedCategory) {
      setCategory('');
    } else {
      setCategory(selectedCategory);
    }
  };

  const handleKeywordChange = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
  };

  const categories = [
    '문화 · 예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];

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
    <div>
      <PopularActivities activities={popularActivities?.activities} />
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-around">
          <h1 className="text-3xl font-bold my-6">모든 체험</h1>
          <div className="flex border-2 justify-around">
            <div className="flex gap-2 items-center">
              {categories.map((c) => (
                <button
                  key={c}
                  onClick={() => handleCategoryChange(c)}
                  className={`px-3 py-1 rounded-md ${
                    category === c
                      ? 'bg-green-dark text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
            <input
              type="text"
              value={keyword}
              onChange={(e) => handleKeywordChange(e.target.value)}
              className="px-3 py-2 border rounded-md mr-2"
              placeholder="검색어를 입력하세요"
            />
            <div>
              <select
                value={sort}
                onChange={(e) => handleSortChange(e.target.value)}
                className="px-3 py-1 rounded-md mb-2 border-2"
              >
                <option value="">가격</option>
                <option value="price_asc">가격 낮은 순</option>
                <option value="price_desc">가격 높은 순</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {allActivities.map((activity) => (
            <div key={activity.id} className="w-full">
              <ActivityCard activity={activity} />
            </div>
          ))}
        </div>

        {/* Loading indicator and intersection observer target */}
        <div ref={loadMoreRef} className="py-4 text-center">
          {isFetchingNextPage ? (
            <div className="text-center py-4">Loading more...</div>
          ) : hasNextPage ? (
            <div className="text-gray-400">Scroll for more</div>
          ) : (
            <div className="text-gray-400">No more activities</div>
          )}
        </div>
      </div>
    </div>
  );
}
