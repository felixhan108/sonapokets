// store/sessionStore.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

/**
 * 세션 상태를 관리하는 인터페이스
 *
 * @description 포토프리즘 API와의 세션 인증, 토큰 관리, 로딩 상태 및 오류 처리를 위한 속성과 메서드를 포함합니다.
 */

interface SessionState {
  accessToken: string; // API 접근을 위한 인증 토큰
  previewToken: string; // 이미지 미리보기에 사용되는 토큰
  isLoading: boolean; // API 요청 진행 상태 (true: 로딩 중)
  error: string | null; // 오류 발생 시 메시지 (null: 오류 없음)
  fetchSession: () => Promise<void>; // 세션 토큰을 가져오는 비동기 함수
}

// Zustand 관련:
// - create: 전역 상태 저장소를 생성하는 Zustand 핵심 함수
// - set: 상태를 업데이트하는 Zustand 메소드
export const useSessionStore = create<SessionState>()(
  devtools(
    set => ({
      accessToken: '',
      previewToken: '',
      isLoading: false,
      error: null,

      fetchSession: async () => {
        set({ isLoading: true, error: null }, false, 'fetchSession');
        try {
          const sessionData = await fetch(`/api/v1/session`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              username: 'admin',
              password: '1234',
            }),
          });

          if (!sessionData.ok) {
            throw new Error(`세션 요청 실패: ${sessionData.status}`);
          }

          const session = await sessionData.json();

          console.log(session);

          set({
            accessToken: session.access_token,
            previewToken: session.config.previewToken,
            isLoading: false,
          });
        } catch (error) {
          console.error('세션 토큰 가져오기 오류:', error);

          set({
            error: error instanceof Error ? error.message : '알 수 없는 오류',
            isLoading: false,
          });
        }
      },
    }),
    { name: 'sessionStore' }
  )
);
