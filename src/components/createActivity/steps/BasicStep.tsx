import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ExperienceFormData } from '@/types/activity/activity';
import FormInput from '@/components/form/input/FormInput';

export default function BasicStep() {
  const { register, formState: { errors } } = useFormContext<ExperienceFormData>();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">기본 정보</h1>
      <div className="space-y-4">
        <FormInput<ExperienceFormData>
          label="제목"
          name="title"
          type="text"
          register={register}
          error={errors.title}
          placeholder="제목을 입력해주세요"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700">
            카테고리
          </label>
          <select
            {...register('category')}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="">카테고리 선택</option>
            <option value="문화 · 예술">문화 · 예술</option>
            <option value="식음료">식음료</option>
            <option value="스포츠">스포츠</option>
            <option value="투어">투어</option>
            <option value="관광">관광</option>
            <option value="웰빙">웰빙</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">설명</label>
          <textarea
            {...register('description')}
            rows={4}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            placeholder="체험에 대한 설명을 입력해주세요"
          />
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={() => router.push('/activity/create/images')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}