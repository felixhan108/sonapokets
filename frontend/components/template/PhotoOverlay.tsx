import Image from 'next/image';
import { useEffect } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';
import { Swiper as SwiperType } from 'swiper/types';
import 'swiper/css';
import 'swiper/css/navigation';
import './PhotoOverlay.css';
import { usePhotoStore } from '@/store/photoStore';

interface PhotoOverlayProps {
  photos: {
    Hash: string;
    Title?: string;
  }[];
  currentIndex: number;
  onClose: () => void;
  previewToken: string;
  accessToken: string;
}

export default function PhotoOverlay({ photos, currentIndex, previewToken, onClose, accessToken }: PhotoOverlayProps) {
  const { fetchMorePhotos } = usePhotoStore();

  const loadMorePhotos = async () => {
    try {
      // 현재 마지막 사진의 인덱스 계산
      fetchMorePhotos(3, accessToken);
    } catch (error) {
      console.error('Error loading more photos:', error);
    }
  };

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  // Swiper의 slideChange 이벤트 핸들러
  const handleSlideChange = async (swiper: SwiperType) => {
    if (swiper.isEnd) {
      await loadMorePhotos();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <Swiper
        initialSlide={currentIndex}
        modules={[Navigation]}
        navigation
        className="w-full h-full"
        onSlideChange={handleSlideChange}
      >
        {photos.map(photo => (
          <SwiperSlide key={photo.Hash} className="w-full h-full">
            <div className="w-full h-full flex items-center justify-center">
              <Image
                width={1920}
                height={1920}
                src={`/api/v1/t/${photo.Hash}/${previewToken}/fit_1920`}
                alt={photo.Title || '사진'}
                className="object-contain"
              />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
      <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300 z-10" onClick={onClose}>
        ✕
      </button>
    </div>
  );
}
