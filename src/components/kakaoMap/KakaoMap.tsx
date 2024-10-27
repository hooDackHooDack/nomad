import React, { useEffect, useRef } from 'react';

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

export const KakaoMap: React.FC<KakaoMapProps> = ({
  address,
  defaultLat = 37.5666805, // 기본값: 서울 시청
  defaultLng = 126.9784147,
  className = 'w-full h-96 rounded-lg border bg-gray-100',
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markerInstance = useRef<any>(null);

  // 지도 초기화
  useEffect(() => {
    const initMap = () => {
      if (!mapRef.current || !window.kakao?.maps) return;

      try {
        const { maps } = window.kakao;
        const { Map, LatLng, Marker } = maps;

        const options = {
          center: new LatLng(defaultLat, defaultLng),
          level: 3,
        };

        const map = new Map(mapRef.current, options);
        mapInstance.current = map;

        const marker = new Marker({
          position: new LatLng(defaultLat, defaultLng),
          map: map,
        });
        markerInstance.current = marker;
      } catch (error) {
        console.error('Map initialization error:', error);
      }
    };

    const loadKakaoMap = () => {
      const { kakao } = window;
      if (kakao && kakao.maps) {
        kakao.maps.load(initMap);
      } else {
        setTimeout(loadKakaoMap, 100);
      }
    };

    loadKakaoMap();

    return () => {
      if (markerInstance.current) {
        markerInstance.current.setMap(null);
      }
    };
  }, [defaultLat, defaultLng]);

  // 주소가 변경될 때 지도 업데이트
  useEffect(() => {
    if (!address || !window.kakao?.maps || !mapInstance.current) return;

    const { maps } = window.kakao;
    const { services, LatLng } = maps;
    const geocoder = new services.Geocoder();

    geocoder.addressSearch(address, (result: any, status: any) => {
      if (status === services.Status.OK) {
        const coords = new LatLng(result[0].y, result[0].x);

        if (markerInstance.current) {
          markerInstance.current.setPosition(coords);
        }

        mapInstance.current.setCenter(coords);
      }
    });
  }, [address]);

  return <div ref={mapRef} className={className} />;
};

export default KakaoMap;
