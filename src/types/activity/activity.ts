// 기본 활동 정보 인터페이스
export interface BaseActivity {
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

// 시간 슬롯 인터페이스
interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

// 활동 하위 이미지 인터페이스
interface ActivitySubImage {
  id: number;
  imageUrl: string;
}

// 활동 스케줄 인터페이스
interface ActivitySchedule {
  date: string;
  times: TimeSlot[];
}

// 기본 활동에 스케줄과 하위 이미지를 포함한 전체 활동 인터페이스
export interface Activity extends BaseActivity {
  schedules: ActivitySchedule[];
  subImages: ActivitySubImage[];
}

// 활동 상세 정보 인터페이스 (스케줄 형식만 다름)
export interface ActivityDetail extends BaseActivity {
  schedules: Array<TimeSlot & { date: string }>;
  subImages: ActivitySubImage[];
}

// API 요청 타입 - 활동 생성/수정용
export interface ActivityFormInput {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
  bannerImageUrl: string;
  subImageUrls: string[];
}

// 활동 목록 조회 응답 타입
export interface ActivitiesResponse {
  activities: Activity[];
  totalCount: number;
}

// 체험 예약 관련 타입들
export interface ActivityReservation {
  activityId: Activity['id'];
  scheduleId: number;
  headCount: number;
}

export interface CheckSchedule {
  activityId: Activity['id'];
  year: number;
  month: number;
}

// 체험 예약 가능일 조회 응답 타입
export type CheckScheduleRes = Array<{
  date: string;
  times: TimeSlot[];
}>;

// 활동 수정 요청 타입
export interface ActivityUpdateInput {
  title: string;
  category: string;
  description: string;
  price: number;
  address: string;
  bannerImageUrl: string;
  subImageIdsToRemove: number[];
  subImageUrlsToAdd: string[];
  scheduleIdsToRemove: number[];
  schedulesToAdd: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}

// ActivityFormInput에서 ActivityUpdateInput으로 변환 타입
export interface ActivityFormDiff {
  removedSubImageIds: number[];
  addedSubImageUrls: string[];
  removedScheduleIds: number[];
  addedSchedules: Array<{
    date: string;
    startTime: string;
    endTime: string;
  }>;
}