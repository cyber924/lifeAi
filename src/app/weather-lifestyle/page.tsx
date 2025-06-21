import { NextPage } from 'next';

// OpenWeatherMap API 응답 타입 (필요한 부분만 정의)
interface WeatherInfo {
  name: string; // 도시 이름
  main: {
    temp: number; // 현재 온도
    feels_like: number; // 체감 온도
    temp_min: number; // 최저 온도
    temp_max: number; // 최고 온도
    humidity: number; // 습도
  };
  weather: {
    main: string; // 날씨 상태 (예: Clouds, Rain, Clear)
    description: string; // 날씨 설명 (예: 약간 구름)
    icon: string; // 날씨 아이콘 코드
  }[];
  wind: {
    speed: number; // 풍속
  };
}

// 날씨 기반 생활 정보 제안 함수
const lifestyleSuggestions: { [key: string]: string[] } = {
  Clear: [
    "오늘처럼 화창한 날, 비타민 D를 듬뿍 받을 수 있는 야외 활동은 어떠세요? ☀️ 가까운 공원에서 조깅을 하거나 자전거를 타보세요.",
    "햇살이 눈부시네요! 선글라스를 챙겨들고 전망 좋은 루프탑 카페에서 여유로운 시간을 보내는 것을 추천합니다. 😎",
    "맑고 깨끗한 날씨, 미뤄뒀던 동네 한 바퀴 산책을 떠나기 완벽한 날입니다. 기분 전환에 최고일 거예요!",
    "오늘은 빨래하기 좋은 날! 뽀송뽀송하게 마른 세탁물에서 나는 햇볕 냄새로 하루를 상쾌하게 시작해보세요. 🧺"
  ],
  Clouds: [
    "구름이 햇빛을 가려주어 활동하기 딱 좋은 날씨네요. ☁️ 가벼운 등산이나 트레킹으로 자연을 만끽해보세요.",
    "선선한 바람이 부는 오늘, 평소 가보고 싶었던 서점에 들러 마음의 양식을 쌓아보는 건 어떠세요? 📖",
    "흐린 날씨는 감성을 자극하죠. 분위기 있는 재즈바에서 칵테일 한 잔과 함께 깊은 대화를 나눠보세요. 🎷",
    "오늘은 야외 활동도 좋지만, 실내 클라이밍이나 볼링 같은 액티비티로 새로운 즐거움을 찾아보는 것도 좋은 선택입니다."
  ],
  Rain: [
    "비 오는 날의 운치를 더해줄 파전과 막걸리, 어떠세요? 빗소리를 들으며 즐기는 맛은 두 배가 될 거예요. 🍶",
    "따뜻한 물에 몸을 담그고 반신욕을 즐기며 하루의 피로를 풀어보세요. 아로마 오일을 더하면 금상첨화! 🛀",
    "창밖으로 내리는 비를 보며 감성적인 영화 한 편을 보는 것도 멋진 휴식 방법입니다. 🎬",
    "비가 오면 공기가 더 깨끗해져요. 잠시 창문을 열어 상쾌한 비 냄새를 맡으며 기분을 전환해보세요."
  ],
  Drizzle: [
    "보슬비가 내리는 날, LP바에서 흘러나오는 음악에 취해보는 건 어떠세요? 🎶",
    "가볍게 내리는 비는 오히려 운치를 더하죠. 예쁜 우산을 쓰고 고궁이나 한옥마을을 거닐어보세요."
  ],
  Snow: [
    "하얀 눈이 내리는 날, 따뜻한 집에서 창밖 풍경을 감상하며 포근한 시간을 보내세요. ☕❄️",
    "눈 오는 날엔 역시 따끈한 국물 요리죠! 맛있는 음식으로 몸과 마음을 녹여보세요. 🍲",
    "뽀드득 눈 밟는 소리를 들으며 가까운 공원을 산책하고, 예쁜 눈사람도 만들어보세요. ☃️"
  ],
  Thunderstorm: [
    "천둥 번개가 치는 날에는 가급적 실내에 머무르며 안전에 유의하세요! ⛈️",
    "집에서 스릴러 영화나 책을 보며 바깥 날씨와 어울리는 분위기를 즐겨보는 것도 특별한 경험이 될 거예요."
  ],
  Mist: [
    "안개가 자욱한 아침, 신비로운 분위기를 사진에 담아보는 건 어떠세요? 📸",
    "오늘은 시야가 좋지 않으니, 운전 시 각별히 주의하시고 대중교통을 이용하는 것을 추천합니다."
  ],
  Default: [
    "오늘 같은 날씨에는 이런 활동을 해보는 건 어떠세요? 😊",
    "새로운 하루, 새로운 경험을 찾아 떠나보세요! 당신의 일상을 응원합니다."
  ]
};

