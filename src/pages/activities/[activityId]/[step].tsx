// pages/activity/[action]/[...steps].tsx
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import BasicStep from '@/components/createActivity/steps/BasicStep';
import ImagesStep from '@/components/createActivity/steps/ImageStep';
import ScheduleStep from '@/components/createActivity/steps/ScheduleStep';
import LocationStep from '@/components/createActivity/steps/LocationStep';
import ActivityCreateLayout from '@/components/createActivity/layout/ActivityCreateLayout';
import { getActivityById } from '@/lib/api/activity';
import { ActivityFormInput, ActivityDetail } from '@/types/activity/activity';

type StepKey = 'basic' | 'location' | 'images' | 'schedule';
type ActionType = 'create' | 'edit';

const stepComponents = {
  basic: BasicStep,
  location: LocationStep,
  images: ImagesStep,
  schedule: ScheduleStep,
};

// ActivityDetail을 ActivityFormInput 형식으로 변환하는 함수
const transformActivityDetailToFormInput = (
  detail: ActivityDetail,
): ActivityFormInput => {
  return {
    title: detail.title,
    category: detail.category,
    description: detail.description,
    address: detail.address,
    price: detail.price,
    bannerImageUrl: detail.bannerImageUrl,
    subImageUrls: detail.subImages.map((img) => img.imageUrl),
    schedules: detail.schedules.map((schedule) => ({
      date: schedule.date,
      startTime: schedule.startTime,
      endTime: schedule.endTime,
    })),
  };
};

export default function ActivityPage() {
  const router = useRouter();
  const { activityId, step, id } = router.query;

  const action = activityId;

  // 활동 데이터 fetch (edit 모드일 때만)
  const { data: activityResponse, isLoading } = useQuery({
    queryKey: ['activity', id],
    queryFn: () => getActivityById(id as string),
    enabled: action === 'edit' && !!id,
  });

  // URL 유효성 검사
  useEffect(() => {
    if (router.isReady) {
      const isValidAction = action === 'create' || action === 'edit';
      const isValidStep =
        step === 'basic' ||
        step === 'location' ||
        step === 'images' ||
        step === 'schedule';

      if (!isValidAction || !isValidStep) {
        router.replace('/404');
        return;
      }

      if (action === 'edit' && !id) {
        router.replace('/404');
        return;
      }
    }
  }, [router.isReady, action, step, id, router]);

  // edit 모드에서 로딩 중일 때
  if (action === 'edit' && isLoading) {
    return <div>Loading...</div>;
  }

  const StepComponent = stepComponents[step as StepKey] || stepComponents.basic;

  const initialValues: ActivityFormInput =
    action === 'edit' && activityResponse?.data
      ? transformActivityDetailToFormInput(activityResponse.data)
      : {
          title: '',
          category: '',
          description: '',
          address: '',
          price: 0,
          bannerImageUrl: '',
          subImageUrls: [],
          schedules: [
            {
              date: '',
              startTime: '',
              endTime: '',
            },
          ],
        };

  return (
    <ActivityCreateLayout
      mode={action as ActionType}
      activityId={id as string}
      initialValues={initialValues}
    >
      <StepComponent />
    </ActivityCreateLayout>
  );
}
