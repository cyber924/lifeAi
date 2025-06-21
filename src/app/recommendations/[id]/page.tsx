import { db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import Link from 'next/link';
import { notFound } from 'next/navigation';

// Import the new template components
import { TravelTemplate } from '@/app/components/TemplateTravel';
import { RestaurantTemplate } from '@/app/components/TemplateRestaurant';
import { ShoppingTemplate } from '@/app/components/TemplateShopping';
import { AccommodationTemplate } from '@/app/components/TemplateAccommodation';
import { AttractionTemplate } from '@/app/components/TemplateAttraction';

interface RecommendationDetailPageProps {
  params: {
    id: string;
  };
}

// Define a more specific type for our recommendation data
// This helps with type safety and autocompletion
interface Recommendation {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  category: '국내여행' | '맛집' | '쇼핑' | '숙소' | '명소' | string; // Allow other strings as a fallback
  tags?: string[];
  fullContent: any; // Keep `any` for flexibility for now
  // Add other fields as needed
}

// Server function to fetch data from Firestore
async function getRecommendation(id: string): Promise<Recommendation | null> {
  try {
    const docRef = doc(db, 'prepared_contents', id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      return null;
    }
    
    const data = docSnap.data();
    
    // Parse fullContent if it's a string
    if (data.fullContent && typeof data.fullContent === 'string') {
      try {
        data.fullContent = JSON.parse(data.fullContent);
      } catch (e) {
        console.error('Failed to parse fullContent:', e);
        data.fullContent = {}; // Set to empty object if parsing fails
      }
    }
    
    return {
      id: docSnap.id,
      ...data,
    } as Recommendation;

  } catch (error) {
    console.error("Error fetching document:", error);
    return null;
  }
}

// The "Switcher" component that decides which template to render
function DynamicTemplate({ recommendation }: { recommendation: Recommendation }) {
  // DEBUG: Log the category to the server console to check its value
  console.log(`[Debug] Rendering template for category: "${recommendation.category}"`);

  switch (recommendation.category) {
    case '여행':
      return <TravelTemplate recommendation={recommendation} />;
    case '맛집':
      return <RestaurantTemplate recommendation={recommendation} />;
    case '쇼핑':
      return <ShoppingTemplate recommendation={recommendation} />;
    case '숙소':
      return <AccommodationTemplate recommendation={recommendation} />;
    case '명소':
      return <AttractionTemplate recommendation={recommendation} />;
    default:
      // Fallback for unknown categories
      return (
        <div className="prose lg:prose-xl max-w-none border-t pt-6 mt-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">상세 정보</h2>
          <div className="bg-gray-50 p-4 rounded-md overflow-x-auto">
            <pre>{JSON.stringify(recommendation.fullContent, null, 2)}</pre>
          </div>
        </div>
      );
  }
}


export default async function RecommendationDetailPage({ params }: RecommendationDetailPageProps) {
  const recommendation = await getRecommendation(params.id);

  if (!recommendation) {
    notFound(); // Show 404 if data is not found
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <Link href="/" className="text-purple-600 hover:text-purple-800 transition-colors font-semibold">
            &larr; 홈으로 돌아가기
          </Link>
        </div>

        <article className="bg-white rounded-lg shadow-lg overflow-hidden">
          {recommendation.imageUrl && (
            <div className="relative h-64 md:h-96 w-full">
              <img
                src={recommendation.imageUrl}
                alt={recommendation.title}
                className="w-full h-full object-cover"
              />
            </div>
          )}
          <div className="p-6 sm:p-8">
            {recommendation.category && (
              <span className="inline-block bg-purple-100 text-purple-800 text-sm font-semibold px-3 py-1 rounded-full mb-4">
                {recommendation.category}
              </span>
            )}
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">{recommendation.title}</h1>
            <p className="text-lg text-gray-600 mb-6">{recommendation.description}</p>
            
            {recommendation.tags && recommendation.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                {recommendation.tags.map((tag: string) => (
                  <span key={tag} className="bg-gray-200 text-gray-700 text-xs font-medium px-2.5 py-1 rounded-full">
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Render the dynamic template based on category */}
            <DynamicTemplate recommendation={recommendation} />
            
          </div>
        </article>
      </div>
    </main>
  );
}
