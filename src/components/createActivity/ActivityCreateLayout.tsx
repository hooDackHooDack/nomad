import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { CircleCheckIcon, CircleDotIcon, Circle } from 'lucide-react';
import { ExperienceFormData } from '@/types/activity/activity';

const steps = [
  { id: 'basic', title: '기본 정보', path: '/activity/create/basic' },
  { id: 'location', title: '주소', path: '/activity/create/location' },
  { id: 'schedule', title: '일정', path: '/activity/create/schedule' },
  { id: 'images', title: '이미지', path: '/activity/create/images' },
];

const ActivityCreateLayout = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<ExperienceFormData>({
    mode: 'onSubmit',
    defaultValues: {
      title: '',
      category: '',
      description: '',
      address: '',
      schedules: [{ date: '', times: [{ startTime: '', endTime: '' }] }],
    },
  });

  const router = useRouter();
  const formValues = methods.watch();

  // 현재 경로에서 단계 ID 추출
  const getCurrentStepId = () => {
    // asPath를 사용하여 실제 URL 경로를 가져옴
    const path = router.asPath;
    // URL에서 마지막 부분 추출 (예: /activity/create/basic -> basic)
    const currentPath = path.split('/').pop();
    // 현재 경로와 일치하는 step 찾기
    const currentStep = steps.find((step) =>
      step.path.includes(currentPath || ''),
    );
    return currentStep?.id || 'basic';
  };

  // 각 단계의 완료 상태 확인
  const checkStepCompletion = (stepId: string) => {

    switch (stepId) {
      case 'basic':
        // 기본 정보의 모든 필드가 채워져야 완료
        return Boolean(
          formValues.title?.trim() &&
            formValues.category?.trim() &&
            formValues.description?.trim(),
        );

      case 'location':
        // 주소 정보가 모두 채워져야 완료
        return Boolean(formValues.address?.trim());

      // case 'schedule':
      //   // 일정 정보가 모두 채워져야 완료
      //   return (
      //     formValues.schedules?.every(
      //       (schedule) =>
      //         // 날짜가 있고
      //         schedule.date &&
      //         // 모든 시간대가 채워져 있는지 확인
      //         schedule.times.every(
      //           (time) => time.startTime.trim() && time.endTime.trim(),
      //         ),
      //     ) || false
      //   );

      case 'images':
        // 필수 이미지가 모두 업로드되어야 완료
        return Boolean(
          formValues.bannerImage && formValues.bannerImage.length > 0,
        );

      default:
        return false;
    }
  };

  // 단계의 상태 결정
  const getStepStatus = (stepId: string) => {
    const currentStep = getCurrentStepId();
    const isCompleted = checkStepCompletion(stepId);
    const hasStarted = Boolean(Object.keys(formValues).some(key => 
      formValues[key as keyof ExperienceFormData] && 
      (typeof formValues[key as keyof ExperienceFormData] === 'string' ? formValues[key as keyof ExperienceFormData] !== '' : true)
    ));

    if (isCompleted) {
      return 'completed';
    }
    if (currentStep === stepId && hasStarted) {
      return 'in-progress';
    }
    return 'default';
  };

  // 상태에 따른 스타일 결정
  const getStepStyles = (status: string) => {
    const baseStyle = "group flex items-center px-3 py-4 text-md font-medium rounded-md transition-all duration-200";
    
    switch (status) {
      case 'completed':
        return `${baseStyle} bg-white shadow text-blue-DEFAULT`;
      case 'in-progress':
        return `${baseStyle} bg-white shadow text-yellow-DEFAULT`;
      default:
        return `${baseStyle} text-gray-700 hover:bg-white hover:shadow`;
    }
  };

  // 상태에 따른 아이콘 결정
  const getStepIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CircleCheckIcon className="w-5 h-5 text-blue-DEFAULT" />;
      case 'in-progress':
        return <CircleDotIcon className="w-5 h-5 text-yellow-DEFAULT" />;
      default:
        return <Circle className="w-5 h-5 text-gray-400" />;
    }
  };

  // 상태에 따른 텍스트 결정
  const getStepStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <span className="ml-3 text-sm font-medium text-blue-DEFAULT">
            완료
          </span>
        );
      case 'in-progress':
        return (
          <span className="ml-3 text-sm font-medium text-yellow-DEFAULT">
            작성중
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <FormProvider {...methods}>
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-3">
              <nav className="sticky top-8 space-y-1">
                {steps.map((step) => {
                  const status = getStepStatus(step.id);
                  return (
                    <Link
                      key={step.id}
                      href={step.path}
                      className={getStepStyles(status)}
                    >
                      <span className="mr-3">{getStepIcon(status)}</span>
                      <span className="flex-1">{step.title}</span>
                      {getStepStatusText(status)}
                    </Link>
                  );
                })}
              </nav>
            </div>

            <div className="col-span-9">
              <div className="bg-white shadow rounded-lg p-6">{children}</div>
            </div>
          </div>
        </div>
      </div>
    </FormProvider>
  );
};

export default ActivityCreateLayout;
