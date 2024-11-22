/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/router';
import { ActivityFormInput } from '@/types/activity/activity';
import { alertModal } from '@/utils/alert/alertModal';
import { UseFormReset } from 'react-hook-form';
import { DRAFT_ALERT_MESSAGES } from '@/components/constants/alert/activityDraft';

interface DraftStorage {
  data: ActivityFormInput;
  timestamp: string;
}

interface UseActivityDraftProps {
  formValues: ActivityFormInput;
  reset: UseFormReset<ActivityFormInput>;
}

export const useActivityDraft = ({
  formValues,
  reset,
}: UseActivityDraftProps) => {
  const router = useRouter();
  const [alertShown, setAlertShown] = useState(false);
  const [lastSavedValues, setLastSavedValues] =
    useState<ActivityFormInput | null>(null);
  const refreshConfirmed = useRef(false);

  const hasFormChanged = () => {
    if (!lastSavedValues) return false;
    return JSON.stringify(formValues) !== JSON.stringify(lastSavedValues);
  };

  // 임시저장 처리
  const handleTempSave = () => {
    const draftData: DraftStorage = {
      data: formValues,
      timestamp: new Date().toISOString(),
    };

    localStorage.setItem('activityFormDraft', JSON.stringify(draftData));
    setLastSavedValues(formValues);
    alertModal(DRAFT_ALERT_MESSAGES.TEMP_SAVE.SUCCESS);
  };

  // 임시저장 데이터 정리
  const cleanupDraftData = () => {
    localStorage.removeItem('activityFormDraft');
    setLastSavedValues(null);
  };

  // 24시간 지난 임시저장 데이터 자동 삭제
  useEffect(() => {
    const checkExpiredDraft = () => {
      const draftData = localStorage.getItem('activityFormDraft');

      if (draftData) {
        try {
          const { timestamp } = JSON.parse(draftData) as DraftStorage;
          const savedTime = new Date(timestamp).getTime();
          const currentTime = new Date().getTime();
          const hoursDiff = (currentTime - savedTime) / (1000 * 60 * 60);

          if (hoursDiff >= 24) {
            cleanupDraftData();
          }
        } catch (error) {
          console.error('Draft cleanup error:', error);
          cleanupDraftData();
        }
      }
    };

    checkExpiredDraft();
  }, []);

  // 새로고침 방지
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
              ...DRAFT_ALERT_MESSAGES.NAVIGATION.REFRESH,
              confirmedFunction: () => {
                refreshConfirmed.current = true;
                resolve(true);
              },
            });
          });

          window.location.reload();
        } catch {
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
  }, [formValues, lastSavedValues]);

  // 임시저장 데이터 복구
  useEffect(() => {
    const checkDraftData = () => {
      const draftData = localStorage.getItem('activityFormDraft');

      if (draftData && !alertShown) {
        try {
          const { data } = JSON.parse(draftData) as DraftStorage;
          const currentPath = router.asPath;
          const isBasicPath = currentPath.includes('/activities/create/basic');

          if (isBasicPath) {
            alertModal({
              ...DRAFT_ALERT_MESSAGES.DRAFT_RECOVERY.CONFIRM,
              confirmedFunction: () => {
                reset(data);
                setLastSavedValues(data);
              },
              confirmedDismiss: () => {
                cleanupDraftData();
              },
            });
            setAlertShown(true);
          }
        } catch (error) {
          console.error('Draft data parsing error:', error);
          cleanupDraftData();
          alertModal(DRAFT_ALERT_MESSAGES.DRAFT_RECOVERY.ERROR);
        }
      }
    };

    if (router.isReady) {
      checkDraftData();
    }
  }, [router.isReady, router.asPath, reset, alertShown]);

  // 페이지 이동 방지
  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (hasFormChanged() && !url.startsWith('/activities/create')) {
        alertModal({
          ...DRAFT_ALERT_MESSAGES.NAVIGATION.LEAVE,
          confirmedFunction: () => {
            router.events.off('routeChangeStart', handleRouteChange);
            router.push(url);
          },
        });
        throw 'Route change prevented';
      }
    };

    router.events.on('routeChangeStart', handleRouteChange);

    return () => {
      router.events.off('routeChangeStart', handleRouteChange);
    };
  }, [router, formValues, lastSavedValues]);

  return {
    handleTempSave,
    cleanupDraftData,
    hasFormChanged,
    lastSavedValues,
    refreshConfirmed,
  };
};