// 날씨 기반 생활 정보 제안 함수 (랜덤 선택)
const getLifestyleSuggestion = (weatherMain: string): string => {
  // Mist, Smoke, Haze, Dust, Fog, Sand, Ash, Squall, Tornado 등은 Mist로 통합하여 처리
  const simplifiedWeather = ['Mist', 'Smoke', 'Haze', 'Dust', 'Fog', 'Sand', 'Ash', 'Squall', 'Tornado'].includes(weatherMain) ? 'Mist' : weatherMain;
  const suggestions = lifestyleSuggestions[simplifiedWeather] || lifestyleSuggestions['Default'];
  const randomIndex = Math.floor(Math.random() * suggestions.length);
  return suggestions[randomIndex];
};

const cities = [
  { name: '서울', query: 'Seoul,KR' },
  { name: '부산', query: 'Busan,KR' },
  { name: '대구', query: 'Daegu,KR' },
  { name: '대전', query: 'Daejeon,KR' },
  { name: '광주', query: 'Gwangju,KR' },
  { name: '춘천', query: 'Chuncheon,KR' },
  { name: '태백', query: 'Taebaek,KR' },
  { name: '제주', query: 'Jeju,KR' },
  { name: '속초', query: 'Sokcho,KR' },
];

async function fetchWeatherForCity(cityQuery: string): Promise<WeatherInfo | null> {
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  if (!apiKey) {
    console.error('OpenWeatherMap API key is not defined.');
    return null;
  }
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${cityQuery}&appid=${apiKey}&units=metric&lang=kr`;
  try {
    const response = await fetch(url, { cache: 'no-store' }); // SSR을 위해 캐시 사용 안 함
    if (!response.ok) {
      console.error(`Error fetching weather for ${cityQuery}: ${response.statusText}`);
      return null;
    }
    const data = await response.json();
    return data as WeatherInfo;
  } catch (error) {
    console.error(`Exception fetching weather for ${cityQuery}:`, error);
    return null;
  }
}

const WeatherLifestylePage: NextPage = async () => {
  const weatherDataList = await Promise.all(
    cities.map(async (city) => {
      const weatherInfo = await fetchWeatherForCity(city.query);
      return { ...city, weatherInfo };
    })
  );

  return (
    <div className="container mx-auto p-4 pt-24 min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-center text-gray-800">오늘의 날씨와 생활 팁 🌦️</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {weatherDataList.map(({ name, weatherInfo }) => {
          if (!weatherInfo) {
            return (
              <div key={name} className="bg-white p-6 rounded-xl shadow-lg">
                <h2 className="text-2xl font-semibold mb-2 text-gray-700">{name}</h2>
                <p className="text-red-500">날씨 정보를 가져오는데 실패했습니다.</p>
              </div>
            );
          }

          const suggestion = getLifestyleSuggestion(weatherInfo.weather[0]?.main || '');
          const weatherIconUrl = `http://openweathermap.org/img/wn/${weatherInfo.weather[0]?.icon}@2x.png`;

          return (
            <div key={name} className="bg-white p-6 rounded-xl shadow-lg transform hover:scale-105 transition-transform duration-300">
              <div className="flex items-center mb-3">
                <h2 className="text-2xl font-semibold text-gray-700 mr-3">{weatherInfo.name}</h2>
                {weatherInfo.weather[0]?.icon && (
                  <img src={weatherIconUrl} alt={weatherInfo.weather[0]?.description} className="w-12 h-12" />
                )}
              </div>
              <p className="text-lg text-gray-600 mb-1">
                현재 기온: <span className="font-medium text-blue-500">{weatherInfo.main.temp}°C</span> (체감: {weatherInfo.main.feels_like}°C)
              </p>
              <p className="text-md text-gray-500 mb-1">날씨: {weatherInfo.weather[0]?.description}</p>
              <p className="text-md text-gray-500 mb-3">습도: {weatherInfo.main.humidity}% | 풍속: {weatherInfo.wind.speed}m/s</p>
              
              <div className="mt-4 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-green-600 mb-2">오늘의 추천 활동:</h3>
                <p className="text-gray-700 leading-relaxed">{suggestion}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherLifestylePage;
