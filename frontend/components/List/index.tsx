// frontend/components/PhotoGallery/index.tsx
import React from "react";
import { usePhotos } from "../../hooks/usePhotos";
import Card from "./Card";

const List: React.FC = () => {
  const { photos, loading, error, hasMore, loadMore } = usePhotos(10);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>오류: {error}</div>;

  return (
    // <div className="photo-gallery">
    //   {photos.map((photo) => (
    //     <Card key={photo.ID} photo={photo} />
    //   ))}
    //   {hasMore && (
    //     <button onClick={loadMore} className="load-more-button">
    //       더 보기
    //     </button>
    //   )}
    // </div>
  );
};

export default List;
