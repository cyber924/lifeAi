// c:\lifeAi\src\components\ContentCard.tsx

import React from 'react';
import Image from 'next/image';
import { LifeAiContent } from '../types';

interface ContentCardProps {
  content: LifeAiContent;
}

const ContentCard: React.FC<ContentCardProps> = ({ content }) => {
  // 이미지가 없을 경우를 대비한 기본 이미지 경로
  const imageUrl = content.images && content.images.length > 0 ? content.images[0] : '/images/placeholder.png';

  return (
    <div className="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="relative w-full h-48">
        <Image
          src={imageUrl}
          alt={content.name}
          layout="fill"
          objectFit="cover"
        />
      </div>
      <div className="px-6 py-4">
        <div className="font-bold text-xl mb-2 truncate">{content.name}</div>
        <p className="text-gray-700 text-base h-20 overflow-hidden text-ellipsis">
          {content.description}
        </p>
      </div>
      <div className="px-6 pt-4 pb-2">
        <span className="inline-block bg-blue-100 text-blue-800 rounded-full px-3 py-1 text-sm font-semibold mr-2 mb-2">
          #{content.category}
        </span>
        {content.tags?.slice(0, 2).map((tag) => (
          <span
            key={tag}
            className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2"
          >
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default ContentCard;
