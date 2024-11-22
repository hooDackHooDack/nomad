import { useRouter } from 'next/router';
import { FormProvider, useForm } from 'react-hook-form';
import { ActivityDetail, ActivityFormInput } from '@/types/activity/activity';
import { alertModal } from '@/utils/alert/alertModal';
import { steps } from '@/components/createActivity/layout/steps';
import { createActivity, updateActivity } from '@/lib/api/activity';
import { useFormValidation } from '@/hooks/activity/useActivityFormValidation';
import { useActivityFormDiff } from '@/hooks/activity/useActivityFormDiff';
import { useRequireAuth } from '@/hooks/auth/useRequireAuth';
import { useActivityDraft } from '@/hooks/activity/useActivityDraft';
import { MobileStepNavigation } from '@/components/createActivity/navigation/MobileStepNav';
import { DesktopStepNavigation } from '@/components/createActivity/navigation/DesktopStepNav';
import { ACTIVITY_ALERT_MESSAGES } from '@/components/constants/alert/activityCreate';

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

  const {
    validateBasicStep,
    validateLocationStep,
    validateScheduleStep,
    validateImageStep,
    isFormValid,
  } = useFormValidation(formValues);

  const { handleTempSave, cleanupDraftData, refreshConfirmed } =
    useActivityDraft({
      formValues,
      reset: methods.reset,
    });

  const handleFormSubmit = async (data: ActivityFormInput) => {
    if (!isFormValid()) {
      return;
    }

    try {
      refreshConfirmed.current = true;

      if (mode === 'edit' && activityId) {
        await updateActivity(activityId, data, formDiff);
        alertModal({
          ...ACTIVITY_ALERT_MESSAGES.EDIT.SUCCESS,
          confirmedFunction: () => {
            router.push(`/activities/${activityId}`);
          },
        });
      } else {
        const response = await createActivity(data);
        console.log('Activity created:', response);
        alertModal({
          ...ACTIVITY_ALERT_MESSAGES.CREATE.SUCCESS,
          confirmedFunction: () => {
            router.push('/activities');
          },
        });
      }

      cleanupDraftData();
    } catch (error) {
      console.error('Form submit error:', error);
      alertModal(
        mode === 'edit'
          ? ACTIVITY_ALERT_MESSAGES.EDIT.ERROR
          : ACTIVITY_ALERT_MESSAGES.CREATE.ERROR,
      );
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
            {/* Mobile */}
            <MobileStepNavigation
              steps={steps}
              mode={mode}
              activityId={activityId}
              getStepStatus={getStepStatus}
            />

            <div className="grid grid-cols-12 gap-8">
              {/* Desktop */}
              <div className="col-span-3 sm:hidden">
                <DesktopStepNavigation
                  steps={steps}
                  mode={mode}
                  activityId={activityId}
                  getStepStatus={getStepStatus}
                  getStepStyles={getStepStyles}
                />

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
