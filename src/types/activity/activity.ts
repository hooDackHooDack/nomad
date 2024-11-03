// API 요청 타입
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

// API 응답 타입
export interface Activity {
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
  schedules: ActivitySchedule[];
  subImages: ActivitySubImage[];
}

export interface ActivitySchedule {
  date: string;
  times: ActivityTime[];
}

export interface ActivityTime {
  id: number;
  startTime: string;
  endTime: string;
}

export interface ActivitySubImage {
  id: number;
  imageUrl: string;
}

// 활동 목록 조회 응답 타입
export interface ActivitiesResponse {
  activities: Activity[];
  totalCount: number;
}

// 활동 목록 아이템 타입
export interface ActivityItem {
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

// 체험예약신청 요청 body타입
export interface ActivityReservation {
  activityId: Activity['id'];
  scheduleId: number;
  headCount: number;
}

// 체험예약 가능일 조회 요청 타입
export interface CheckSchedule {
  activityId: Activity['id'];
  year: number;
  month: number;
}

// 체험예약 가능일 조회 응답 타입
interface TimeSlot {
  id: number;
  startTime: string;
  endTime: string;
}

interface ScheduleDate {
  date: string;
  times: TimeSlot[];
}

export type CheckScheduleRes = ScheduleDate[];

// 체험리스트 조회 API Parms 타입
export interface FetchActivitiesParams {
  cursorId?: number;
  size?: number;
  category?: string;
  sort?: string;
  keyword?: string;
}
