import { create } from 'zustand';
import { useSessionStore } from '@/store/sessionStore';

interface FileState {
  isUploading: boolean;
  uploadFile: (file: File) => Promise<void>;
}

export const useFileStore = create<FileState>(set => ({
  isUploading: false,
  uploadFile: async (file: File) => {
    const { sessionId } = useSessionStore.getState();
    const token = 'sc9ana';

    set({ isUploading: true });
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch(`/api/v1/user/${sessionId}/upload/${token}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('사진 업로드 실패');
      }

      const data = await response.json();
      console.log('업로드 성공:', data);
    } catch (error) {
      console.error('업로드 오류:', error);
    } finally {
      set({ isUploading: false });
    }
  },
}));
