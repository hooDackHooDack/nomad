/* eslint-disable @next/next/no-img-element */
import { useFormContext } from 'react-hook-form';
import { PlusIcon, XIcon } from 'lucide-react';
import { ActivityFormInput } from '@/types/activity/activity';
import authApi from '@/lib/axios/auth';
import { alertModal } from '@/utils/alert/alertModal';

interface ImageUploadResponse {
  activityImageUrl: string;
}

const ImageUploadStep = () => {
  const { setValue, watch, register } = useFormContext<ActivityFormInput>();

  // register로 폼 필드 등록
  register('bannerImageUrl');
  register('subImageUrls');

  const bannerImageUrl = watch('bannerImageUrl');
  const subImageUrls = watch('subImageUrls') || [];

  const uploadImage = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const { data } = await authApi.post<ImageUploadResponse>(
        `/activities/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        },
      );

      return data.activityImageUrl;
    } catch (error) {
      console.error('Image upload error:', error);
      throw error;
    }
  };

  const handleBannerUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          setValue('bannerImageUrl', reader.result as string, {
            shouldDirty: true,
          });
        };
        reader.readAsDataURL(file);

        const imageUrl = await uploadImage(file);
        setValue('bannerImageUrl', imageUrl, { shouldDirty: true });
      } catch (error) {
        console.error('Banner image upload error:', error);
        alertModal({
          text: '배너 이미지 업로드에 실패했습니다.',
          icon: 'error',
          confirmButtonText: '확인',
          timer: 2400,
        });
      }
    }
  };

  const handleSubImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - subImageUrls.length;
    const filesToUpload = files.slice(0, remainingSlots);

    try {
      const uploadPromises = filesToUpload.map(async (file) => {
        // 프리뷰 생성
        const previewPromise = new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result as string);
          reader.readAsDataURL(file);
        });

        // 이미지 업로드
        const imageUrl = await uploadImage(file);
        const preview = await previewPromise;

        return { imageUrl, preview };
      });

      const results = await Promise.all(uploadPromises);

      // 기존 이미지와 프리뷰 배열에 새로운 항목 추가
      const newSubImageUrls = [
        ...subImageUrls,
        ...results.map((r) => r.imageUrl),
      ];

      setValue('subImageUrls', newSubImageUrls, { shouldDirty: true });
    } catch (error) {
      console.error('Sub image upload error:', error);
      alertModal({
        text: '소개 이미지 업로드에 실패했습니다.',
        icon: 'error',
        confirmButtonText: '확인',
        timer: 2400,
      });
    }
  };

  const removeBannerImage = () => {
    setValue('bannerImageUrl', '', { shouldDirty: true });
  };

  const removeSubImage = (index: number) => {
    const newSubImageUrls = [...subImageUrls];
    newSubImageUrls.splice(index, 1);
    setValue('subImageUrls', newSubImageUrls, { shouldDirty: true });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">이미지</h2>

      {/* Banner Image Section */}
      <div className="space-y-2">
        <p className="text-lg font-regular text-black">배너 이미지</p>
        <div className="relative">
          <label className="block">
            {!bannerImageUrl ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-28 cursor-pointer hover:border-gray-400 transition-colors">
                <div className="flex flex-col items-center">
                  <PlusIcon className="w-8 h-8 text-gray-400" />
                  <span className="mt-2 text-sm text-gray-500">
                    이미지 등록
                  </span>
                </div>
              </div>
            ) : (
              <div className="relative">
                <img
                  src={bannerImageUrl}
                  alt="Banner preview"
                  className="w-full h-72 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeBannerImage();
                  }}
                  className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                >
                  <XIcon className="w-4 h-4 text-white" />
                </button>
              </div>
            )}
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleBannerUpload}
            />
          </label>
        </div>
      </div>

      {/* Sub Images Section */}
      <div className="space-y-2">
        <p className="text-lg font-regular text-black">소개 이미지</p>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <label key={index} className="block">
              {subImageUrls[index] ? (
                <div className="relative">
                  <img
                    src={subImageUrls[index]}
                    alt={`Sub image ${index + 1}`}
                    className="w-full h-72 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      removeSubImage(index);
                    }}
                    className="absolute top-2 right-2 p-1 bg-black bg-opacity-50 rounded-full hover:bg-opacity-70"
                  >
                    <XIcon className="w-4 h-4 text-white" />
                  </button>
                </div>
              ) : (
                <div className="w-full h-72 flex flex-col justify-center items-center border-2 border-dashed border-gray-300 rounded-lg p-12 cursor-pointer hover:border-gray-400 transition-colors">
                  <PlusIcon className="w-12 h-12 text-gray-400" />
                  <span className="mt-4 text-sm text-gray-500">
                    이미지 등록
                  </span>
                </div>
              )}
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleSubImagesUpload}
                disabled={subImageUrls.length >= 4}
              />
            </label>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        *이미지는 최대 4개까지 등록 가능합니다.
      </p>
    </div>
  );
};

export default ImageUploadStep;
