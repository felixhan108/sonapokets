// frontend/lib/api.ts
import axios from "axios";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "https://sonapokets.day/admin/api/v1";
const USERNAME = process.env.NEXT_PUBLIC_USERNAME || "admin"; // 기본값으로 'admin' 사용
const PASSWORD = process.env.NEXT_PUBLIC_PASSWORD || "1234"; // 환경 변수에서 비밀번호 가져오기

// 세션 토큰을 가져오는 함수
export const getSessionToken = async (
  username: string,
  password: string
): Promise<string> => {
  try {
    const response = await axios.post(`${API_URL}/session`, {
      username,
      password,
    });

    return response.data.access_token;
  } catch (error) {
    console.error("세션 토큰 가져오기 실패:", error);
    throw error;
  }
};

// 인증 헤더를 포함한 axios 인스턴스 생성
export const getAuthAxios = async () => {
  const token = await getSessionToken(USERNAME, PASSWORD);

  return axios.create({
    baseURL: API_URL,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
};

// 사진 타입 정의
export interface Photo {
  id: string;
  title: string;
  url: string;
  // 필요한 다른 속성들 추가
}

// 사진을 가져오는 함수
export const getPhotos = async (
  count: number = 10,
  offset: number = 0,
  accessToken: string
): Promise<Photo[]> => {
  try {
    const response = await axios.get(`${API_URL}/photos`, {
      params: {
        count,
        offset,
      },
      headers: {
        "Content-Type": "application/json",
        "X-auth-token": accessToken,
      },
    });

    return response.data;
  } catch (error) {
    console.error("사진 가져오기 실패:", error);
    throw error;
  }
};
