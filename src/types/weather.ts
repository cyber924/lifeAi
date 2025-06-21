export interface WeatherInfo {
  name: string;
  main: {
    temp: number;
    feels_like?: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
    sea_level?: number;
    grnd_level?: number;
  };
  weather: Array<{
    id: number;
    main: string;
    description: string;
    icon: string;
  }>;
  wind: {
    speed: number;
    deg: number;
    gust?: number;
  };
  visibility: number;
  dt: number;
  sys: {
    type?: number;
    id?: number;
    country: string;
    sunrise: number;
    sunset: number;
  };
  timezone: number;
  id: number;
  cod: number;
}

export interface CityWeatherData {
  name: string;
  weatherInfo: {
    name: string;
    main: {
      temp: number;
    };
    weather: Array<{
      description: string;
      icon: string;
    }>;
  } | null;
}

export interface WeatherResponse {
  name: string;
  main: {
    temp: number;
  };
  weather: Array<{
    description: string;
    icon: string;
  }>;
}
