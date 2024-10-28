import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { ExperienceFormData } from '@/types/activity/activity';
import Image from 'next/image';
import { alertModal } from '@/utils/alert/alertModal';

const steps = [
  {
    id: 'basic',
    title: '기본 정보',
    path: '/activity/create/basic',
    image: '/images/number/one.png',
  },
  {
    id: 'location',
    title: '주소',
    path: '/activity/create/location',
    image: '/images/number/two.png',
  },
  {
    id: 'schedule',
    title: '일정',
    path: '/activity/create/schedule',
    image: '/images/number/three.png',
  },
  {
    id: 'images',
    title: '이미지',
    path: '/activity/create/images',
    image: '/images/number/four.png',
  },
];

const ActivityCreateLayout = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<ExperienceFormData>({
    mode: 'onChange',
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
  const { reset } = methods;
  const [alertShown, setAlertShown] = useState(false);

  useEffect(() => {
    const checkDraftData = () => {
      const draftData = localStorage.getItem('activityFormDraft');

      if (draftData && !alertShown) {
        // alertShown 상태 확인
        try {
          const { data } = JSON.parse(draftData);

          // 현재 경로가 basic인지 확인
          const currentPath = router.asPath;
          const isBasicPath = currentPath.includes('/activity/create/basic');

          if (isBasicPath) {
            alertModal({
              icon: 'info',
              text: '기존에 작성 중인 글이 존재합니다. 이어서 작성하시겠습니까?',
              showCancelButton: true,
              confirmButtonText: '이어서 작성하기',
              cancelButtonText: '임시저장 삭제하기',
              confirmedFunction: () => {
                reset(data);
              },
              confirmedDismiss: () => {
                localStorage.removeItem('activityFormDraft');
              },
            });
            setAlertShown(true); // 경고창을 한 번 표시한 후 상태를 업데이트
          }
        } catch (error) {
          console.error('Draft data parsing error:', error);
          localStorage.removeItem('activityFormDraft');

          alertModal({
            icon: 'error',
            text: '임시저장된 데이터를 불러오는데 실패했습니다.',
            confirmButtonText: '확인',
          });
        }
      }
    };

    // router가 준비되었을 때만 실행
    if (router.isReady) {
      checkDraftData();
    }
  }, [router.isReady, router.asPath, reset, alertShown]);

  // 24시간이 지난 임시저장 데이터 자동 삭제
  useEffect(() => {
    const cleanupDraftData = () => {
      const draftData = localStorage.getItem('activityFormDraft');

      if (draftData) {
        try {
          const { timestamp } = JSON.parse(draftData);
          const savedTime = new Date(timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);

          if (hoursDiff >= 24) {
            localStorage.removeItem('activityFormDraft');
          }
        } catch (error) {
          console.error('Draft cleanup error:', error);
          localStorage.removeItem('activityFormDraft');
        }
      }
    };

    cleanupDraftData();
  }, []);

  const validateBasicStep = () => {
    const { title, category, description } = formValues;
    return Boolean(title?.trim() && category?.trim() && description?.trim());
  };

  const validateLocationStep = () => {
    return Boolean(formValues.address?.trim());
  };

  const validateScheduleStep = () => {
    return formValues.schedules?.some(
      (schedule) =>
        schedule.date &&
        schedule.times?.some((time) => time.startTime && time.endTime),
    );
  };

  const validateImageStep = () => {
    return Boolean(
      formValues.bannerImageUrl && formValues.subImages?.length >= 1,
    );
  };

  const isFormValid = () => {
    return (
      validateBasicStep() &&
      validateLocationStep() &&
      validateScheduleStep() &&
      validateImageStep()
    );
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (!isFormValid()) {
      return;
    }
    localStorage.removeItem('activityFormDraft');
    console.log('Submit data:', data);
  });

  const handleTempSave = () => {
    const formData = methods.getValues();
    localStorage.setItem(
      'activityFormDraft',
      JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString(),
      }),
    );

    alertModal({
      icon: 'success',
      text: '임시저장이 완료되었습니다.',
      timer: 2000,
      confirmButtonText: '확인',
    });
  };

  const getCurrentStepId = () => {
    const path = router.asPath;
    const currentPath = path.split('/').pop();
    const currentStep = steps.find((step) =>
      step.path.includes(currentPath || ''),
    );
    return currentStep?.id || 'basic';
  };

  const getStepStatus = (stepId: string) => {
    const currentStepId = getCurrentStepId();
    const currentStepIndex = steps.findIndex(
      (step) => step.id === currentStepId,
    );
    const stepIndex = steps.findIndex((step) => step.id === stepId);

    let isCompleted = false;
    switch (stepId) {
      case 'basic':
        isCompleted = validateBasicStep();
        break;
      case 'location':
        isCompleted = validateLocationStep();
        break;
      case 'schedule':
        isCompleted = validateScheduleStep();
        break;
      case 'images':
        isCompleted = validateImageStep();
        break;
    }

    if (isCompleted) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    if (stepIndex < currentStepIndex) return 'incomplete';
    return 'upcoming';
  };

  const getStepStyles = (status: string) => {
    const baseStyle =
      'group flex items-center px-3 py-4 text-md font-medium rounded-lg transition-all duration-200';

    switch (status) {
      case 'completed':
        return `${baseStyle} bg-gray-50 text-blue-DEFAULT`;
      case 'current':
        return `${baseStyle} bg-gray-50 text-yellow-DEFAULT shadow-[inset_0_2px_4px_rgba(0,0,0,0.1)]`;
      case 'incomplete':
        return `${baseStyle} bg-gray-50 text-gray-400 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]`;
      default:
        return `${baseStyle} bg-gray-50 text-gray-700 hover:bg-white hover:-translate-y-0.5 hover:shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-1px_rgba(0,0,0,0.06)]`;
    }
  };

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit}>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="grid grid-cols-12 gap-8">
              <div className="col-span-3">
                <nav className="flex flex-col gap-2">
                  {steps.map((step) => {
                    const status = getStepStatus(step.id);
                    const textColorClass =
                      status === 'completed'
                        ? 'text-blue-DEFAULT'
                        : status === 'current'
                          ? 'text-yellow-DEFAULT'
                          : 'text-gray-400';

                    return (
                      <Link
                        key={step.id}
                        href={step.path}
                        className={getStepStyles(status)}
                      >
                        <span className="mr-3">
                          <Image
                            src={step.image}
                            alt={step.title}
                            width={20}
                            height={20}
                            className={textColorClass}
                          />
                        </span>
                        <span className="flex-1">{step.title}</span>
                        {status === 'completed' && (
                          <span className="ml-3">
                            <Image
                              src="/images/number/check.png"
                              alt="완료"
                              width={16}
                              height={16}
                              className="text-blue-DEFAULT"
                            />
                          </span>
                        )}
                        {status === 'current' && (
                          <span className="ml-3">
                            <Image
                              src="/images/number/pin.png"
                              alt="작성중"
                              width={16}
                              height={16}
                              className="text-yellow-DEFAULT"
                            />
                          </span>
                        )}
                      </Link>
                    );
                  })}
                </nav>

                <div className="flex flex-col gap-1 mt-12">
                  <button
                    type="button"
                    onClick={handleTempSave}
                    className="h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md transition-colors"
                  >
                    임시저장
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`h-12 rounded-md text-gray-50 transition-colors ${
                      isFormValid()
                        ? 'bg-green-dark hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    등록하기
                  </button>
                </div>
              </div>

              <div className="col-span-9">
                <div className="bg-white shadow rounded-lg p-6">{children}</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ActivityCreateLayout;
