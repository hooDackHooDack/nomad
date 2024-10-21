import { useState } from 'react';
import { useQuery, keepPreviousData } from '@tanstack/react-query';
import Pagination from 'react-js-pagination';
import basicApi from '@/components/lib/axios/baiscAxios';

interface Activity {
  id: number;
  userId: number;
  title: string;
  description: string;
  category: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ActivitiesResponse {
  activities: Activity[];
  totalCount: number;
}

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

const ActivityCard = ({ activity }: { activity: Activity }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden">
    <img
      src={activity.bannerImageUrl}
      alt={activity.title}
      className="w-full h-48 object-cover"
    />
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-2">{activity.title}</h2>
      <h1 className="text-sm text-gray-500 mb-2">{activity.id}</h1>
      <p className="text-gray-600 mb-2 line-clamp-2">{activity.description}</p>
      <p className="text-sm text-gray-500 mb-1">{activity.address}</p>
      <p className="text-sm text-gray-500 mb-1">{activity.category}</p>
      <p className="text-lg font-bold text-green-600 mb-2">${activity.price}</p>
      <p className="text-sm text-yellow-500">
        Rating: {activity.rating} ({activity.reviewCount} reviews)
      </p>
    </div>
  </div>
);

const Main = () => {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [sort, setSort] = useState('');
  const [keyword, setKeyword] = useState(''); // 하나의 검색어 상태로 통합
  const pageSize = 6;

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
    setPage(1); // 페이지를 1로 초기화
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

  if (isPending) return <div className="text-center py-10">Loading...</div>;
  if (isError)
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error.message}
      </div>
    );

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Activities</h1>

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
          <ActivityCard key={activity.id} activity={activity} />
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

      {isFetching && <div className="text-center mt-4">Loading...</div>}
    </div>
  );
};

export default Main;
