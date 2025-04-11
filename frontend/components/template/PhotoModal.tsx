import Image from 'next/image';

interface PhotoModalProps {
  photo: {
    Hash: string;
    Title?: string;
  };
  previewToken: string;
  onClose: () => void;
}

export default function PhotoModal({ photo, previewToken, onClose }: PhotoModalProps) {
  return (
    <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center" onClick={onClose}>
      <div className="relative max-w-[90vw] max-h-[90vh]">
        <Image
          width={1200}
          height={1200}
          src={`/api/v1/t/${photo.Hash}/${previewToken}/tile_1200`}
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
