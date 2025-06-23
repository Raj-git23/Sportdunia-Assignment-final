import { formatTime } from '@/helper/formatTime';
import Image from 'next/image';
import React from 'react'

const TrendingNewsCard = ({ data }: any) => {
  const onClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent triggering the card click
    window.open(data?.webUrl, "_blank");
  };

  return (
    <div 
      className="relative rounded-md overflow-hidden cursor-pointer h-64 md:h-72 group"
      onClick={onClick}
    >
      {/* Background Image - Full container */}
      <img
        src={data?.fields?.thumbnail ?? "/n.jpg"}
        alt={data?.webTitle}
        className="absolute inset-0 w-full h-full object-cover transition-transform duration-300 group-hover:scale-105 rounded-md"
      />
      
      {/* Gradient Overlay - Contained within the image bounds */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent rounded-md" />

      <p className="absolute top-3 right-3 z-20 px-2 py-1 bg-white/90 text-black font-bold capitalize text-sm rounded-2xl">{data?.type}</p>

      {/* Content Overlay - Positioned within container */}
      <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
        {/* Category and Time */}
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xs font-medium bg-white/20 backdrop-blur-sm px-2 py-1 rounded">
            {data?.pillarName}
          </span>
          <span className="text-xs opacity-80">
            {formatTime(data?.webPublicationDate)}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm md:text-base font-semibold leading-tight line-clamp-3 group-hover:text-blue-200 transition-colors">
          {data?.webTitle}
        </h3>
      </div>

      {/* Hover Effect Overlay - Contained within bounds */}
      <div className="absolute inset-0 bg-blue-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg" />
    </div>
  )
}

export default TrendingNewsCard