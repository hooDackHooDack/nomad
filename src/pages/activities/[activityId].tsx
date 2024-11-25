import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useQuery } from '@tanstack/react-query';
import basicApi from '@/lib/axios/basic';
import { Activity } from '@/types/activity/activity';
import KakaoMap from '@/components/kakaoMap/KakaoMap';
import LocationIcon from '/public/icons/button/Location.svg';
import Image from 'next/image';
import ActivityReservation from '@/components/booking/ActivityReservation';
import { ReviewSection } from '@/components/review/ReviewSection';
import TipTapContentRenderer from '@/components/tiptap/TipTapContentRenderer';

const fetchActivityDetail = async (activityId: string) => {
  const { data } = await basicApi.get<Activity>(`activities/${activityId}`);
  console.log(data.id);
  return data;
};

const ActivityDetailPage = () => {
  const router = useRouter();
  const { activityId } = router.query;
  const [selectedImage, setSelectedImage] = useState<string>('');
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  const { data: activity, isLoading } = useQuery<Activity, Error>({
    queryKey: ['activityItem', activityId],
    queryFn: () => fetchActivityDetail(activityId as string),
    enabled: !!activityId,
  });

  useEffect(() => {
    if (activity?.bannerImageUrl) {
      setSelectedImage(activity.bannerImageUrl);
      setIsImageLoaded(true);
    }
  }, [activity]);

  if (isLoading) return null;

  if (!activity) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-2xl">Activity not found</div>
      </div>
    );
  }

  // 모든 이미지 배열 생성
  const allImages = [
    activity.bannerImageUrl,
    ...activity.subImages.slice(0, 4).map((img) => img.imageUrl),
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        {/* 이미지 갤러리 */}
        <div className="relative mb-8">
          {/* 메인 이미지 */}
          <div className="relative aspect-[16/9] md:aspect-[16/8] rounded-xl overflow-hidden">
            {isImageLoaded && selectedImage && (
              <Image
                src={selectedImage}
                alt={activity?.title || 'Activity image'}
                fill
                priority={selectedImage === activity?.bannerImageUrl}
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                quality={75}
                onError={() => setIsImageLoaded(false)}
              />
            )}

            {/* 썸네일 그리드 */}
            {isImageLoaded && (
              <div className="absolute bottom-4 right-4 flex gap-2 z-10">
                {allImages.map(
                  (image, index) =>
                    image && (
                      <div
                        key={index}
                        onClick={() => setSelectedImage(image)}
                        className={`
                      w-12 h-12 md:w-16 md:h-16 rounded-lg overflow-hidden cursor-pointer
                      transition-all duration-200 hover:opacity-90
                      ${selectedImage === image ? 'ring-2 ring-white' : 'ring-1 ring-white/50'}
                      ${selectedImage === image ? 'opacity-100' : 'opacity-70'}
                    `}
                      >
                        <div className="relative w-full h-full">
                          <Image
                            src={image}
                            alt={`Thumbnail ${index + 1}`}
                            fill
                            priority
                            className="object-cover"
                            sizes="(max-width: 768px) 48px, 64px"
                          />
                        </div>
                      </div>
                    ),
                )}
              </div>
            )}
          </div>
        </div>
        <div>
          <div className="col-span-12 lg:col-span-8">
            <div className="bg-white rounded-xl p-2">
              <h1 className="text-3xl font-bold mb-4">{activity.title}</h1>
              <div className="flex items-center gap-4 mb-6">
                <span className="flex items-center">
                  ⭐ {activity.rating.toFixed(1)}
                  <span className="text-gray-500 ml-1">
                    ({activity.reviewCount})
                  </span>
                </span>
                <span className="text-gray-300">|</span>
                <span>{activity.category}</span>
              </div>
              <div className="w-full h-[1px] bg-[#112211] opacity-25 mb-8" />
              {/* 설명 */}
              <div className="mb-8">
                <div className="text-gray-700 whitespace-pre-line">
                  <TipTapContentRenderer content={activity.description} />
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#112211] opacity-25 mb-8" />
              <div className="mb-8">
                {/* 카카오맵 */}
                <div className="rounded-xl overflow-hidden">
                  <KakaoMap
                    address={activity.address}
                    className="w-full h-[400px] rounded-xl"
                  />
                  <p className="text-gray-700 mt-2 flex items-center">
                    <LocationIcon />
                    {activity.address}
                  </p>
                </div>
              </div>
              <div className="w-full h-[1px] bg-[#112211] opacity-25 mb-8" />
              {/* 후기 container */}
              <div>
                <ReviewSection activityId={activity.id} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <ActivityReservation
        activityId={activity.id}
        price={activity.price}
        title={activity.title}
      />
    </div>
  );
};

export default ActivityDetailPage;
