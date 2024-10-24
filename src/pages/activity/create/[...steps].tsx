// pages/activity/create/[...steps].tsx
import { useRouter } from 'next/router';
import ActivityCreateLayout from '@/components/createActivity/ActivityCreateLayout';
import BasicStep from '@/components/createActivity/steps/BasicStep';
import ImagesStep from '@/components/createActivity/steps/ImageStep';
import ScheduleStep from '@/components/createActivity/steps/ScheduleStep';
import LocationStep from '@/components/createActivity/steps/LocationStep';

type StepKey = 'basic' | 'location' | 'images' | 'schedule';

const stepComponents = {
  basic: BasicStep,
  location: LocationStep,
  images: ImagesStep,
  schedule: ScheduleStep
};

export default function ActivityCreatePage() {
  const router = useRouter();
  
  const currentStep = router.isReady && router.query.steps ? 
    (Array.isArray(router.query.steps) ? router.query.steps[0] : router.query.steps) : 'basic';
    
  const StepComponent = stepComponents[currentStep as StepKey] || stepComponents.basic;

  return (
    <ActivityCreateLayout>
      <StepComponent />
    </ActivityCreateLayout>
  );
}