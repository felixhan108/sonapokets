'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useSessionStore } from '@/store/sessionStore';
import { usePhotoStore } from '@/store/photoStore';
import PhotoOverlay from './PhotoOverlay';

export default function ListPhoto() {
  const { accessToken, previewToken, fetchSession, isLoading } = useSessionStore();
  const { photos, isLoading: photoLoading, fetchInitialPhotos, setupWebSocket, fetchMorePhotos } = usePhotoStore();
  const [page, setPage] = useState(1);
  const observerRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const scrollPosition = useRef(0);
  const [selectedPhoto, setSelectedPhoto] = useState<{ Hash: string; Title?: string } | null>(null);

  // 이전 상태값 저장을 위한 ref
  const prevState = useRef({
    accessToken,
    previewToken,
    isLoading,
    photos,
    photoLoading,
    page,
    isVisible,
  });

  const handleObserver = useCallback(
    (entries: IntersectionObserverEntry[]) => {
      const [entry] = entries;
      if (entry.isIntersecting && !photoLoading) {
        scrollPosition.current = window.scrollY;
        console.log('🔍 관찰 요소가 화면에 보임 - 페이지:', page);
        setPage(prev => prev + 1);
        // WebSocket을 통해 새로운 사진 요청
        fetchMorePhotos(3, accessToken);
      }
    },
    [accessToken, photoLoading, page, fetchMorePhotos]
  );

  // 스크롤 위치 복원
  useEffect(() => {
    if (!photoLoading && scrollPosition.current > 0) {
      window.scrollTo(0, scrollPosition.current);
    }
  }, [photoLoading]);

  useEffect(() => {
    console.log('🟢 컴포넌트 마운트됨');
    fetchSession();
  }, [fetchSession]);

  useEffect(() => {
    console.log('🔄 컴포넌트 리렌더링됨');

    // 상태 변경 추적
    const changes = [];
    if (prevState.current.accessToken !== accessToken) {
      changes.push(`accessToken: ${prevState.current.accessToken} → ${accessToken}`);
    }
    if (prevState.current.previewToken !== previewToken) {
      changes.push(`previewToken: ${prevState.current.previewToken} → ${previewToken}`);
    }
    if (prevState.current.isLoading !== isLoading) {
      changes.push(`isLoading: ${prevState.current.isLoading} → ${isLoading}`);
    }
    if (prevState.current.photos !== photos) {
      changes.push(`photos: ${prevState.current.photos.length}개 → ${photos.length}개`);
    }
    if (prevState.current.photoLoading !== photoLoading) {
      changes.push(`photoLoading: ${prevState.current.photoLoading} → ${photoLoading}`);
    }
    if (prevState.current.page !== page) {
      changes.push(`page: ${prevState.current.page} → ${page}`);
    }
    if (prevState.current.isVisible !== isVisible) {
      changes.push(`isVisible: ${prevState.current.isVisible} → ${isVisible}`);
    }

    if (changes.length > 0) {
      console.log('📊 상태 변경:', changes.join(', '));
    } else {
      console.log('📊 상태 변경 없음');
    }

    // 현재 상태를 이전 상태로 저장
    prevState.current = {
      accessToken,
      previewToken,
      isLoading,
      photos,
      photoLoading,
      page,
      isVisible,
    };

    // 현재 ref 요소 저장
    const element = observerRef.current;

    // 관찰자 생성
    const observer = new IntersectionObserver(handleObserver, {
      root: null, // 뷰포트 기준
      rootMargin: '0px',
      threshold: 0.1, // 10% 보일 때 콜백 실행
    });

    // 요소가 있으면 관찰 시작
    if (element) {
      console.log('🎯 관찰 시작');
      observer.observe(element);
    }

    // 컴포넌트 언마운트 시 관찰 종료
    return () => {
      console.log('🛑 관찰 종료');
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [accessToken, fetchInitialPhotos, page, photoLoading, isVisible, handleObserver]);

  useEffect(() => {
    if (accessToken && page === 1) {
      console.log('📥 초기 데이터 로드');
      fetchInitialPhotos(9, accessToken);
      // 초기 WebSocket 연결 설정
      setupWebSocket(accessToken);
    }
  }, [accessToken, fetchInitialPhotos, page, setupWebSocket]);

  // 마운트/언마운트 추적
  useEffect(() => {
    console.log('🟢 컴포넌트 마운트됨');

    return () => {
      console.log('🔴 컴포넌트 언마운트됨');
    };
  }, []);

  if (isLoading) return <div className="text-center text-white">Loading...</div>;

  return (
    <>
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        {photos.map((photo, index) => (
          <div
            key={photo.UID + index}
            className="relative aspect-square border rounded-lg overflow-hidden shadow-md cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              width={500}
              height={500}
              src={`/api/v1/t/${photo.Hash}/${previewToken}/tile_500`}
              alt={photo.Title || '사진'}
              className="absolute w-full h-full object-cover"
            />
          </div>
        ))}
      </div>

      <div ref={observerRef} className="h-10 my-4 text-center text-white/50 text-sm">
        {photoLoading ? '사진 로딩 중...' : '더 보려면 스크롤하세요'}
      </div>

      {selectedPhoto && (
        <PhotoOverlay photo={selectedPhoto} previewToken={previewToken} onClose={() => setSelectedPhoto(null)} />
      )}
    </>
  );
}
