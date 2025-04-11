// store/photoStore.ts의 개선된 버전
import { create } from 'zustand';

interface Photo {
  ID: string;
  UID: string;
  Title: string;
  Hash: string;
  TakenAtLocal: string;
}

interface PhotoState {
  photos: Photo[];
  isLoading: boolean;
  error: string | null;
  wsConnected: boolean;
  setupWebSocket: (accessToken: string) => void;
  fetchInitialPhotos: (count: number, accessToken: string) => Promise<void>;
  fetchMorePhotos: (count: number, accessToken: string) => Promise<void>;
  cleanup: () => void;
}

export const usePhotoStore = create<PhotoState>((set, get) => ({
  photos: [],
  isLoading: false,
  error: null,
  wsConnected: false,

  // 기존 fetchPhotos 함수 (초기 로드용)
  fetchInitialPhotos: async (count: number, accessToken: string) => {
    set({ isLoading: true });
    try {
      const data = await fetch(`/api/v1/photos?count=${count}&order=newest`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const photos = await data.json();
      set({ photos, isLoading: false });

      // 초기 데이터 로드 후 WebSocket 연결
      get().setupWebSocket(accessToken);
    } catch (error) {
      set({ error: '초기 데이터 로드 실패', isLoading: false });
    }
  },

  // 추가 사진 로드용 함수
  fetchMorePhotos: async (count: number, accessToken: string) => {
    set({ isLoading: true });
    try {
      const currentPhotos = get().photos;
      const lastPhotoDate = currentPhotos[currentPhotos.length - 1]?.TakenAtLocal;

      const data = await fetch(`/api/v1/photos?count=${count}&order=newest&offset=${currentPhotos.length}`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      });
      const newPhotos = await data.json();

      set(state => ({
        photos: [...state.photos, ...newPhotos],
        isLoading: false,
      }));
    } catch (error) {
      set({ error: '추가 사진 로드 실패', isLoading: false });
    }
  },

  // WebSocket 설정
  setupWebSocket: (accessToken: string) => {
    // 이미 연결되어 있으면 중복 연결 방지
    if (get().wsConnected) return;

    const ws = new WebSocket(`/api/v1/ws`);

    ws.onopen = () => {
      console.log('WebSocket 연결됨');
      set({ wsConnected: true });

      // 인증 메시지 전송 (필요한 경우)
      ws.send(JSON.stringify({ type: 'auth', token: accessToken }));
    };

    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data);

        // 메시지 타입에 따른 처리
        switch (message.type) {
          case 'photo_added':
            // 새 사진이 추가됨 - 목록 앞에 추가
            set(state => ({
              photos: [message.photo, ...state.photos],
            }));
            break;

          case 'photo_updated':
            // 기존 사진 업데이트
            set(state => ({
              photos: state.photos.map(p => (p.ID === message.photo.ID ? message.photo : p)),
            }));
            break;

          case 'photo_deleted':
            // 사진 삭제
            set(state => ({
              photos: state.photos.filter(p => p.ID !== message.photoId),
            }));
            break;
        }
      } catch (error) {
        console.error('WebSocket 메시지 처리 오류:', error);
      }
    };

    ws.onclose = () => {
      console.log('WebSocket 연결 종료');
      set({ wsConnected: false });

      // 재연결 시도 (선택 사항)
      // setTimeout(() => {
      //   if (!get().wsConnected) {
      //     get().setupWebSocket(accessToken);
      //   }
      // }, 3000);
    };

    ws.onerror = error => {
      console.error('WebSocket 오류:', error);
    };
  },

  // 연결 정리
  cleanup: () => {
    // WebSocket 연결 정리 로직
  },
}));
