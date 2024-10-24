import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ExperienceFormData } from '@/types/activity/activity';
import FormInput from '@/components/form/input/FormInput';
import RadioGroupInput from '@/components/form/radioGroup/radioGroupInput';
import FormEditor from '@/components/form/editor/FormEditor';

const categoryOptions = [
  { value: '문화·예술', label: '문화·예술' },
  { value: '식음료', label: '식음료' },
  { value: '스포츠', label: '스포츠' },
  { value: '투어', label: '투어' },
  { value: '관광', label: '관광' },
  { value: '웰빙', label: '웰빙' },
];

export default function BasicStep() {
  const {
    register,
    formState: { errors },
    setValue,
    watch,
  } = useFormContext<ExperienceFormData>();

  const router = useRouter();
  const description = watch('description');

  const handleEditorChange = (content: string) => {
    setValue('description', content); // HTML 형태로 저장
  };

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

        <RadioGroupInput<ExperienceFormData>
          label="카테고리"
          name="category"
          register={register}
          options={categoryOptions}
          error={errors.category}
          validationRule={{ required: '카테고리를 선택해주세요' }}
        />

        <FormEditor
          value={description || ''} // null/undefined 처리
          onChange={handleEditorChange}
          error={errors.description}
        />
      </div>

      <div className="flex justify-end mt-6">
        <button
          type="button" // 버튼 타입 추가
          onClick={() => router.push('/activity/create/images')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          다음
        </button>
      </div>
    </div>
  );
}
