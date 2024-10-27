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

// 폼 상태 관리용 타입
export interface ExperienceFormData {
  title: string;
  category: string;
  description: string;
  address: string;
  price: number;
  schedules: Array<{
    date: string;
    times: Array<{
      startTime: string;
      endTime: string;
    }>;
  }>;
  bannerImageUrl: string | null;
  subImages: string[];
  bannerPreview: string;
  subPreviews: string[];
}