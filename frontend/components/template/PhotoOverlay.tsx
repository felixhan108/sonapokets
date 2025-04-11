import Image from 'next/image';
import { useEffect } from 'react';

interface PhotoOverlayProps {
  photo: {
    Hash: string;
    Title?: string;
  };
  previewToken: string;
  onClose: () => void;
}

export default function PhotoOverlay({ photo, previewToken, onClose }: PhotoOverlayProps) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, []);

  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Image
          width={1920}
          height={1920}
          src={`/api/v1/t/${photo.Hash}/${previewToken}/fit_1920`}
          alt={photo.Title || '사진'}
          className="object-contain"
        />
        <button className="absolute top-4 right-4 text-white text-2xl hover:text-gray-300" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
