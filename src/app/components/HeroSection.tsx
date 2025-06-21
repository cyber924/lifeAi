'use client'

export function HeroSection() {
  return (
    <div className="relative h-64 sm:h-80 md:h-96 w-full overflow-hidden">
      <img
        src="https://picsum.photos/1600/900?grayscale&blur=2"
        alt="Hero background"
        className="absolute inset-0 w-full h-full object-cover"
      />
      <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
        <div className="text-center text-white p-4">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            LifeAI, 일상을 바꾸는 새로운 경험
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl font-light max-w-3xl mx-auto">
            여행, 맛집, 쇼핑까지. 당신에게 꼭 맞는 정보를 AI가 미리 준비합니다.
          </p>
        </div>
      </div>
    </div>
  );
}
