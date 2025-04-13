import Image from 'next/image';
import ListPhoto from '@/components/template/ListPhoto';
import UploadPhoto from '@/components/organisms/UploadPhoto';

export default async function Home() {
  const version = process.env.NEXT_PUBLIC_APP_VERSION;
  return (
    <div className="grid items-center justify-items-center min-h-screen p-4 pb-20 gap-8 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <div className="row-start-1">
        <h1 className="text-3xl font-bold text-white text-center">소나의 아홉 지갑</h1>
        <h2 className="text-xl text-white/80 mt-2 text-center">Sona&apos;s 9 Pokéts</h2>
        <h3 className="text-sm text-white/50 mt-2 text-center">v{version}</h3>
        <h4 className="text-sm text-white/50 mt-2 text-center">
          현재 좋아하는 장난감 : 304호 아줌마가 만들어준 북극곰 인형
        </h4>
      </div>
      <main className="w-full max-w-screen-lg row-start-2 flex flex-col gap-4">
        <UploadPhoto />
        <ListPhoto />
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        <a
          className="flex items-center gap-2 hover:underline hover:underline-offset-4"
          href="https://felixhan108.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          <Image aria-hidden src="/globe.svg" alt="Globe icon" width={16} height={16} />
          Go to felixhan108.github.io →
        </a>
      </footer>
    </div>
  );
}
