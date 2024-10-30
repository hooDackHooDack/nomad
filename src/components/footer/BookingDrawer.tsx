import React, { useState } from 'react';
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/ui/drawer';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';
import { Activity } from '@/types/activity/activity';

interface Schedule {
  id: number;
  date: string;
  startTime: string;
  endTime: string;
}

interface BookingDrawerProps {
  activity: Activity;
  schedules: Schedule[];
}

enum BookingStep {
  SELECT_DATE,
  SELECT_TIME,
  SELECT_QUANTITY,
  CONFIRM,
}

const BookingDrawer = ({ activity, schedules }: BookingDrawerProps) => {
  const [currentStep, setCurrentStep] = useState<BookingStep>(
    BookingStep.SELECT_DATE,
  );
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);

  // 모든 상태를 초기화하는 함수
  const resetState = () => {
    setCurrentStep(BookingStep.SELECT_DATE);
    setSelectedDate(null);
    setSelectedTime(null);
    setQuantity(1);
  };

  // 이전 단계로 가는 함수
  const handlePrevStep = () => {
    switch (currentStep) {
      case BookingStep.SELECT_TIME:
        setCurrentStep(BookingStep.SELECT_DATE);
        break;
      case BookingStep.SELECT_QUANTITY:
        setCurrentStep(BookingStep.SELECT_TIME);
        break;
      case BookingStep.CONFIRM:
        setCurrentStep(BookingStep.SELECT_QUANTITY);
        break;
      default:
        break;
    }
  };

  // 예약 가능한 날짜들을 Date 객체로 변환
  const availableDates = schedules.map((schedule) => new Date(schedule.date));

  // 선택된 날짜의 가능한 시간대 추출
  const availableTimesForDate = schedules
    .filter(
      (schedule) =>
        schedule.date === format(selectedDate || new Date(), 'yyyy-MM-dd'),
    )
    .map((schedule) => ({
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    }));

  const handleQuantityChange = (adjustment: number) => {
    setQuantity(Math.max(1, quantity + adjustment));
  };

  const calculateTotal = () => {
    return quantity * (activity?.price || 0);
  };

  // DatePicker에서 날짜가 예약 가능한지 확인하는 함수
  const isAvailableDate = (date: Date) => {
    return availableDates.some(
      (availableDate) =>
        format(availableDate, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd'),
    );
  };

  // 날짜 선택 핸들러
  const handleDateSelect = (date: Date | null) => {
    if (date) {
      setSelectedDate(date);
      setCurrentStep(BookingStep.SELECT_TIME);
    }
  };

  // 선택 가능한 날짜 수 계산
  const getAvailableDatesCount = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return schedules.filter((schedule) => {
      const scheduleDate = new Date(schedule.date);
      return scheduleDate >= today;
    }).length;
  };

  const DateSelection = () => {
    const availableDatesCount = getAvailableDatesCount();

    // dayClassName 핸들러 수정
    const handleDayClassName = (date: Date): string => {
      return isAvailableDate(date) ? 'react-datepicker__day--available' : '';
    };
    return (
      <div className="p-4">
        <style>
          {`
            .react-datepicker {
              font-family: inherit;
              width: 100%;
              border: none;
            }
            .react-datepicker__month-container {
              width: 100%;
            }
            .react-datepicker__day {
              width: 2.5rem;
              line-height: 2.5rem;
              margin: 0.2rem;
            }
            .react-datepicker__day--selected {
              background-color: #2563eb !important;
            }
            .react-datepicker__day--keyboard-selected {
              background-color: #93c5fd !important;
            }
            .react-datepicker__day--available:not(.react-datepicker__day--selected) {
              border: 2px solid #22c55e;
              border-radius: 0.3rem;
            }
            .react-datepicker__day--today {
              border: 2px solid #ef4444 !important;
              border-radius: 0.3rem;
            }
            .react-datepicker__day--disabled {
              cursor: not-allowed;
              color: #ccc;
            }
            .react-datepicker__day:hover {
              border-radius: 0.3rem;
            }
          `}
        </style>
        <DatePicker
          selected={selectedDate}
          onChange={(date: Date | null) => {
            if (date) {
              handleDateSelect(date);
            }
          }}
          onSelect={(date: Date | null) => {
            if (date) {
              handleDateSelect(date);
            }
          }}
          inline
          locale={ko}
          minDate={new Date()}
          dayClassName={handleDayClassName}
          filterDate={isAvailableDate}
          calendarClassName="w-full"
          showDisabledMonthNavigation
        />
        <div className="text-center mt-4">
          {availableDatesCount > 0 ? (
            <p className="text-gray-500">
              현재 선택 가능한 날짜는 총 {availableDatesCount}개 입니다.
            </p>
          ) : (
            <p className="text-gray-500">
              현재 선택 가능한 날짜가 존재하지 않습니다.
            </p>
          )}
        </div>
      </div>
    );
  };

  const TimeSelection = () => (
    <div className="p-4">
      <h3 className="font-medium mb-4">
        {selectedDate && format(selectedDate, 'M월 d일', { locale: ko })}
      </h3>
      <div className="grid grid-cols-2 gap-4">
        {availableTimesForDate.map((time, index) => (
          <button
            key={index}
            onClick={() => {
              setSelectedTime(time.startTime);
              setCurrentStep(BookingStep.SELECT_QUANTITY);
            }}
            className="p-3 border border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 text-gray-700"
          >
            {time.startTime} - {time.endTime}
          </button>
        ))}
      </div>
    </div>
  );

  const QuantitySelection = () => (
    <div className="p-4">
      <div className="mb-6">
        <h3 className="text-sm font-medium mb-2">인원 선택</h3>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => handleQuantityChange(-1)}
            disabled={quantity <= 1}
            className={`w-8 h-8 rounded-full flex items-center justify-center border
              ${
                quantity <= 1
                  ? 'border-gray-200 text-gray-300 cursor-not-allowed'
                  : 'border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700'
              }`}
          >
            -
          </button>
          <span className="text-lg font-medium">{quantity}명</span>
          <button
            onClick={() => handleQuantityChange(1)}
            className="w-8 h-8 rounded-full flex items-center justify-center border border-gray-300 text-gray-600 hover:border-gray-400 hover:text-gray-700"
          >
            +
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>상품 금액</span>
          <span>{activity?.price?.toLocaleString()}원</span>
        </div>
        <div className="flex justify-between text-sm">
          <span>인원</span>
          <span>{quantity}명</span>
        </div>
        <div className="w-full h-[1px] bg-gray-200 my-2" />
        <div className="flex justify-between font-bold">
          <span>총 결제금액</span>
          <span className="text-blue-600">
            {calculateTotal().toLocaleString()}원
          </span>
        </div>
      </div>

      <button
        onClick={() => setCurrentStep(BookingStep.CONFIRM)}
        className="w-full bg-green-dark hover:bg-gray-50 hover:text-green-dark text-gray-100 py-3 rounded-lg font-medium mt-6"
      >
        다음
      </button>
    </div>
  );

  const Confirmation = () => (
    <div className="p-4">
      <h3 className="font-medium mb-4">예약 정보 확인</h3>
      <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
        <div className="flex justify-between">
          <span className="text-gray-600">체험</span>
          <span className="font-medium">{activity.title}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">날짜</span>
          <span className="font-medium">
            {selectedDate &&
              format(selectedDate, 'yyyy년 M월 d일', { locale: ko })}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">시간</span>
          <span className="font-medium">{selectedTime}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">인원</span>
          <span className="font-medium">{quantity}명</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">총 금액</span>
          <span className="font-medium text-blue-600">
            {calculateTotal().toLocaleString()}원
          </span>
        </div>
      </div>

      <button
        onClick={() => {
          // TODO: 예약 확정 API 호출
          console.log('예약 확정:', {
            date: selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null,
            time: selectedTime,
            quantity,
            totalAmount: calculateTotal(),
          });
        }}
        className="w-full bg-green-dark hover:bg-gray-50 hover:text-green-dark text-gray-100 py-3 rounded-lg font-medium mt-6"
      >
        확인
      </button>
    </div>
  );

  const renderStep = () => {
    switch (currentStep) {
      case BookingStep.SELECT_DATE:
        return <DateSelection />;
      case BookingStep.SELECT_TIME:
        return <TimeSelection />;
      case BookingStep.SELECT_QUANTITY:
        return <QuantitySelection />;
      case BookingStep.CONFIRM:
        return <Confirmation />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 p-4 z-50">
        <div className="container mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-gray-600">1인 기준</span>
            <span className="text-xl font-bold">
              {activity?.price?.toLocaleString()}원
            </span>
          </div>
          <Drawer
            onOpenChange={(open) => {
              if (!open) resetState();
            }}
          >
            <DrawerTrigger asChild>
              <button className="bg-green-dark hover:bg-gray-50 hover:text-green-dark text-gray-100 px-8 py-3 rounded-lg font-medium transition-colors">
                예약하기
              </button>
            </DrawerTrigger>
            <DrawerContent className="h-[50vh]">
              <div className="mx-auto w-full max-w-sm overflow-y-auto h-full">
                <DrawerHeader className="sticky top-0 bg-white z-10">
                  <div className="flex items-center">
                    {currentStep !== BookingStep.SELECT_DATE && (
                      <button
                        onClick={handlePrevStep}
                        className="mr-2 p-2 hover:bg-gray-100 rounded-lg"
                      >
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M15 18l-6-6 6-6" />
                        </svg>
                      </button>
                    )}
                    <DrawerTitle>
                      {currentStep === BookingStep.SELECT_DATE && '날짜 선택'}
                      {currentStep === BookingStep.SELECT_TIME && '시간 선택'}
                      {currentStep === BookingStep.SELECT_QUANTITY &&
                        '인원 선택'}
                      {currentStep === BookingStep.CONFIRM && '예약 확인'}
                    </DrawerTitle>
                  </div>
                </DrawerHeader>
                {renderStep()}
              </div>
            </DrawerContent>
          </Drawer>
        </div>
      </div>
      <div className="h-20" />
    </>
  );
};

export default BookingDrawer;
