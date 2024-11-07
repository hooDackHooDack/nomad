import { useRouter } from 'next/router';
import { useEffect, useRef, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import Link from 'next/link';
import { ActivityDetail, ActivityFormInput } from '@/types/activity/activity';
import Image from 'next/image';
import { alertModal } from '@/utils/alert/alertModal';
import { steps } from '@/components/createActivity/layout/steps';
import { createActivity, updateActivity } from '@/lib/api/activity';
import { useFormValidation } from '@/hooks/activity/useActivityFormValidation';
import { useActivityFormDiff } from '@/hooks/activity/useActivityFormDiff';
import { useRequireAuth } from '@/hooks/auth/useRequireAuth';

interface LayoutProps {
  children: React.ReactNode;
  mode: 'create' | 'edit';
  activityId?: string;
  initialValues: ActivityFormInput;
  originalActivity?: ActivityDetail;
}

const ActivityCreateLayout = ({
  children,
  mode,
  activityId,
  initialValues,
  originalActivity,
}: LayoutProps) => {
  const methods = useForm<ActivityFormInput>({
    mode: 'onChange',
    defaultValues: initialValues,
  });

  const { user, isLoading } = useRequireAuth();
  const router = useRouter();
  const formValues = methods.watch();
  const formDiff = useActivityFormDiff(originalActivity, formValues);

  const { reset } = methods;
  const {
    validateBasicStep,
    validateLocationStep,
    validateScheduleStep,
    validateImageStep,
    isFormValid,
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

  const handleFormSubmit = async (data: ActivityFormInput) => {
    if (!isFormValid()) {
      return;
    }

    try {
      refreshConfirmed.current = true;

      if (mode === 'edit' && activityId) {
        await updateActivity(activityId, data, formDiff);
        alertModal({
          icon: 'success',
          title: '액티비티가 성공적으로 수정되었습니다.',
          text: '액티비티 상세 페이지로 이동합니다.',
          confirmButtonText: '확인',
          confirmedFunction: () => {
            router.push(`/activities/${activityId}`);
          },
        });
      } else {
        const response = await createActivity(data);
        console.log('Activity created:', response);
        alertModal({
          icon: 'success',
          title: '액티비티가 성공적으로 등록되었습니다.',
          text: '액티비티 목록 페이지로 이동합니다.',
          confirmButtonText: '확인',
          confirmedFunction: () => {
            router.push('/activities');
          },
        });
      }

      localStorage.removeItem('activityFormDraft');
      setLastSavedValues(null);
    } catch (error) {
      console.error('Form submit error:', error);
      alertModal({
        icon: 'error',
        title: `액티비티 ${mode === 'edit' ? '수정' : '등록'} 실패`,
        text: `액티비티 ${mode === 'edit' ? '수정' : '등록'} 중 오류가 발생했습니다.`,
        confirmButtonText: '확인',
      });
    }
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

  if (isLoading || !user) {
    return null;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(handleFormSubmit)}>
        <div className="min-h-screen bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* 모바일 상단 스텝 네비게이션 */}
            <nav className="sm:flex sm:items-center sm:justify-center sm:gap-2 sm:mb-6 md:hidden lg:hidden relative">
              {steps.map((step, index) => {
                const status = getStepStatus(step.id);
                const isLast = index === steps.length - 1;

                return (
                  <div key={step.id} className="flex items-center">
                    <Link
                      href={`/activities/${mode}/${step.path}${
                        mode === 'edit' ? `?id=${activityId}` : ''
                      }`}
                      className="relative"
                    >
                      <div
                        className={`
                        rounded-full p-1
                        ${
                          status === 'current'
                            ? 'border-2 border-green-dark'
                            : 'border-none'
                        }
                      `}
                      >
                        <Image
                          src={step.image}
                          alt={step.title}
                          width={28}
                          height={28}
                          className={
                            status === 'completed'
                              ? 'text-blue-DEFAULT'
                              : status === 'current'
                                ? 'text-yellow-DEFAULT'
                                : 'text-gray-400'
                          }
                        />
                      </div>
                      {status === 'completed' && (
                        <div className="absolute -bottom-1 -right-1">
                          <Image
                            src="/images/number/check.png"
                            alt="완료"
                            width={12}
                            height={12}
                          />
                        </div>
                      )}
                    </Link>

                    {/* 연결 점들 */}
                    {!isLast && (
                      <div className="flex items-center mx-1">
                        <div className="w-1 h-1 rounded-full bg-gray-300 mx-0.5"></div>
                        <div className="w-1 h-1 rounded-full bg-gray-300 mx-0.5"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            <div className="grid grid-cols-12 gap-8">
              {/* 데스크톱 사이드 네비게이션 */}
              <div className="col-span-3 sm:hidden">
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
                        href={`/activities/${mode}/${step.path}${
                          mode === 'edit' ? `?id=${activityId}` : ''
                        }`}
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

              {/* 모바일 버튼 */}
              <div className="sm:fixed sm:bottom-0 sm:left-0 sm:right-0 sm:p-4 sm:bg-white sm:shadow-lg sm:z-10 md:hidden lg:hidden">
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={handleTempSave}
                    className="flex-1 h-12 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-md border-none transition-colors"
                  >
                    임시저장
                  </button>
                  <button
                    type="submit"
                    disabled={!isFormValid()}
                    className={`flex-1 h-12 rounded-md text-gray-50 transition-colors ${
                      isFormValid()
                        ? 'bg-green-dark hover:bg-green-700'
                        : 'bg-gray-400 cursor-not-allowed'
                    }`}
                  >
                    등록하기
                  </button>
                </div>
              </div>

              {/* 컨텐츠 영역 */}
              <div className="col-span-9 sm:col-span-12 sm:mb-20">
                <div className="bg-white shadow rounded-lg p-6 sm:p-4 sm:shadow-none">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default ActivityCreateLayout;
