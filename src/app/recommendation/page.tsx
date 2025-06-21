import dynamic from 'next/dynamic';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout'),
  { ssr: false, loading: () => <div>로딩 중...</div> }
);

// 추천 아이템 컴포넌트 (클라이언트 컴포넌트)
const RecommendationItem = dynamic(
  () => import('@/components/recommendation/RecommendationItem'),
  { ssr: false, loading: () => <div>로딩 중...</div> }
);

// 추천 데이터 타입 정의
interface Recommendation {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
}

// 추천 데이터 (실제로는 API에서 가져올 수 있음)
const recommendations: Recommendation[] = [
  {
    id: '1',
    title: '부산 해운대 1박 2일 코스',
    location: '부산 해운대구',
    image: 'https://picsum.photos/400/300?random=1',
    price: '₩250,000~',
  },
  {
    id: '2',
    title: '제주도 여유로운 여행',
    location: '제주시',
    image: 'https://picsum.photos/400/300?random=2',
    price: '₩350,000~',
  },
  {
    id: '3',
    title: '경주 역사 여행',
    location: '경주시',
    image: 'https://picsum.photos/400/300?random=3',
    price: '₩200,000~',
  },
];

// 추천 페이지 (서버 컴포넌트)
export default function RecommendationPage() {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">추천 1박 2일 여행</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {recommendations.map((item) => (
            <RecommendationItem key={item.id} {...item} />
          ))}
        </div>
      </div>
    </ClientLayout>
  );
}
