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
) => {
  const { data } = await basicApi.get<ActivitiesResponse>('activities', {
    params: {
      method: 'offset',
      page,
      size,
    },
  });
  return data;
};

const ActivityCard: React.FC<{ activity: Activity }> = ({ activity }) => (
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
  const pageSize = 6;

  const { data, isPending, isError, error, isFetching } = useQuery<
    ActivitiesResponse,
    Error
  >({
    queryKey: ['activities', page],
    queryFn: () => fetchActivities(page, pageSize),
    placeholderData: keepPreviousData,
  });

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

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
