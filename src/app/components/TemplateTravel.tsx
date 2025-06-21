import { MapPinIcon, LightBulbIcon } from '@heroicons/react/24/solid';

// Define types for the specific travel data structure
interface ItineraryItem {
  day: number;
  place: string;
  activity: string;
}

// Type for the actual content (itinerary and tips)
interface TravelContent {
  itinerary?: ItineraryItem[];
  tips?: string[];
}

// Original Recommendation type, assuming content is nested
interface Recommendation {
  fullContent: TravelContent;
}

// A helper function to group itinerary items by day
function groupItineraryByDay(itinerary: ItineraryItem[]) {
  return itinerary.reduce((acc, item) => {
    const day = `Day ${item.day}`;
    if (!acc[day]) {
      acc[day] = [];
    }
    acc[day].push(item);
    return acc;
  }, {} as Record<string, ItineraryItem[]>);
}

export function TravelTemplate({ recommendation }: { recommendation: Recommendation | TravelContent }) {
  let dataToRender: TravelContent | undefined | null = null;

  // Check if recommendation has fullContent (nested structure)
  if (recommendation && 'fullContent' in recommendation && (recommendation as Recommendation).fullContent) {
    dataToRender = (recommendation as Recommendation).fullContent;
  } 
  // Check if recommendation itself is the content (flat structure)
  else if (recommendation && ('itinerary' in recommendation || 'tips' in recommendation)) {
    dataToRender = recommendation as TravelContent;
  }

  // If no valid data structure is found, or if it's empty, render nothing
  if (!dataToRender || (!dataToRender.itinerary && !dataToRender.tips)) {
    return null;
  }

  // Parse itinerary and tips if they are strings
  if (typeof dataToRender.itinerary === 'string') {
    try {
      dataToRender.itinerary = JSON.parse(dataToRender.itinerary);
    } catch (e) {
      console.error('Failed to parse itinerary:', e);
      dataToRender.itinerary = [];
    }
  }

  if (typeof dataToRender.tips === 'string') {
    try {
      dataToRender.tips = JSON.parse(dataToRender.tips);
    } catch (e) {
      console.error('Failed to parse tips:', e);
      dataToRender.tips = [];
    }
  }

  const groupedItinerary = dataToRender.itinerary ? groupItineraryByDay(dataToRender.itinerary) : {};

  return (
    <div className="border-t border-gray-200 pt-8 mt-8">
      {Object.entries(groupedItinerary).map(([day, items]) => (
        <div key={day} className="mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">{day} 상세 일정</h2>
          <div className="flow-root">
            <ul className="-mb-8">
              {items.map((item, index) => (
                <li key={index}>
                  <div className="relative pb-8">
                    {index !== items.length - 1 ? (
                      <span className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200" aria-hidden="true" />
                    ) : null}
                    <div className="relative flex items-start space-x-4">
                      <div>
                        <span className="h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center ring-8 ring-white">
                          <MapPinIcon className="h-5 w-5 text-purple-600" aria-hidden="true" />
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-base font-semibold text-gray-800">
                          {item.place}
                        </div>
                        <div className="mt-2 text-base text-gray-600">
                          <p>{item.activity}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      ))}

      {dataToRender.tips && dataToRender.tips.length > 0 && (
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">알아두면 좋은 팁!</h2>
          <ul className="space-y-4">
            {dataToRender.tips.map((tip, index) => (
              <li key={index} className="flex items-start space-x-3">
                <div className="flex-shrink-0 pt-1">
                  <LightBulbIcon className="h-6 w-6 text-yellow-500" />
                </div>
                <p className="text-base text-gray-700">{tip}</p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

