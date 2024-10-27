import React from 'react';
import { useFormContext } from 'react-hook-form';
import FormInput from '@/components/form/input/FormInput';
import { ExperienceFormData } from '@/types/activity/activity';
import Script from 'next/script';

declare global {
  interface Window {
    daum: any;
  }
}

const AddressSearch = () => {
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
        // 도로명 주소 우선, 없으면 지번 주소 사용
        const address = data.roadAddress || data.jibunAddress;
        setValue('address', address);
      },
      width: '100%',
      height: '100%',
    }).open();
  };

  return (
    <div>
      <Script src="//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js" />

      <div className="w-full">
        <FormInput<ExperienceFormData>
          label="주소"
          name="address"
          type="text"
          register={register}
          error={errors.address}
          placeholder="주소를 입력해주세요"
          readOnly
          onClick={handleAddressSearch}
          value={address}
        />
      </div>
    </div>
  );
};

export default AddressSearch;
