import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = searchParams.get('lat');
  const lon = searchParams.get('lon');
  const apiKey = process.env.OPENWEATHERMAP_API_KEY;
  console.log('[Weather API Route] Loaded API Key:', apiKey); // Log the API key

  if (!lat || !lon) {
    return NextResponse.json(
      { error: 'Latitude and longitude are required' },
      { status: 400 }
    );
  }

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Weather API key is not configured' },
      { status: 500 }
    );
  }

  const weatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric&lang=kr`;

  try {
    const response = await fetch(weatherApiUrl, {
      next: { revalidate: 600 } // 10분마다 날씨 정보 갱신
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenWeatherMap API error:', errorData);
      return NextResponse.json(
        { error: 'Failed to fetch weather data', details: errorData },
        { status: response.status }
      );
    }

    const data = await response.json();

    // 필요한 정보만 추출하여 반환
    const weatherInfo = {
      temp: data.main.temp,
      feels_like: data.main.feels_like,
      humidity: data.main.humidity,
      weather: data.weather[0].main,
      description: data.weather[0].description,
      icon: `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`,
      city: data.name,
    };

    return NextResponse.json(weatherInfo);

  } catch (error) {
    console.error('Error fetching weather data:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}
