import dynamic from 'next/dynamic';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then((mod) => mod.default),
  { ssr: false }
);

export default function Home() {
  return (
    <ClientLayout>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mt-8">환영합니다</h1>
        <p className="mt-4">메인 페이지 내용이 여기에 표시됩니다.</p>
      </div>
    </ClientLayout>
  );
}
