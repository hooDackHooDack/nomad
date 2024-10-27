import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/form/input/FormInput';
import { ExperienceFormData } from '@/types/activity/activity';

declare global {
  interface Window {
    daum: any;
  }
}

interface AddressSearchProps {
  onAddressChange?: (address: string) => void;
}

const AddressSearch = ({ onAddressChange }: AddressSearchProps) => {
  const {
    register,
    setValue,
    formState: { errors },
    watch,
  } = useFormContext<ExperienceFormData>();

  const address = watch('address');

  const handleAddressSearch = () => {
    if (!window.daum) {
      console.error('Daum script not loaded');
      return;
    }

    new window.daum.Postcode({
      oncomplete: function (data: any) {
        const address = data.roadAddress || data.jibunAddress;
        setValue('address', address);
        onAddressChange?.(address); // 부모 컴포넌트에 주소 변경 알림
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  return (
    <div>
      <div className="w-full mt-4">
        <FormInput<ExperienceFormData>
          label="주소"
          name="address"
          type="text"
          register={register}
          error={errors.address}
          placeholder="도로명 주소를 입력해 주세요"
          readOnly
          onClick={handleAddressSearch}
          value={address}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
