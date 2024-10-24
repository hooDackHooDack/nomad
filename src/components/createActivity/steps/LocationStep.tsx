import { useFormContext } from 'react-hook-form';
import { useRouter } from 'next/router';
import { ExperienceFormData } from '@/types/activity/activity';
import FormInput from '@/components/form/input/FormInput';

export default function BasicStep() {
  const {
    register,
    formState: { errors },
  } = useFormContext<ExperienceFormData>();
  const router = useRouter();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">주소</h1>
      <div className="space-y-4">
        <FormInput<ExperienceFormData>
          label="주소"
          name="address"
          type="text"
          register={register}
          error={errors.address}
          placeholder="주소를 입력해주세요"
        />
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
