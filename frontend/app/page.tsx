import Image from "next/image";

// 블로그 포스트 타입 정의
interface Post {
  id: string;
  title: string;
  // 필요한 다른 속성들 추가
}

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
  try {
    const sessionData = await fetch("https://sonapokets.day/api/v1/session", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: "admin",
        password: "1234",
      }),
    });

    if (!sessionData.ok) {
      throw new Error(`세션 요청 실패: ${sessionData.status}`);
    }

    const session = await sessionData.json();
    accessToken = session.access_token;
  } catch (error) {
    console.error("세션 토큰 가져오기 오류:", error);
  }

  // 사진 데이터 가져오기
  let photos: Photo[] = [];
  try {
    const data = await fetch("https://sonapokets.day/api/v1/photos?count=10", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    if (data.ok) {
      photos = await data.json();
    }
  } catch (error) {
    console.error("사진 데이터 가져오기 오류:", error);
  }
  // 블로그 데이터 가져오기
  let posts: Post[] = [];
  try {
    const data = await fetch("https://api.vercel.app/blog");
    if (data.ok) {
      posts = await data.json();
    }
  } catch (error) {
    console.error("블로그 데이터 가져오기 오류:", error);
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post: Post) => (
              <div key={post.id}>{post.title}</div>
            ))}
          </div>
        </div>
        <div>{accessToken}</div>
        <div>
          <h1>사진 갤러리</h1>
          {photos.map((photo, index) => (
            <div
              key={photo.UID + index}
              className="border rounded-lg overflow-hidden shadow-md"
            >
              <img
                src={`https://sonapokets.day/api/v1/label/${photo.UID}/t/${photo.Hash}/original?token=${accessToken}`}
                alt={photo.Title || "사진"}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold">
                  {photo.Title || "제목 없음"}
                </h2>
                <p className="text-sm text-gray-500">{photo.TakenAtLocal}</p>
              </div>
            </div>
          ))}
        </div>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org/learn?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/file.svg"
            alt="File icon"
            width={16}
            height={16}
          />
          Learn
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://vercel.com/templates?framework=next.js&utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image
            aria-hidden
            src="/window.svg"
            alt="Window icon"
            width={16}
            height={16}
          />
          Examples
        </a>
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://nextjs.org?utm_source=create-next-app&utm_medium=appdir-template-tw&utm_campaign=create-next-app"
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
          Go to nextjs.org →
        </a>
      </footer>
    </div>
  );
}
