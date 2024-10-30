import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { ActivityFormInput } from '@/types/activity/activity';
import Image from 'next/image';
import { alertModal } from '@/utils/alert/alertModal';
import { steps } from '@/components/createActivity/layout/steps';
import { createActivity } from '@/lib/api/activity';
import { useFormValidation } from '@/hooks/activity/useActivityFormValidation';

const ActivityCreateLayout = ({ children }: { children: React.ReactNode }) => {
  const methods = useForm<ActivityFormInput>({
    mode: 'onChange',
    defaultValues: {
      title: '',
      category: '',
      description: '',
      address: '',
      schedules: [{ date: '', startTime: '', endTime: '' }],
      bannerImageUrl: '',
      subImageUrls: [],
    },
  });

  const router = useRouter();
  const formValues = methods.watch();
  const { reset } = methods;
  const {
    validateBasicStep,
    validateLocationStep,
    validateScheduleStep,
    validateImageStep,
    isFormValid
  } = useFormValidation(formValues);
  
  const [alertShown, setAlertShown] = useState(false);
  const [lastSavedValues, setLastSavedValues] =
    useState<ActivityFormInput | null>(null);
  const refreshConfirmed = useRef(false);

  const hasFormChanged = () => {
    if (!lastSavedValues) return false;
    return JSON.stringify(formValues) !== JSON.stringify(lastSavedValues);
  };

  useEffect(() => {
    let reloadConfirmationShown = false;

    const handleKeyDown = async (e: KeyboardEvent) => {
      const isRefreshKeyCombo =
        (e.key === 'r' && (e.ctrlKey || e.metaKey)) || e.key === 'F5';

      if (
        isRefreshKeyCombo &&
        hasFormChanged() &&
        !refreshConfirmed.current &&
        !reloadConfirmationShown
      ) {
        e.preventDefault();
        reloadConfirmationShown = true;

        try {
          await new Promise((resolve) => {
            alertModal({
              icon: 'warning',
              title: '작성 중인 내용이 사라질 수 있습니다.',
              text: '페이지를 새로고침 하시겠습니까?',
              showCancelButton: true,
              confirmButtonText: '새로고침',
              cancelButtonText: '취소',
              confirmedFunction: () => {
                refreshConfirmed.current = true;
                resolve(true);
              },
            });
          });

          // 사용자가 확인을 누른 경우
          window.location.reload();
        } catch {
          // 사용자가 취소를 누른 경우
          reloadConfirmationShown = false;
        }
      }
    };

    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasFormChanged() && !refreshConfirmed.current) {
        e.preventDefault();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formValues, lastSavedValues]);

  useEffect(() => {
    const checkDraftData = () => {
      const draftData = localStorage.getItem('activityFormDraft');

      if (draftData && !alertShown) {
        // alertShown 상태 확인
        try {
          const { data } = JSON.parse(draftData);

          // 현재 경로가 basic인지 확인
          const currentPath = router.asPath;
          const isBasicPath = currentPath.includes('/activities/create/basic');

          if (isBasicPath) {
            alertModal({
              icon: 'info',
              text: '기존에 작성 중인 글이 존재합니다. 이어서 작성하시겠습니까?',
              showCancelButton: true,
              confirmButtonText: '이어서 작성하기',
              cancelButtonText: '임시저장 삭제하기',
              confirmedFunction: () => {
                reset(data);
                setLastSavedValues(data);
              },
              confirmedDismiss: () => {
                localStorage.removeItem('activityFormDraft');
                setLastSavedValues(null);
              },
            });
            setAlertShown(true); // 경고창을 한 번 표시한 후 상태를 업데이트
          }
        } catch (error) {
          console.error('Draft data parsing error:', error);
          localStorage.removeItem('activityFormDraft');
          setLastSavedValues(null);

          alertModal({
            icon: 'error',
            text: '임시저장된 데이터를 불러오는데 실패했습니다.',
            confirmButtonText: '확인',
          });
        }
      }
    };

    if (router.isReady) {
      checkDraftData();
    }
  }, [router.isReady, router.asPath, reset, alertShown]);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      // activity/create/* 경로 밖으로 나가는 경우에 경고창 표시
      if (hasFormChanged() && !url.startsWith('/activities/create')) {
        alertModal({
          icon: 'warning',
          title: '작성 중인 내용이 사라질 수 있습니다.',
          text: '페이지를 이동하시겠습니까?',
          showCancelButton: true,
          confirmButtonText: '이동하기',
          cancelButtonText: '취소',
          confirmedFunction: () => {
            router.events.off('routeChangeStart', handleRouteChange);
            router.push(url); // 사용자가 이동을 확인하면 페이지 이동
          },
        });
        throw 'Route change prevented'; // 페이지 이동을 일시 중지
      }
    };

    // Next.js의 routeChangeStart 이벤트 사용하여 페이지 이동 감지
    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange); // 이벤트 해제
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router, formValues, lastSavedValues]);

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
            setLastSavedValues(null);
          }
        } catch (error) {
          console.error('Draft cleanup error:', error);
          localStorage.removeItem('activityFormDraft');
          setLastSavedValues(null);
        }
      }
    };

    cleanupDraftData();
  }, []);

  const handleTempSave = () => {
    const formData = methods.getValues();
    localStorage.setItem(
      'activityFormDraft',
      JSON.stringify({
        data: formData,
        timestamp: new Date().toISOString(),
      }),
    );
    setLastSavedValues(formData);

    alertModal({
      icon: 'success',
      text: '임시저장이 완료되었습니다.',
      timer: 2000,
      confirmButtonText: '확인',
    });
  };

  const handleSubmit = methods.handleSubmit(async (data) => {
    if (!isFormValid()) {
      return;
    }

    try {
      refreshConfirmed.current = true;
      console.log('Submit data:', data);
      console.log(typeof data.price);
      await createActivity(data);

      localStorage.removeItem('activityFormDraft');
      setLastSavedValues(null);

      alertModal({
        icon: 'success',
        title: '액티비티가 성공적으로 등록되었습니다.',
        text: '액티비티 목록 페이지로 이동합니다.',
        confirmButtonText: '확인',
        confirmedFunction: () => {
          router.push('/activities');
        },
      });
      console.log('Submit data:', data);
    } catch (error) {
      console.error('Form submit error:', error);
      alertModal({
        icon: 'error',
        title: '액티비티 등록 실패',
        text: '액티비티 등록 중 오류가 발생했습니다.',
        confirmButtonText: '확인',
      });
    }
  });

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
                    className="h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md border-none transition-colors"
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
