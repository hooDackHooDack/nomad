import MyActivityCard from '@/components/mypage/MyActivityCard';
import MyPageLayout from '@/components/mypage/MypageLayout';
import { deleteMyActivity, fetchMyActivities } from '@/lib/api/activity';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { alertModal } from '@/utils/alert/alertModal';
import { ACTIVITY_ALERT_MESSAGES } from '@/components/constants/alert/activityCreate';

const MyActivitiesPage = () => {
  const queryClient = useQueryClient();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['myActivities'],
    queryFn: fetchMyActivities,
  });
  const activities = data?.data?.activities ?? [];

  const deleteMutation = useMutation({
    mutationFn: (activityId: number) => deleteMyActivity(activityId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['myActivities'] });
      alertModal(ACTIVITY_ALERT_MESSAGES.DELETE.SUCCESS);
    },
    onError: (error) => {
      alertModal(ACTIVITY_ALERT_MESSAGES.DELETE.ERROR);
      console.log(error);
    },
  });

  const handleDelete = (activityId: number) => {
    alertModal({
      ...ACTIVITY_ALERT_MESSAGES.DELETE.CONFIRM,
      confirmedFunction: () => deleteMutation.mutate(activityId),
    });
  };

  if (isLoading) {
    return <div className="text-center py-10">Loading...</div>;
  }

  if (isError) {
    return (
      <div className="text-center py-10 text-red-500">
        Error: {error?.message}
      </div>
    );
  }

  return (
    <MyPageLayout>
      <h1 className="text-3xl font-bold mb-6 sm:hidden">내 체험 관리</h1>
      <div className="space-y-4">
        {activities.length > 0 ? (
          activities.map((activity) => (
            <MyActivityCard
              key={activity.id}
              activity={activity}
              onDelete={handleDelete}
            />
          ))
        ) : (
          <p className="text-gray-600">체험 내역이 없습니다.</p>
        )}
      </div>
    </MyPageLayout>
  );
};

export default MyActivitiesPage;
