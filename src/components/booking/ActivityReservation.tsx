import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { checkSchedule, reservationsActivity } from '@/lib/api/activity';
import { Calendar } from '@/components/ui/calendar';
import { alertModal } from '@/utils/alert/alertModal';

interface ActivityReservationProps {
  title: string;
  activityId: number;
  price: number;
}

const ActivityReservation = ({
  activityId,
  title,
  price,
}: ActivityReservationProps) => {
  const [open, setOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [headCount, setHeadCount] = useState(1);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<number>();
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date());
  const [step, setStep] = useState<'select' | 'confirm'>('select');

  const { data: availableDates } = useQuery({
    queryKey: [
      'availableSchedules',
      activityId,
      format(currentMonth, 'yyyy'),
      format(currentMonth, 'MM'),
    ],
    queryFn: () =>
      checkSchedule({
        year: parseInt(format(currentMonth, 'yyyy')),
        month: parseInt(format(currentMonth, 'MM')),
        activityId,
      }),
    enabled: open,
  });

  const availableDatesSet = new Set(
    availableDates?.data?.map((schedule) => schedule.date),
  );

  const handleDateSelect = (date: Date | undefined) => {
    if (date) {
      setSelectedDate(date);
      setSelectedTimeSlot(undefined);
    }
  };

  const handleMonthChange = (date: Date) => {
    setCurrentMonth(date);
    setSelectedDate(undefined);
    setSelectedTimeSlot(undefined);
  };

  const selectedDateTimes = selectedDate
    ? availableDates?.data?.find(
        (schedule) => schedule.date === format(selectedDate, 'yyyy-MM-dd'),
      )?.times
    : [];

  const handleDrawerOpenChange = (isOpen: boolean) => {
    setOpen(isOpen);
    if (!isOpen) {
      setSelectedDate(undefined);
      setHeadCount(1);
      setSelectedTimeSlot(undefined);
      setCurrentMonth(new Date());
      setStep('select'); // step 초기화 추가
    }
  };

  const handleReservation = () => {
    if (!selectedTimeSlot || !selectedDate) return;
    setStep('confirm');
  };

  const processReservation = async () => {
    if (selectedTimeSlot && selectedDate) {
      try {
        const response = await reservationsActivity({
          scheduleId: Number(selectedTimeSlot),
          headCount,
          activityId,
        });
        if (response.status === 201) {
          alertModal({
            icon: 'success',
            text: '예약이 성공적으로 완료되었습니다.',
            timer: 3000,
          });
        }
        setOpen(false);
      } catch (error: any) {
        const errCode = error.status;
        if (errCode === 409) {
          alertModal({
            icon: 'warning',
            text: '이미 신청한 예약 입니다',
            timer: 3000,
          });
        } else if (errCode === 400) {
          alertModal({
            icon: 'warning',
            text: '이미 지난 일정은 예약할 수 없습니다.',
            timer: 3000,
          });
        }
      } finally {
        setStep('select');
        setSelectedDate(undefined);
        setSelectedTimeSlot(undefined);
        setHeadCount(1);
        setCurrentMonth(new Date());
        setOpen(false);
      }
    }
  };

  return (
    <div className="fixed z-1 bottom-0 left-0 right-0 p-4 bg-white border-t">
      <div className="max-w-4xl mx-auto">
        <Drawer open={open} onOpenChange={handleDrawerOpenChange}>
          <DrawerTrigger asChild>
            <div className="flex justify-between items-center w-full">
              <div>
                <div className="flex text-xl font-bold items-center">
                  ₩ {(price * headCount).toLocaleString()}
                  <p className="mx-2 font-medium text-gray-700"> / 1명</p>
                </div>
              </div>
              <div className="hidden md:block lg:block font-bold text-green-dark text-xl">
                {title}
              </div>
              <button className="w-36 bg-green-dark text-white py-4 rounded-lg font-semibold hover:opacity-90 transition-opacity">
                예약하기
              </button>
            </div>
          </DrawerTrigger>
          <DrawerContent>
            {step === 'select' ? (
              <div className="max-w-2xl mx-auto w-full">
                <div className="p-4 flex flex-col items-center">
                  <div className="flex justify-center w-full mb-6">
                    <div className="w-[400px]">
                      <h4 className="text-lg font-semibold mb-2">날짜</h4>
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={handleDateSelect}
                        onMonthChange={handleMonthChange}
                        locale={ko}
                        modifiers={{
                          available: (date) =>
                            availableDatesSet.has(format(date, 'yyyy-MM-dd')),
                          today: (date) =>
                            format(date, 'yyyy-MM-dd') ===
                            format(new Date(), 'yyyy-MM-dd'),
                          selected: (date) =>
                            date?.toDateString() ===
                            selectedDate?.toDateString(),
                        }}
                        modifiersStyles={{
                          available: {
                            border: '1px solid #0B3D2D',
                            borderRadius: '4px',
                          },
                          today: {
                            border: '2px solid #FFC230',
                            borderRadius: '4px',
                          },
                          selected: {
                            backgroundColor: '#0B3D2D',
                            color: '#FFFFFF',
                            borderRadius: '4px',
                          },
                        }}
                        styles={{
                          day: {
                            border: 'none',
                          },
                        }}
                        disabled={(date) =>
                          !availableDatesSet.has(format(date, 'yyyy-MM-dd'))
                        }
                      />
                    </div>
                  </div>

                  <div className="w-full max-w-[400px]">
                    <h4 className="text-lg font-semibold mb-2">
                      이용 가능 시간
                    </h4>
                    <div className="min-h-[100px]">
                      {!selectedDate ? (
                        <div className="text-gray-500 text-center py-8">
                          날짜를 선택해 주세요.
                        </div>
                      ) : selectedDateTimes && selectedDateTimes.length > 0 ? (
                        <div className="grid grid-cols-2 gap-2">
                          {selectedDateTimes.map((time) => (
                            <button
                              key={time.id}
                              onClick={() => setSelectedTimeSlot(time.id)}
                              className={`p-3 rounded-lg border transition-all ${
                                selectedTimeSlot === time.id
                                  ? 'bg-green-dark text-white border-green-dark'
                                  : 'border-gray-300 hover:border-green-dark'
                              }`}
                            >
                              {time.startTime} - {time.endTime}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="text-gray-500 text-center py-8">
                          {format(selectedDate, 'MM')}월의 이용 가능한 시간이
                          없습니다.
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="w-full max-w-[400px] mt-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="text-lg font-semibold">인원 선택</h4>
                      <div className="flex items-center gap-4">
                        <button
                          onClick={() =>
                            setHeadCount((prev) => Math.max(1, prev - 1))
                          }
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-dark"
                        >
                          -
                        </button>
                        <span className="text-lg w-8 text-center">
                          {headCount}
                        </span>
                        <button
                          onClick={() => setHeadCount((prev) => prev + 1)}
                          className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center hover:border-green-dark"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="border-t border-gray-200 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-lg text-gray-600">총 금액</span>
                        <span className="text-xl font-bold">
                          ₩ {(price * headCount).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <DrawerFooter>
                  <button
                    onClick={handleReservation}
                    disabled={!selectedTimeSlot}
                    className="w-full bg-green-dark text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    예약하기
                  </button>
                  <DrawerClose asChild>
                    <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:border-green-dark">
                      취소
                    </button>
                  </DrawerClose>
                </DrawerFooter>
              </div>
            ) : (
              <div className="max-w-2xl mx-auto w-full p-4">
                <h2 className="text-xl font-bold mb-4">예약 확인</h2>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg">
                    <h3 className="font-semibold mb-2">{title}</h3>
                    <p>날짜: {format(selectedDate!, 'yyyy년 MM월 dd일')}</p>
                    <p>
                      시간:{' '}
                      {
                        selectedDateTimes?.find(
                          (t) => t.id === selectedTimeSlot,
                        )?.startTime
                      }{' '}
                      -{' '}
                      {
                        selectedDateTimes?.find(
                          (t) => t.id === selectedTimeSlot,
                        )?.endTime
                      }
                    </p>
                    <p>인원: {headCount}명</p>
                    <p className="font-bold mt-2">
                      총 금액: ₩{(price * headCount).toLocaleString()}
                    </p>
                  </div>
                </div>
                <DrawerFooter>
                  <button
                    onClick={processReservation}
                    className="w-full bg-green-dark text-white py-3 rounded-lg font-semibold hover:opacity-90 transition-opacity"
                  >
                    예약 확정하기
                  </button>
                  <button
                    onClick={() => setStep('select')}
                    className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:border-green-dark"
                  >
                    이전으로
                  </button>
                </DrawerFooter>
              </div>
            )}
          </DrawerContent>
        </Drawer>
      </div>
    </div>
  );
};
export default ActivityReservation;
