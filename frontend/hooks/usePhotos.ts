// frontend/hooks/usePhotos.ts
"use client";

import { useState, useEffect } from "react";
import { getSessionToken, getPhotos } from "../lib/api";

interface Photo {
  id: string;
  title: string;
  url: string;
  // 필요한 다른 속성들 추가
}

export const usePhotos = (initialCount = 10) => {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // 세션 토큰 가져오기
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const token = await getSessionToken("admin", "1234");
        setAccessToken(token);
        // 토큰을 가져온 후 사진 로드
        fetchInitialPhotos(token);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchToken();
  }, []);

  // 초기 사진 로드
  const fetchInitialPhotos = async (token: string) => {
    try {
      const data = await getPhotos(initialCount, 0, token);
      setPhotos(data);
      setLoading(false);
      setHasMore(data.length === initialCount);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(errorMessage);
      setLoading(false);
    }
  };

  // 추가 사진 로드
  const loadMore = async () => {
    if (!hasMore || !accessToken) return;

    try {
      const offset = page * initialCount;
      const data = await getPhotos(initialCount, offset, accessToken);

      if (data.length < initialCount) {
        setHasMore(false);
      }

      setPhotos((prev) => [...prev, ...data]);
      setPage((prev) => prev + 1);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다";
      setError(errorMessage);
    }
  };

  return { photos, loading, error, hasMore, loadMore };
};
