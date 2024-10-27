import AddressSearch from '@/components/kakao/AddressSearch';

export default function LocationStep() {
  return (
    <>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">주소</h1>
        <div className="space-y-4">
          <div className="flex space-x-2">
            <AddressSearch />
          </div>
        </div>

        <div className="flex justify-end mt-6"></div>
      </div>
    </>
  );
}
