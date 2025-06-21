import dynamic from 'next/dynamic';

// ClientLayout을 동적으로 로드 (SSR 비활성화)
const ClientLayout = dynamic(
  () => import('@/components/layout/ClientLayout').then((mod) => mod.default),
  { ssr: false }
);

const AttractionPage = () => {
  return (
    <ClientLayout>
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6">인기 명소</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* 여기에 명소 아이템들이 들어갑니다 */}
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://picsum.photos/400/300?random=4" 
                alt="명소 이미지" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">경복궁</h3>
              <p className="text-gray-600">서울시 종로구</p>
              <p className="text-sm text-gray-500 mt-2">조선 시대의 대표적인 궁궐로 아름다운 전통 건축물이 있는 곳</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://picsum.photos/400/300?random=5" 
                alt="명소 이미지" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">남산타워</h3>
              <p className="text-gray-600">서울시 용산구</p>
              <p className="text-sm text-gray-500 mt-2">서울의 전경을 한눈에 볼 수 있는 랜드마크</p>
            </div>
          </div>
          
          <div className="border rounded-lg overflow-hidden shadow-md">
            <div className="h-48 bg-gray-200">
              <img 
                src="https://picsum.photos/400/300?random=6" 
                alt="명소 이미지" 
                className="w-full h-full object-cover"
              />
            </div>
            <div className="p-4">
              <h3 className="font-bold text-lg">한강공원</h3>
              <p className="text-gray-600">서울시 영등포구</p>
              <p className="text-sm text-gray-500 mt-2">도심 속 휴식과 다양한 레저 활동을 즐길 수 있는 공간</p>
            </div>
          </div>
        </div>
      </div>
    </ClientLayout>
  );
};

export default AttractionPage;
