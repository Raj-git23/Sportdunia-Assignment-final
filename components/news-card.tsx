import { Button } from "@/components/ui/button";
import { formatTime } from "@/helper/formatTime";
import React from "react";

interface NewsCardProps {
  article: any;
}

const NewsCard: React.FC<NewsCardProps> = ({ article }) => {
  const handleCardClick = () => {
    window.open(article?.webUrl, "_blank");
  };

  const handleReadMoreClick = (e: React.MouseEvent) => {
    e.stopPropagation(); 
    window.open(article?.webUrl, "_blank");
  };

  return (
    <div
      className="w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)] cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="bg-white rounded-lg relative overflow-hidden duration-300 h-full flex flex-col">
        {/* Image Section */}
        <div className="relative h-44 overflow-hidden">
          <img
            src={article?.fields?.thumbnail ?? "/n.jpg"}
            alt={article?.webTitle}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300 rounded-md"
          />
        </div>

        <p className="absolute top-2 right-2 z-20 px-2 py-1 bg-white/90 text-black font-bold capitalize text-xs rounded-2xl">{article?.type}</p>
        {/* Content Section */}
        <div className="p-1 font-sans flex flex-col gap-1 flex-grow">
          {/* Source and Timestamp */}
          <span className="flex items-end justify-between space-x-2 mt-2 text-sm font-medium text-gray-500">
            <span>{article?.pillarName}</span>
            <span className="text-xs text-gray-400">{formatTime(article?.webPublicationDate)}</span>
          </span>

          {/* Title */}
          <h3 className="font-bold text-lg leading-tight my-1 text-gray-900 hover:text-blue-600 cursor-pointer transition-colors line-clamp-2">
            {article?.webTitle}
          </h3>

          {/* Description */}
          <p className="text-gray-600 text-xs leading-4 flex-grow line-clamp-1">
            {article?.fields?.trailText}
          </p>

          {/* Footer with Read Time */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <span className="text-xs text-gray-700 font-medium line-clamp-1">
              <a href={article?.fields?.publication}>{article?.fields?.publication || ""}</a>
            </span>
            <Button 
              className="text-xs bg-transparent hover:bg-transparent text-blue-500 font-medium transition-colors" 
              onClick={handleReadMoreClick}
            >
              Read more...
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewsCard;