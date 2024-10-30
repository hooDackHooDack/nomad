import { useFormContext } from 'react-hook-form';
import { ActivityFormInput } from '@/types/activity/activity';
import FormInput from '@/components/form/input/FormInput';
import RadioGroupInput from '@/components/form/input/radioGroup/RadioInput';
import FormEditor from '@/components/form/editor/FormEditor';

const categoryOptions = [
  { value: '문화 · 예술', label: '문화 · 예술' },
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
  } = useFormContext<ActivityFormInput>();

  const description = watch('description');

  const handleEditorChange = (content: string) => {
    setValue('description', content); // HTML 형태로 저장
  };

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">기본 정보</h1>
      <div className="space-y-4">
        <FormInput<ActivityFormInput>
          label="제목"
          name="title"
          type="text"
          register={register}
          error={errors.title}
          placeholder="제목을 입력해주세요"
        />

        <RadioGroupInput<ActivityFormInput>
          label="카테고리"
          name="category"
          register={register}
          options={categoryOptions}
          error={errors.category}
          validationRule={{ required: '카테고리를 선택해주세요' }}
        />

        <FormInput<ActivityFormInput>
          label="가격"
          name="price"
          type="number"
          register={register}
          error={errors.price}
          placeholder="0"
          validationRule={{ required: '가격을 입력해주세요' }}
        />

        <FormEditor
          value={description || ''}
          onChange={handleEditorChange}
          error={errors.description}
        />
      </div>
    </div>
  );
}
