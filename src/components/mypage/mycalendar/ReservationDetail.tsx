import { useState } from 'react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import {
  QueryClient,
  useMutation,
  useQuery,
} from '@tanstack/react-query';
import authApi from '@/lib/axios/auth';
import Dropdown from '@/components/Dropdown';
import { ChevronDown } from 'lucide-react';
import { alertModal } from '@/utils/alert/alertModal';

interface ReservedSchedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: {
    declined: number;
    confirmed: number;
    pending: number;
  };
}

interface Reservation {
  id: number;
  status: 'pending' | 'confirmed' | 'declined';
  headCount: number;
  nickname: string;
}

interface ReservationResponse {
  reservations: Reservation[];
  totalCount: number;
  cursorId: null;
}

interface ReservationDetailProps {
  date: Date;
  activityId: string;
  isOpen: boolean;
  queryClient: QueryClient;
  currentMonth: Date;
  onOpenChange: (open: boolean) => void;
}

const ReservationDetail = ({
  date,
  activityId,
  isOpen,
  queryClient,
  currentMonth,
  onOpenChange,
}: ReservationDetailProps) => {
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(
    null,
  );
  const [selectedTime, setSelectedTime] = useState('시간을 선택하세요');
  const [activeStatus, setActiveStatus] = useState<
    'pending' | 'confirmed' | 'declined'
  >('pending');

  // 예약 상태 변경 mutation
  const updateReservationStatus = useMutation({
    mutationFn: async ({
      reservationId,
      status,
    }: {
      reservationId: number;
      status: 'confirmed' | 'declined';
    }) => {
      const response = await authApi.patch(
        `/my-activities/${activityId}/reservations/${reservationId}`,
        { status },
      );
      return response.data;
    },
    onSuccess: () => {
      // 예약 상세 목록 갱신
      queryClient.invalidateQueries({
        queryKey: ['reservations', activityId, selectedScheduleId],
      });

      // 선택된 날짜의 스케줄 데이터 갱신
      queryClient.invalidateQueries({
        queryKey: ['reservedSchedule', activityId, format(date, 'yyyy-MM-dd')],
      });

      // 달력의 월별 예약 현황 갱신
      queryClient.invalidateQueries({
        queryKey: [
          'reservations',
          activityId,
          format(currentMonth, 'yyyy'),
          format(currentMonth, 'MM'),
        ],
      });

      alertModal({
        icon: 'success',
        text: '예약 상태가 변경되었습니다.',
        timer: 2000,
      });
    },
    onError: (error: any) => {
      alertModal({
        icon: 'error',
        text: '예약 상태 변경에 실패했습니다.',
        timer: 2000,
      });
      console.error('Failed to update reservation status:', error);
    },
  });

  // 예약 승인 핸들러
  const handleConfirm = async (reservationId: number) => {
    updateReservationStatus.mutate({
      reservationId,
      status: 'confirmed',
    });
  };

  // 예약 거절 핸들러
  const handleDecline = async (reservationId: number) => {
    updateReservationStatus.mutate({
      reservationId,
      status: 'declined',
    });
  };

  const { data: schedules } = useQuery<ReservedSchedule[]>({
    queryKey: ['reservedSchedule', activityId, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      const response = await authApi.get(
        `/my-activities/${activityId}/reserved-schedule?date=${format(date, 'yyyy-MM-dd')}`,
      );
      return response.data;
    },
    enabled: !!activityId && isOpen,
  });

  const { data: reservations, isLoading: isLoadingReservations } =
    useQuery<ReservationResponse>({
      queryKey: ['reservations', activityId, selectedScheduleId, activeStatus],
      queryFn: async () => {
        const response = await authApi.get(
          `/my-activities/${activityId}/reservations?size=10&scheduleId=${selectedScheduleId}&status=${activeStatus}`,
        );
        return response.data;
      },
      enabled: !!activityId && !!selectedScheduleId,
    });

  const selectedSchedule = schedules?.find(
    (schedule) => schedule.scheduleId === selectedScheduleId,
  );

  // 드롭다운 옵션 생성
  const timeOptions =
    schedules?.map((schedule) => ({
      label: `${schedule.startTime} - ${schedule.endTime}`,
      value: schedule.scheduleId,
    })) || [];

  // 시간대 선택 핸들러
  const handleTimeSelect = (value: string | number) => {
    setSelectedScheduleId(Number(value));
    const schedule = schedules?.find((s) => s.scheduleId === Number(value));
    if (schedule) {
      setSelectedTime(`${schedule.startTime} - ${schedule.endTime}`);
    }
  };

  return (
    <Drawer open={isOpen} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="w-full max-w-3xl mx-auto p-6">
          <DrawerHeader className="px-0">
            <DrawerTitle className="text-2xl font-bold">예약 정보</DrawerTitle>
            <p className="text-gray-600 mt-2">
              {format(date, 'yyyy년 MM월 dd일', { locale: ko })}
            </p>
          </DrawerHeader>

          <div className="mt-6 space-y-6">
            {/* 시간대 선택 드롭다운 */}
            <div className="w-full">
              <Dropdown
                trigger={
                  <div className="flex items-center justify-between w-full px-4 py-2 text-base border border-gray-300 rounded-lg bg-white">
                    <span>{selectedTime}</span>
                    <ChevronDown className="w-4 h-4 text-gray-500" />
                  </div>
                }
                options={timeOptions}
                onSelect={handleTimeSelect}
                align="start"
                className="max-h-[240px] overflow-y-auto"
              />
            </div>

            {selectedSchedule && (
              <div className="space-y-4 min-h-56">
                <h3 className="text-lg font-semibold">예약 내역</h3>

                {/* 상태 탭 */}
                <div className="flex border-b border-gray-200">
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeStatus === 'pending'
                        ? 'border-yellow text-yellow'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveStatus('pending')}
                  >
                    신청 {selectedSchedule.count.pending}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeStatus === 'confirmed'
                        ? 'border-blue text-blue'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveStatus('confirmed')}
                  >
                    승인 {selectedSchedule.count.confirmed}
                  </button>
                  <button
                    className={`px-4 py-2 text-sm font-medium border-b-2 -mb-px ${
                      activeStatus === 'declined'
                        ? 'border-red text-red'
                        : 'border-transparent text-gray-500 hover:text-gray-700'
                    }`}
                    onClick={() => setActiveStatus('declined')}
                  >
                    거절 {selectedSchedule.count.declined}
                  </button>
                </div>

                {/* 예약 카드 목록 */}
                <div className="space-y-3">
                  {isLoadingReservations ? (
                    <div className="text-center py-8">로딩중...</div>
                  ) : reservations?.reservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      예약 내역이 없습니다
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {reservations?.reservations.map((reservation) => (
                        <div
                          key={reservation.id}
                          className="p-4 border rounded-lg bg-white"
                        >
                          <div className="flex justify-between items-center">
                            <div className="space-y-1">
                              <p className="font-medium">
                                닉네임: {reservation.nickname}
                              </p>
                              <p className="text-sm text-gray-600">
                                예약 인원: {reservation.headCount}명
                              </p>
                            </div>
                            {activeStatus === 'pending' && (
                              <div className="flex gap-2">
                                <button
                                  onClick={() => handleConfirm(reservation.id)}
                                  disabled={updateReservationStatus.isPending}
                                  className="px-4 py-2 bg-green-dark text-white rounded-lg 
                                    hover:opacity-90 text-sm disabled:opacity-50 
                                    disabled:cursor-not-allowed"
                                >
                                  {updateReservationStatus.isPending
                                    ? '처리중...'
                                    : '승인하기'}
                                </button>
                                <button
                                  onClick={() => handleDecline(reservation.id)}
                                  disabled={updateReservationStatus.isPending}
                                  className="px-4 py-2 border border-gray-300 rounded-lg 
                                    hover:border-gray-400 text-sm disabled:opacity-50 
                                    disabled:cursor-not-allowed"
                                >
                                  {updateReservationStatus.isPending
                                    ? '처리중...'
                                    : '거절하기'}
                                </button>
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="mt-6">
            <DrawerClose className="w-full">
              <button className="w-full py-3 border border-gray-300 rounded-lg hover:border-gray-400">
                닫기
              </button>
            </DrawerClose>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
};

export default ReservationDetail;
