import ErrorComponent from "@/components/error";
import HorizontalNewsCard from "@/components/horizontal-news-card";
import { LatestNewsSkeleton } from "@/components/loading-skeleton";
import { fetchNewsAPI } from "@/helper/action";
import { getTodaysDate } from "@/helper/formatTime";
import React, { useEffect, useState } from "react";

interface RecentNewsProps {
  filter: string;
}

const RecentNews = ({ filter }: RecentNewsProps) => {
  const date = getTodaysDate();

  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const activeFilter = filter === "all" ? "world" : filter;

  const fetchData = async () => {
    setLoading(true);
    setError(undefined);

    try {
      
      const res = await fetchNewsAPI({
        type: "get",
        // endpoint: "search",
        query: {
          q: activeFilter,
          'page-size': 4,
          'order-by': 'newest',
          'show-fields': 'thumbnail,trailText,byline,publication,headline',
          'show-tags': 'contributor',
          'from-date': new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // Last 7 days
        },
      });

      // Guardian API response structure
      if (res?.data?.response?.status === "ok" && res?.data?.response?.total > 0) {
        setData(res?.data?.response?.results);
      } else {
        setData([]);
      }

    } catch (error: any) {
      console.error("API Error:", error);
      setError(error?.message || "Failed to fetch latest news");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [filter]);

  if(loading) return <LatestNewsSkeleton />
  if(error) return <ErrorComponent error={error} handleError={fetchData} />

  return (
    <div className="space-y-1.5">
      <span className="flex justify-between px-2">
        <p className="font-semibold text-lg">Latest News</p>
        <p className="text-sm text-gray-500">See More...</p>
      </span>

      <div>
        <HorizontalNewsCard data={data} />
      </div>
    </div>
  );
};

export default RecentNews;