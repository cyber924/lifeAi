import { CameraIcon, ClockIcon, TicketIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface AttractionContent {
  name: string;
  address: string;
  operatingHours: string;
  admissionFee: string;
  photoSpots: string[];
  description: string;
}

interface Recommendation {
  fullContent: AttractionContent;
}

export function AttractionTemplate({ recommendation }: { recommendation: Recommendation | { fullContent: AttractionContent } }) {
  const { fullContent } = recommendation;

  if (!fullContent) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">명소 정보</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <MapPinIcon className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">{fullContent.name}</h3>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <ClockIcon className="h-5 w-5 mr-2" />
            <span>운영 시간: {fullContent.operatingHours}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-4">
            <TicketIcon className="h-5 w-5 mr-2" />
            <span>입장료: {fullContent.admissionFee}</span>
          </div>
          <p className="text-base text-gray-700 mb-6">{fullContent.description}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">추천 포토 스팟</h4>
          <ul className="space-y-3">
            {fullContent.photoSpots.map((spot, index) => (
              <li key={index} className="flex items-center">
                <CameraIcon className="h-6 w-6 text-green-500 mr-3" />
                <span className="text-base text-gray-700">{spot}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
