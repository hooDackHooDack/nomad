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

const MyCalendarPage = () => {
  const [selectedActivity, setSelectedActivity] = useState('');
  const [selectedActivityTitle, setSelectedActivityTitle] =
    useState<string>('체험을 선택하세요');
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());

  // Fetch activities
  const { data: activitiesResponse, isLoading } = useQuery<ActivityResponse>({
    queryKey: ['myActivities'],
    queryFn: async () => {
      const response = await fetchMyActivities();
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

  // Fetch reservations for selected activity and current month
  const { data: reservations } = useQuery<Reservation[]>({
    queryKey: [
      'reservations',
      selectedActivity,
      format(currentMonth, 'yyyy'),
      format(currentMonth, 'MM'),
    ],
    queryFn: async () => {
      if (!selectedActivity) return [];
      const response = await authApi.get(
        `/my-activities/${selectedActivity}/reservation-dashboard?year=${format(currentMonth, 'yyyy')}&month=${format(currentMonth, 'MM')}`,
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

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
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
            selected={currentMonth}
            onSelect={(newDate) => newDate && setCurrentMonth(newDate)}
            onMonthChange={handleMonthChange}
            locale={ko}
            className="rounded-md"
            classNames={{
              day_today: 'text-yellow font-bold',
              cell: 'h-24 w-24 p-0 relative',
              head_cell: 'h-12 w-24',
              day: 'h-24 w-24',
            }}
            components={{
              Day: ({ date, ...props }) => {
                const formattedDate = format(date, 'yyyy-MM-dd');
                const reservation = reservations?.find(
                  (r) => r.date === formattedDate,
                );

                const hasReservations =
                  reservation &&
                  (reservation.reservations.completed > 0 ||
                    reservation.reservations.confirmed > 0 ||
                    reservation.reservations.pending > 0);

                return (
                  <div className="relative h-24 w-24 p-0 border-y" {...props}>
                    <div className="absolute top-2 left-2 flex items-center gap-1">
                      <span>{format(date, 'd')}</span>
                      {hasReservations && (
                        <div className="flex gap-0.5">
                          {reservation.reservations.completed > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-green-bright" />
                          )}
                          {reservation.reservations.confirmed > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-blue" />
                          )}
                          {reservation.reservations.pending > 0 && (
                            <div className="w-1.5 h-1.5 rounded-full bg-yellow" />
                          )}
                        </div>
                      )}
                    </div>
                    {reservation && (
                      <div className="absolute bottom-1 left-2 right-2 space-y-1">
                        {reservation.reservations.completed > 0 && (
                          <div className="bg-green-bright text-[10px] text-white px-2 py-0.5 rounded-sm">
                            완료 ({reservation.reservations.completed})
                          </div>
                        )}
                        {reservation.reservations.confirmed > 0 && (
                          <div className="bg-blue text-[10px] text-white px-2 py-0.5 rounded-sm">
                            확정 ({reservation.reservations.confirmed})
                          </div>
                        )}
                        {reservation.reservations.pending > 0 && (
                          <div className="bg-yellow text-[10px] text-white px-2 py-0.5 rounded-sm">
                            대기 ({reservation.reservations.pending})
                          </div>
                        )}
                      </div>
                    )}
                  </div>
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
