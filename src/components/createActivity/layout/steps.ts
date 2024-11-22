export const steps = [
  {
    id: 'basic',
    title: '기본 정보',
    path: 'basic',
    image: '/images/number/one.png',
  },
  {
    id: 'location',
    title: '위치 정보',
    path: 'location',
    image: '/images/number/two.png',
  },
  {
    id: 'schedule',
    title: '일정 관리',
    path: 'schedule',
    image: '/images/number/three.png',
  },
  {
    id: 'images',
    title: '이미지 등록',
    path: 'images',
    image: '/images/number/four.png',
  },
];

export interface Step {
  id: string;
  title: string;
  path: string;
  image: string;
}

export type StepStatus = 'completed' | 'current' | 'incomplete' | 'upcoming';
