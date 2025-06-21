import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';

// 동적으로 WeatherInfo 컴포넌트 로드 (SSR 비활성화)
const WeatherInfo = dynamic(
  () => import('@/components/common/WeatherInfo').then((mod) => mod.default),
  { ssr: false, loading: () => <div className="h-10 bg-white/10"></div> }
);

export const HeroSection = () => {
  return (
    <section className="relative bg-gradient-to-r from-blue-600 to-blue-800 text-white pt-24 pb-20 -mt-16 overflow-hidden">
      {/* Weather Info */}
      <div className="absolute top-0 left-0 right-0 bg-white/10 backdrop-blur-sm z-10">
        <div className="container mx-auto px-4">
          <WeatherInfo />
        </div>
      </div>
      {/* 배경 패턴 */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))]"></div>
      </div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          {/* 왼쪽 컬럼: 텍스트 콘텐츠 */}
          <div className="space-y-6">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
              당신의 일상을 더 스마트하게,<br />
              <span className="text-yellow-300">LifeAI</span>와 함께하세요
            </h1>
            <p className="text-lg md:text-xl text-blue-100 max-w-lg">
              인공지능이 분석하는 날씨, 운세, 생활 정보로
              하루를 더 풍요롭고 편리하게 만들어 드립니다.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link 
                href="/weather-lifestyle" 
                className="bg-white text-blue-700 hover:bg-blue-50 font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
              >
                시작하기
              </Link>
              <Link 
                href="/about" 
                className="bg-transparent border-2 border-white hover:bg-white/10 font-semibold py-3 px-6 rounded-lg text-center transition-colors duration-200"
              >
                자세히 알아보기
              </Link>
            </div>
          </div>
          
          {/* 오른쪽 컬럼: 이미지 */}
          <div className="relative h-80 md:h-96 lg:h-[500px]">
            <Image
              src="https://picsum.photos/800/600?random=1"
              alt="LifeAI 일러스트레이션"
              fill
              className="object-cover rounded-lg shadow-xl"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        </div>
      </div>
    </section>
  );
};
