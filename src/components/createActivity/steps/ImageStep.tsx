import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ExperienceFormData } from '@/types/activity/activity';
import { useState } from 'react';

export default function ImagesStep() {
  const { register } = useFormContext<ExperienceFormData>();
  const router = useRouter();
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // 이미지 미리보기 처리
  const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setBannerPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">이미지</h1>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">
            배너 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            {...register('bannerImage', {
              onChange: handleBannerChange
            })}
            className="mt-1 block w-full"
          />
          {bannerPreview && (
            <div className="mt-2">
              <img 
                src={bannerPreview} 
                alt="Banner preview" 
                className="max-h-48 rounded-lg"
              />
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">
            추가 이미지
          </label>
          <input
            type="file"
            accept="image/*"
            multiple
            {...register('subImages')}
            className="mt-1 block w-full"
          />
        </div>
      </div>

      <div className="flex justify-between mt-6">
        <button
          onClick={() => router.push('/activity/create/basic')}
          className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
        >
          이전
        </button>
        <button
          onClick={() => router.push('/activity/create/schedule')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}
