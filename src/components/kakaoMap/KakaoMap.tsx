import { useEffect, useRef, useState } from 'react';

interface KakaoMapProps {
  address?: string;
  defaultLat?: number;
  defaultLng?: number;
  className?: string;
}

declare global {
  interface Window {
    kakao: any;
  }
}

export const KakaoMap = ({
  address,
  defaultLat = 37.5666805,
  defaultLng = 126.9784147,
  className = 'w-full h-96 rounded-lg border bg-gray-100',
}: KakaoMapProps) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);
  const [isKakaoLoaded, setIsKakaoLoaded] = useState(false);

  // 카카오맵 스크립트 로딩 상태 체크
  useEffect(() => {
    const checkKakaoMap = () => {
      if (window.kakao?.maps) {
        // 서비스 라이브러리 로드
        window.kakao.maps.load(() => {
          setIsKakaoLoaded(true);
        });
      } else {
        setTimeout(checkKakaoMap, 100);
      }
    };

    checkKakaoMap();
  }, []);

  // 지도 초기화 및 주소 설정
  useEffect(() => {
    if (!isKakaoLoaded || !mapRef.current) return;

    const initializeMap = (coords?: { lat: number; lng: number }) => {
      try {
        const { maps } = window.kakao;
        const { Map, LatLng, Marker } = maps;

        const options = {
          center: new LatLng(
            coords?.lat ?? defaultLat,
            coords?.lng ?? defaultLng,
          ),
          level: 3,
        };

        const map = new Map(mapRef.current, options);
        mapInstance.current = map;

        const marker = new Marker({
          position: new LatLng(
            coords?.lat ?? defaultLat,
            coords?.lng ?? defaultLng,
          ),
          map: map,
        });
        markerInstance.current = marker;

        // 주소가 있을 경우 지오코딩 수행
        if (address) {
          const geocoder = new window.kakao.maps.services.Geocoder();
          geocoder.addressSearch(address, (result: any, status: any) => {
            if (status === window.kakao.maps.services.Status.OK) {
              const coords = {
                lat: Number(result[0].y),
                lng: Number(result[0].x),
              };

              const moveLatLng = new LatLng(coords.lat, coords.lng);
              map.setCenter(moveLatLng);
              marker.setPosition(moveLatLng);
            }
          });
        }
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    initializeMap();

    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
    };
  }, [address, defaultLat, defaultLng, isKakaoLoaded]);

  return <div ref={mapRef} className={className} />;
};

export default KakaoMap;
