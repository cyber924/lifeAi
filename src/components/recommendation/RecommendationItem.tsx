'use client';

import Image from 'next/image';

interface RecommendationItemProps {
  id: string;
  title: string;
  location: string;
  image: string;
  price: string;
}

export default function RecommendationItem({
  id,
  title,
  location,
  image,
  price,
}: RecommendationItemProps) {
  return (
    <div className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
      <div className="relative h-48 bg-gray-200">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          priority={false}
        />
      </div>
      <div className="p-4">
        <h3 className="font-bold text-lg line-clamp-2 h-14">{title}</h3>
        <p className="text-gray-600 text-sm mt-1">{location}</p>
        <p className="font-semibold text-primary mt-2">{price}</p>
      </div>
    </div>
  );
}
