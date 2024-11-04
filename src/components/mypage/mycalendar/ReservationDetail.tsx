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
import { useQuery } from '@tanstack/react-query';
import authApi from '@/lib/axios/auth';
import { ChevronDown } from 'lucide-react';

interface ReservedSchedule {
  scheduleId: number;
  startTime: string;
  endTime: string;
  count: {
    declined: number;
    confirmed: number;
    pending: number;
  };
  reservations?: {
    pending?: Array<{
      id: number;
      nickname: string;
      headCount: number;
    }>;
    confirmed?: Array<{
      id: number;
      nickname: string;
      headCount: number;
    }>;
    declined?: Array<{
      id: number;
      nickname: string;
      headCount: number;
    }>;
  };
}

interface ReservationDetailProps {
  date: Date;
  activityId: string;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

const ReservationDetail = ({
  date,
  activityId,
  isOpen,
  onOpenChange,
}: ReservationDetailProps) => {
  const [expandedTimeSlots, setExpandedTimeSlots] = useState<number[]>([]);

  // 해당 날짜의 예약 스케줄 조회
  const { data: schedules, isLoading } = useQuery<ReservedSchedule[]>({
    queryKey: ['reservedSchedule', activityId, format(date, 'yyyy-MM-dd')],
    queryFn: async () => {
      if (!activityId) return [];
      const response = await authApi.get(
        `/my-activities/${activityId}/reserved-schedule?date=${format(date, 'yyyy-MM-dd')}`,
      );
      return response.data;
    },
    enabled: !!activityId && isOpen,
  });

  const toggleTimeSlot = (scheduleId: number) => {
    setExpandedTimeSlots((prev) =>
      prev.includes(scheduleId)
        ? prev.filter((id) => id !== scheduleId)
        : [...prev, scheduleId],
    );
  };

  // 예약 승인 처리
  const handleConfirm = async (scheduleId: number, reservationId: number) => {
    try {
      // TODO: API 연동
      console.log('Confirm reservation:', scheduleId, reservationId);
    } catch (error) {
      console.error('Failed to confirm reservation:', error);
    }
  };

  // 예약 거절 처리
  const handleDecline = async (scheduleId: number, reservationId: number) => {
    try {
      // TODO: API 연동
      console.log('Decline reservation:', scheduleId, reservationId);
    } catch (error) {
      console.error('Failed to decline reservation:', error);
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

          {isLoading ? (
            <div className="flex justify-center items-center h-40">
              <p>로딩중...</p>
            </div>
          ) : (
            <div className="mt-6 space-y-4">
              {schedules?.map((schedule) => (
                <div
                  key={schedule.scheduleId}
                  className="border rounded-lg overflow-hidden"
                >
                  <div
                    className="flex items-center justify-between p-4 bg-gray-50 cursor-pointer hover:bg-gray-100"
                    onClick={() => toggleTimeSlot(schedule.scheduleId)}
                  >
                    <div className="flex items-center space-x-4">
                      <span className="font-medium">
                        {schedule.startTime} - {schedule.endTime}
                      </span>
                      <div className="flex space-x-2">
                        {schedule.count.pending > 0 && (
                          <span className="px-2 py-1 text-sm bg-yellow text-white rounded">
                            신청 {schedule.count.pending}
                          </span>
                        )}
                        {schedule.count.confirmed > 0 && (
                          <span className="px-2 py-1 text-sm bg-blue text-white rounded">
                            승인 {schedule.count.confirmed}
                          </span>
                        )}
                        {schedule.count.declined > 0 && (
                          <span className="px-2 py-1 text-sm bg-red text-white rounded">
                            거절 {schedule.count.declined}
                          </span>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform ${
                        expandedTimeSlots.includes(schedule.scheduleId)
                          ? 'rotate-180'
                          : ''
                      }`}
                    />
                  </div>

                  {expandedTimeSlots.includes(schedule.scheduleId) && (
                    <div className="p-4 space-y-4">
                      {schedule.reservations?.pending &&
                        schedule.reservations.pending.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">대기중인 예약</h4>
                            {schedule.reservations.pending.map(
                              (reservation) => (
                                <div
                                  key={reservation.id}
                                  className="bg-gray-50 p-4 rounded"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">
                                        닉네임: {reservation.nickname}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        인원: {reservation.headCount}명
                                      </p>
                                    </div>
                                    <div className="space-x-2">
                                      <button
                                        onClick={() =>
                                          handleConfirm(
                                            schedule.scheduleId,
                                            reservation.id,
                                          )
                                        }
                                        className="px-4 py-2 bg-green-dark text-white rounded hover:opacity-90"
                                      >
                                        승인하기
                                      </button>
                                      <button
                                        onClick={() =>
                                          handleDecline(
                                            schedule.scheduleId,
                                            reservation.id,
                                          )
                                        }
                                        className="px-4 py-2 border border-gray-300 rounded hover:border-gray-400"
                                      >
                                        거절하기
                                      </button>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {schedule.reservations?.confirmed &&
                        schedule.reservations.confirmed.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">승인된 예약</h4>
                            {schedule.reservations.confirmed.map(
                              (reservation) => (
                                <div
                                  key={reservation.id}
                                  className="bg-blue/10 p-4 rounded"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">
                                        닉네임: {reservation.nickname}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        인원: {reservation.headCount}명
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}

                      {schedule.reservations?.declined &&
                        schedule.reservations.declined.length > 0 && (
                          <div className="space-y-2">
                            <h4 className="font-medium">거절된 예약</h4>
                            {schedule.reservations.declined.map(
                              (reservation) => (
                                <div
                                  key={reservation.id}
                                  className="bg-red/10 p-4 rounded"
                                >
                                  <div className="flex items-center justify-between">
                                    <div>
                                      <p className="font-medium">
                                        닉네임: {reservation.nickname}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        인원: {reservation.headCount}명
                                      </p>
                                    </div>
                                  </div>
                                </div>
                              ),
                            )}
                          </div>
                        )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

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
