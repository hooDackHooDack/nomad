import { useState, useEffect, useMemo } from 'react';
import MyPageLayout from '@/components/mypage/MypageLayout';
import { Calendar } from '@/components/ui/calendar';
import Dropdown from '@/components/Dropdown';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { ChevronDown } from 'lucide-react';
import { fetchMyActivities } from '@/lib/api/activity';
import authApi from '@/lib/axios/auth';

interface Activity {
  id: number;
  title: string;
}

interface ActivityResponse {
  activities: Activity[];
  totalCount: number;
  cursorId: null;
}

interface Reservation {
  date: string;
  reservations: {
    completed: number;
    confirmed: number;
    pending: number;
  };
}

interface DayContent {
  date: Date;
  completed?: number;
  confirmed?: number;
  pending?: number;
}

const MyCalendarPage = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedActivityTitle, setSelectedActivityTitle] =
    useState<string>('체험을 선택하세요');
  const [date, setDate] = useState<Date>(new Date());

  // Fetch activities
  const { data: activitiesResponse, isLoading } = useQuery<ActivityResponse>({
    queryKey: ['myActivities'],
    queryFn: async () => {
      const response = await fetchMyActivities();
      console.log('Activities Response:', response); // 데이터 구조 확인
      return response.data;
    },
  });

  const activities = useMemo(
    () => activitiesResponse?.activities || [],
    [activitiesResponse],
  );

  useEffect(() => {
    if (!isLoading && activities.length > 0 && !selectedActivity) {
      setSelectedActivity(activities[0].id.toString());
      setSelectedActivityTitle(activities[0].title);
    }
  }, [activities, selectedActivity, isLoading]);

  const { data: reservations } = useQuery<Reservation[]>({
    queryKey: [
      'reservations',
      selectedActivity,
      date.getFullYear(),
      date.getMonth() + 1,
    ],
    queryFn: async () => {
      if (!selectedActivity) return [];
      const response = await authApi.get(
        `/my-activities/${selectedActivity}/reservation-dashboard?year=${date.getFullYear()}&month=${date.getMonth() + 1}`,
      );
      return response.data;
    },
    enabled: !!selectedActivity,
  });

  const activityOptions = activities.map((activity) => ({
    label: activity.title,
    value: activity.id.toString(),
  }));

  const handleActivitySelect = (value: string | number) => {
    setSelectedActivity(value.toString());
    const selectedTitle = activities.find(
      (a) => a.id.toString() === value.toString(),
    )?.title;
    if (selectedTitle) {
      setSelectedActivityTitle(selectedTitle);
    }
  };

  const DayContent = ({ completed = 0, confirmed = 0, pending = 0 }: DayContent) => {
    if (!completed && !confirmed && !pending) return null;

    return (
      <div className="w-full h-full flex flex-col items-center">
        <div className="text-xs mt-1">
          {completed > 0 && (
            <div className="bg-green-bright px-1 rounded text-white mb-0.5">
              완료 {completed}
            </div>
          )}
          {confirmed > 0 && (
            <div className="bg-blue px-1 rounded text-white mb-0.5">
              확정 {confirmed}
            </div>
          )}
          {pending > 0 && (
            <div className="bg-yellow px-1 rounded text-white">
              대기 {pending}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <MyPageLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">예약 현황</h1>

        <div className="w-full max-w-xs">
          <Dropdown
            trigger={
              <div className="flex items-center justify-between w-full px-4 py-2 text-sm border rounded-lg bg-white">
                <span>{selectedActivityTitle}</span>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </div>
            }
            options={activityOptions}
            onSelect={handleActivitySelect}
            align="start"
            className="max-h-[240px] overflow-y-auto"
          />
        </div>

        <div className="p-4 bg-white rounded-lg shadow">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(newDate) => newDate && setDate(newDate)}
            locale={ko}
            className="rounded-md"
            components={{
              DayContent: ({ date }) => {
                const reservation = reservations?.find(
                  (r) => r.date === format(date, 'yyyy-MM-dd'),
                );

                return (
                  <DayContent
                    date={date}
                    completed={reservation?.reservations.completed}
                    confirmed={reservation?.reservations.confirmed}
                    pending={reservation?.reservations.pending}
                  />
                );
              },
            }}
          />
        </div>

        <div className="flex gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-green-bright" />
            <span>완료된 예약</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue" />
            <span>확정된 예약</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-yellow" />
            <span>대기중인 예약</span>
          </div>
        </div>
      </div>
    </MyPageLayout>
  );
};

export default MyCalendarPage;
