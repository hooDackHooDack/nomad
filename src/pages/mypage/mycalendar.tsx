import { useState, useEffect, useMemo } from 'react';
import MyPageLayout from '@/components/mypage/MypageLayout';
import { Calendar } from '@/components/ui/calendar';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { fetchMyActivities } from '@/lib/api/activity';
import authApi from '@/lib/axios/auth';
import CalendarDayContent from '@/components/mypage/mycalendar/CalendarDayContent';
import ReservationColor from '@/components/mypage/mycalendar/ReservationColor';
import ActivityDropdown from '@/components/mypage/mycalendar/ActivityDropdown';

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

        <ActivityDropdown
          selectedTitle={selectedActivityTitle}
          options={activityOptions}
          onSelect={handleActivitySelect}
        />

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

                return (
                  <CalendarDayContent
                    date={date}
                    reservation={reservation?.reservations}
                    {...props}
                  />
                );
              },
            }}
          />
        </div>

        <ReservationColor />
      </div>
    </MyPageLayout>
  );
};

export default MyCalendarPage;
