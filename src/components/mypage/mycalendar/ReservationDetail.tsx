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
import { QueryClient, useMutation, useQuery } from '@tanstack/react-query';
import Dropdown from '@/components/Dropdown';
import { ChevronDown } from 'lucide-react';
import { alertModal } from '@/utils/alert/alertModal';
import {
  fetchReservationsBySchedule,
  fetchReservedSchedule,
  updateReservationStatus,
} from '@/lib/api/myReservation';
import ReservationStatusTabs from './ReservationStatus';
import ReservationCard from './ReservationCard';
import { RESERVATION_ALERT_MESSAGES } from '@/components/constants/alert/reservation';

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
  const updateReservationStatusMutation = useMutation({
    mutationFn: async ({
      reservationId,
      status,
    }: {
      reservationId: number;
      status: 'confirmed' | 'declined';
    }) => {
      return updateReservationStatus({ reservationId, activityId, status });
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

      alertModal(RESERVATION_ALERT_MESSAGES.STATUS.UPDATE_SUCCESS);
    },
    onError: (error: any) => {
      alertModal(RESERVATION_ALERT_MESSAGES.STATUS.UPDATE_ERROR);
      console.error('Failed to update reservation status:', error);
    },
  });

  // 예약 승인 핸들러
  const handleConfirm = async (reservationId: number) => {
    updateReservationStatusMutation.mutate({
      reservationId,
      status: 'confirmed',
    });
  };

  // 예약 거절 핸들러
  const handleDecline = async (reservationId: number) => {
    updateReservationStatusMutation.mutate({
      reservationId,
      status: 'declined',
    });
  };

  const { data: schedules } = useQuery<ReservedSchedule[]>({
    queryKey: ['reservedSchedule', activityId, format(date, 'yyyy-MM-dd')],
    queryFn: () => fetchReservedSchedule(activityId, date),
    enabled: !!activityId && isOpen,
  });

  const { data: reservations, isLoading: isLoadingReservations } =
    useQuery<ReservationResponse>({
      queryKey: ['reservations', activityId, selectedScheduleId, activeStatus],
      queryFn: () =>
        fetchReservationsBySchedule(
          activityId,
          selectedScheduleId as number,
          activeStatus,
        ),
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
                <ReservationStatusTabs
                  activeStatus={activeStatus}
                  counts={selectedSchedule.count}
                  onChangeStatus={setActiveStatus}
                />

                <div className="space-y-3">
                  {isLoadingReservations ? (
                    <div className="text-center py-8">로딩중...</div>
                  ) : reservations?.reservations.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      예약 내역이 없습니다
                    </div>
                  ) : (
                    reservations?.reservations.map((reservation) => (
                      <ReservationCard
                        key={reservation.id}
                        reservation={reservation}
                        activeStatus={activeStatus}
                        onConfirm={handleConfirm}
                        onDecline={handleDecline}
                        isProcessing={updateReservationStatusMutation.isPending}
                      />
                    ))
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
