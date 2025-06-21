import { BuildingOffice2Icon, CurrencyDollarIcon, StarIcon, WifiIcon, MapPinIcon } from '@heroicons/react/24/solid';

interface Amenity {
  name: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

interface AccommodationContent {
  name: string;
  address: string;
  priceRange: string;
  rating: number;
  amenities: string[];
  description: string;
}

interface Recommendation {
  fullContent: AccommodationContent;
}

const amenityIcons: { [key: string]: React.ComponentType<React.SVGProps<SVGSVGElement>> } = {
  'WiFi': WifiIcon,
  // Add other amenities and their icons here
};

export function AccommodationTemplate({ recommendation }: { recommendation: Recommendation | { fullContent: AccommodationContent } }) {
  const { fullContent } = recommendation;

  if (!fullContent) {
    return null;
  }

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">숙소 정보</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="flex items-center mb-4">
            <BuildingOffice2Icon className="h-8 w-8 text-purple-600 mr-3" />
            <h3 className="text-xl font-bold text-gray-900">{fullContent.name}</h3>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-5 w-5 mr-2" />
            <span>{fullContent.address}</span>
          </div>
          <div className="flex items-center text-gray-600 mb-2">
            <CurrencyDollarIcon className="h-5 w-5 mr-2" />
            <span>{fullContent.priceRange}</span>
          </div>
          <div className="flex items-center text-yellow-500 mb-4">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} className={`h-5 w-5 ${i < fullContent.rating ? 'text-yellow-400' : 'text-gray-300'}`} />
            ))}
            <span className="text-gray-600 ml-2">({fullContent.rating.toFixed(1)})</span>
          </div>
          <p className="text-base text-gray-700">{fullContent.description}</p>
        </div>

        <div>
          <h4 className="text-lg font-semibold text-gray-800 mb-4">주요 편의시설</h4>
          <ul className="space-y-3">
            {fullContent.amenities.map((amenity, index) => {
              const Icon = amenityIcons[amenity] || StarIcon; // Default icon
              return (
                <li key={index} className="flex items-center">
                  <Icon className="h-6 w-6 text-green-500 mr-3" />
                  <span className="text-base text-gray-700">{amenity}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
