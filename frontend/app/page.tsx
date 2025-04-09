import Image from "next/image";
import { version } from "../package.json";

// Photo 인터페이스 정의
interface Photo {
  ID: string;
  UID: string;
  Title: string;
  Hash: string;
  TakenAtLocal: string;
  // 필요한 다른 속성들 추가
}

export default async function Home() {
  // 세션 토큰 가져오기
  let accessToken = "";
  let previewToken = "";
  try {
    const sessionData = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/session`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: "admin",
          password: "1234",
        }),
      }
    );

    if (!sessionData.ok) {
      throw new Error(`세션 요청 실패: ${sessionData.status}`);
    }

    const session = await sessionData.json();
    accessToken = session.access_token;
    previewToken = session.config.previewToken;
  } catch (error) {
    console.error("세션 토큰 가져오기 오류:", error);
  }

  // 사진 데이터 가져오기
  let photos: Photo[] = [];
  try {
    const data = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v1/photos?count=156&order=newest`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    if (data.ok) {
      photos = await data.json();
    }
  } catch (error) {
    console.error("사진 데이터 가져오기 오류:", error);
  }

  return (
    <div className="grid items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="row-start-1">
        <h1 className="text-3xl font-bold text-white text-center">
          소나의 아홉 지갑
        </h1>
        <h2 className="text-xl text-white/80 mt-2 text-center">
          Sona&apos;s 9 Pokéts
        </h2>
        <h3 className="text-sm text-white/50 mt-2 text-center">v{version}</h3>
      </div>
      <main className="w-full max-w-screen-lg row-start-2">
        <div className="grid grid-cols-3 gap-2 sm:gap-4">
          {photos.map((photo, index) => (
            <div
              key={photo.UID + index}
              className="relative aspect-square border rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={`${process.env.NEXT_PUBLIC_API_URL}/api/v1/t/${photo.Hash}/${previewToken}/tile_500`}
                alt={photo.Title || "사진"}
                className="absolute w-full h-full object-cover"
              />
            </div>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://felixhan108.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/globe.svg"
            alt="Globe icon"
            width={16}
            height={16}
          />
          Go to felixhan108.github.io →
        </a>
      </footer>
    </div>
  );
}
