'use client';
import React, { useState, useRef } from 'react';
import { useSessionStore } from '@/store/sessionStore';
import { useFileStore } from '@/store/fileStore';
const UploadPhoto: React.FC = () => {
  const { accessToken } = useSessionStore();
  const { uploadFile, isUploading } = useFileStore();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      console.log('선택된 파일:', files[0].name);
    }
    if (files) {
      setSelectedFile(files[0]);
    }
  };

  const handleUpload = () => {
    if (selectedFile) {
      uploadFile(selectedFile);
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="upload-photo flex flex-row gap-2">
      <input type="file" onChange={handleFileChange} ref={fileInputRef} className="hidden" />
      <button onClick={handleButtonClick} disabled={isUploading} className="bg-blue-500 text-white p-2 rounded-md">
        파일 선택
      </button>
      <button
        onClick={handleUpload}
        disabled={isUploading || !selectedFile}
        className="bg-green-500 text-white p-2 rounded-md"
      >
        {isUploading ? '업로드 중...' : '업로드'}
      </button>
    </div>
  );
};

export default UploadPhoto;
