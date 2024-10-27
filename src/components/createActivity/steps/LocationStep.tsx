import React from 'react';
import AddressSearch from '@/components/form/input/AddressInput';
import KakaoMap from '@/components/kakaoMap/KakaoMap';
import { useState } from 'react';

export default function LocationStep() {
  const [currentAddress, setCurrentAddress] = useState<string>();

  const handleAddressChange = (address: string) => {
    setCurrentAddress(address);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">체험 주소</h1>
      <div className="flex flex-col gap-4">
        <AddressSearch onAddressChange={handleAddressChange} />
        <KakaoMap address={currentAddress} />
      </div>

      <div className="flex justify-end mt-6" />
    </div>
  );
}
