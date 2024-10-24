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
}

export interface ActivitiesResponse {
  activities: Activity[];
  totalCount: number;
}

export interface Time {
  id: number;
  startTime: string;
  endTime: string;
}

export interface Schedule {
  date: string;
  times: Time[];
}

export interface SubImage {
  id: number;
  imageUrl: string;
}

export interface Experience {
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
  subImages: SubImage[];
  schedules: Schedule[];
}

// 폼 입력용 타입 - API 응답과 분리
export interface ExperienceFormData {
  title: string;
  category: string;
  description: string;
  address: string;
  bannerImage: FileList;
  subImages: FileList[];
  schedules: {
    date: string;
    times: { startTime: string; endTime: string }[];
  }[];
  price: number;
}