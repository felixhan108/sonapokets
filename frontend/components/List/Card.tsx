// frontend/components/PhotoGallery/PhotoCard.tsx
import React from "react";

interface PhotoCardProps {
  photo: {
    ID: number;
    UID: string;
    Type: string;
    Hash: string;
    Title?: string;
  };
}

const Card: React.FC<PhotoCardProps> = ({ photo }) => {
  return (
    <div className="photo-card">
      <img
        src={`https://sonapokets.day/admin/api/v1/photos/${photo.UID}/t/${photo.Type}/${photo.Hash}?size=medium`}
        alt={photo.Title || "사진"}
      />
      <p>{photo.Title || "제목 없음"}</p>
    </div>
  );
};

export default Card;
