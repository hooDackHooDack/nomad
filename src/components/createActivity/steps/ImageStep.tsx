import { useFormContext } from 'react-hook-form';
import { PlusIcon, XIcon } from 'lucide-react';
import { ExperienceFormData } from '@/types/activity/activity';
import authApi from '@/lib/axios/auth';
import Link from 'next/link';

interface ImageUploadResponse {
  activityImageUrl: string;
}

const ImageUploadComponent = () => {
  const { setValue, watch, register } = useFormContext<ExperienceFormData>();

  // register로 폼 필드 등록
  register('bannerImageUrl');
  register('subImages');

  // const bannerImageUrl = watch('bannerImageUrl');
  const bannerPreview = watch('bannerPreview');
  const subImages = watch('subImages') || [];
  const subPreviews = watch('subPreviews') || [];

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
          setValue('bannerPreview', reader.result as string, {
            shouldDirty: true,
          });
        };
        reader.readAsDataURL(file);

        const imageUrl = await uploadImage(file);
        setValue('bannerImageUrl', imageUrl, { shouldDirty: true });
      } catch (error) {
        console.error('Banner upload error:', error);
      }
    }
  };

  const handleSubImagesUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = Array.from(e.target.files || []);
    const remainingSlots = 4 - subImages.length;
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
      const newSubImages = [...subImages, ...results.map((r) => r.imageUrl)];
      const newSubPreviews = [...subPreviews, ...results.map((r) => r.preview)];

      setValue('subImages', newSubImages, { shouldDirty: true });
      setValue('subPreviews', newSubPreviews, { shouldDirty: true });
    } catch (error) {
      console.error('Sub images upload error:', error);
    }
  };

  const removeBannerImage = () => {
    setValue('bannerImageUrl', '', { shouldDirty: true });
    setValue('bannerPreview', '', { shouldDirty: true });
  };

  const removeSubImage = (index: number) => {
    const newSubImages = [...subImages];
    newSubImages.splice(index, 1);
    setValue('subImages', newSubImages, { shouldDirty: true });

    const newPreviews = [...subPreviews];
    newPreviews.splice(index, 1);
    setValue('subPreviews', newPreviews, { shouldDirty: true });
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h2 className="text-lg font-bold">이미지</h2>

      {/* Banner Image Section */}
      <div className="space-y-2">
        <p className="text-sm font-medium">배너 이미지</p>
        <div className="relative">
          <label className="block">
            {!bannerPreview ? (
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
                  src={bannerPreview}
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
        <p className="text-sm font-medium">소개 이미지</p>
        <div className="grid grid-cols-2 gap-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <label key={index} className="block">
              {subPreviews[index] ? (
                <div className="relative">
                  <img
                    src={subPreviews[index]}
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
                disabled={subImages.length >= 4}
              />
            </label>
          ))}
        </div>
      </div>

      <p className="text-sm text-gray-500">
        *이미지는 최대 4개까지 등록 가능합니다.
      </p>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-6">
        <Link
          href="/activity/create/schedule"
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          이전
        </Link>
      </div>
    </div>
  );
};

export default ImageUploadComponent;
