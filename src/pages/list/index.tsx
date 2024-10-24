import ActivityCard from '@/components/landing/ActivityCard';
import basicApi from '@/lib/axios/basic';
import { ActivitiesResponse } from '@/types/activity/activity';
import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import Pagination from 'react-js-pagination';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';

const fetchActivities = async (
  page: number = 1,
  size: number = 6,
  category?: string,
  sort?: string,
  keyword?: string,
) => {
  const params: {
    method: string;
    page: number;
    size: number;
    category?: string;
    sort?: string;
    keyword?: string;
  } = {
    method: 'offset',
    page,
    size,
  };

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
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [keyword, setKeyword] = useState('');
  const pageSize = 6;

  const {
    data: popularActivities,
    isFetching: isFetchingPopular,
    isError: isErrorPopular,
  } = useQuery<ActivitiesResponse, Error>({
    queryKey: ['popularActivities'],
    queryFn: () => fetchActivities(1, 10, undefined, 'most_reviewed'),
  });

  const { data, isPending, isError, error, isFetching } = useQuery<
    ActivitiesResponse,
    Error
  >({
    queryKey: ['activities', page, category, sort, keyword],
    queryFn: () => fetchActivities(page, pageSize, category, sort, keyword),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleSortChange = (selectedSort: string) => {
    setSort(selectedSort);
    setPage(1);
  };

  const handleCategoryChange = (selectedCategory: string) => {
    if (category === selectedCategory) {
      setCategory(''); // 동일한 카테고리를 누르면 선택 취소
    } else {
      setCategory(selectedCategory); // 새로운 카테고리 선택
    }
    setPage(1);
  };

  const handleKeywordChange = (selectedKeyword: string) => {
    setKeyword(selectedKeyword);
    setPage(1);
  };

  const categories = [
    '문화 · 예술',
    '식음료',
    '스포츠',
    '투어',
    '관광',
    '웰빙',
  ];

  const sliderSettings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
  };

  if (isPending || isFetching)
    return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">인기 체험</h1>

      {isFetchingPopular ? (
        <div className="text-center py-4">Loading...</div>
      ) : isErrorPopular ? (
        <div className="text-center py-4 text-red-500">Error</div>
      ) : (
        <Slider {...sliderSettings}>
          {popularActivities?.activities.map((activity) => (
            <div key={activity.id} className="w-1/3 px-2">
              <ActivityCard activity={activity} />
            </div>
          ))}
        </Slider>
      )}

      <h1 className="text-3xl font-bold my-6">모든 체험</h1>
      <div className="mb-6">
        <div className="mb-2">Category</div>
        <div className="flex gap-2">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => handleCategoryChange(c)}
              className={`px-3 py-1 rounded-md ${category === c ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div>
        <select
          value={sort}
          onChange={(e) => handleSortChange(e.target.value)}
          className="px-3 py-1 rounded-md mb-2"
        >
          <option value="">가격</option>
          <option value="price_asc">가격 낮은 순</option>
          <option value="price_desc">가격 높은 순</option>
        </select>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={keyword}
          onChange={(e) => handleKeywordChange(e.target.value)}
          className="px-3 py-2 border rounded-md mr-2"
          placeholder="검색어를 입력하세요"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {data?.activities.map((activity) => (
          <div key={activity.id} className="w-full">
            <ActivityCard activity={activity} />
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-4">
        {data && (
          <Pagination
            activePage={page}
            itemsCountPerPage={pageSize}
            totalItemsCount={data.totalCount || 0}
            pageRangeDisplayed={5}
            onChange={handlePageChange}
            innerClass="flex items-center space-x-2"
            itemClass="px-3 py-1 rounded-md mx-1 cursor-pointer hover:bg-blue-100"
            activeClass="bg-blue-500 text-white hover:bg-blue-600"
            disabledClass="text-gray-400 cursor-not-allowed"
          />
        )}
      </div>
    </div>
  );
}
