/* eslint-disable @next/next/no-img-element */
import { useEffect, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Camera } from 'lucide-react';
import FormInput from '@/components/form/input/FormInput';
import { useAuth } from '@/hooks/auth/useAuth';
import { alertModal } from '@/utils/alert/alertModal';
import { uploadImage } from '@/lib/api/user';
import { ProfileFormData } from '@/types/user/userInfo';
import MyPageLayout from '@/components/mypage/MypageLayout';

const MyInfoPage = () => {
  const { user, isLoading, updateUser, isUpdateLoading } = useAuth();
  const [profileImage, setProfileImage] = useState('');

  useEffect(() => {
    if (user?.profileImageUrl) {
      setProfileImage(user.profileImageUrl);
    }
  }, [user]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setValue,
  } = useForm<ProfileFormData>({
    defaultValues: {
      nickname: user?.nickname,
      email: user?.email,
      profileImageUrl: user?.profileImageUrl || '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const watchNewPassword = watch('newPassword');
  const watchNickname = watch('nickname');
  const watchProfileImageUrl = watch('profileImageUrl');

  const onSubmit: SubmitHandler<ProfileFormData> = async () => {
    if (user)
      try {
        await updateUser({
          nickname: watchNickname || user.nickname,
          profileImageUrl: watchProfileImageUrl || user.profileImageUrl,
          newPassword: watchNewPassword,
        });
        alertModal({
          icon: 'success',
          text: '정보가 성공적으로 업데이트되었습니다.',
          confirmButtonText: '확인',
        });
      } catch (error) {
        console.error('Failed to update profile:', error);
        alertModal({
          icon: 'error',
          text: '정보 업데이트 중 오류가 발생했습니다.',
          confirmButtonText: '확인',
        });
      }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue('profileImageUrl', reader.result as string, {
            shouldDirty: true,
          });
        };
        reader.readAsDataURL(file);

        const imageUrl = await uploadImage(file);
        setProfileImage(imageUrl);
        setValue('profileImageUrl', imageUrl, { shouldDirty: true });
      } catch (error) {
        console.error('Image upload failed:', error);
        alertModal({
          text: '프로필 이미지 업로드에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <MyPageLayout>
      <div className="">
        <div className="hidden lg:flex md:flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">내 정보</h1>
          <button
            type="submit"
            className="bg-green-dark text-white px-8 py-2 rounded-lg hover:bg-green-darker transition-colors"
            onClick={handleSubmit(onSubmit)}
            disabled={isUpdateLoading}
          >
            저장하기
          </button>
        </div>
        <form
          noValidate
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-6"
        >
          <div className="mb-8 flex flex-col items-center">
            <div className="relative w-32 h-32 mb-4">
              {profileImage ? (
                <img
                  src={profileImage}
                  alt="Profile"
                  className="rounded-full w-full h-full object-cover"
                />
              ) : (
                <div className="w-32 h-32 bg-gray-200 rounded-full"></div>
              )}
              <label
                htmlFor="profile-upload"
                className="absolute bottom-0 right-0 bg-green-dark p-2 rounded-full cursor-pointer"
              >
                <Camera className="w-5 h-5 text-white" />
              </label>
              <input
                id="profile-upload"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
            </div>
          </div>

          <div className="space-y-6">
            <FormInput<ProfileFormData>
              label="닉네임"
              name="nickname"
              type="text"
              register={register}
              error={errors.nickname}
              defaultValue={user?.nickname || ''}
              validationRule={{
                required: '닉네임을 입력해주세요',
                maxLength: {
                  value: 10,
                  message: '닉네임은 10자 이내여야 합니다',
                },
              }}
            />
            <FormInput<ProfileFormData>
              label="이메일"
              name="email"
              type="email"
              register={register}
              error={errors.email}
              readOnly
              defaultValue={user?.email || ''}
            />
            <FormInput<ProfileFormData>
              label="새 비밀번호"
              name="newPassword"
              type="password"
              register={register}
              error={errors.newPassword}
              validationRule={{
                required: '새 비밀번호를 입력해주세요',
                minLength: {
                  value: 8,
                  message: '비밀번호는 8자 이상이어야 합니다',
                },
              }}
            />
            <FormInput<ProfileFormData>
              label="비밀번호 확인"
              name="confirmPassword"
              type="password"
              register={register}
              error={errors.confirmPassword}
              validationRule={{
                required: '비밀번호 확인을 입력해주세요',
                validate: (value) =>
                  value === watchNewPassword || '비밀번호가 일치하지 않습니다.',
              }}
            />
          </div>

          <div className="lg:hidden md:hidden mt-8">
            <button
              type="submit"
              className="w-full bg-green-dark text-white py-3 rounded-lg hover:bg-green-darker transition-colors"
              onClick={handleSubmit(onSubmit)}
              disabled={isUpdateLoading}
            >
              저장하기
            </button>
          </div>
        </form>
      </div>
    </MyPageLayout>
  );
};

export default MyInfoPage;
