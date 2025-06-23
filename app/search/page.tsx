"use client";
import NewsCard from "@/components/news-card";
import { fetchNewsAPI } from "@/helper/action";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState, Suspense } from "react";
import { Search, AlertCircle, Loader2, SearchIcon } from "lucide-react";

interface GuardianArticle {
  id: string;
  webTitle: string;
  webUrl: string;
  webPublicationDate: string;
  sectionName: string;
  fields?: {
    thumbnail?: string;
    trailText?: string;
    byline?: string;
    headline?: string;
  };
}

interface GuardianResponse {
  status: string;
  total: number;
  results: GuardianArticle[];
}

interface GuardianData {
  response: GuardianResponse;
}

const SearchResults = () => {
  const params = useSearchParams();
  const searchParams = params.get("q");
  const [data, setData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      if (!searchParams) return;

      try {
        setLoading(true);
        setError("");

        const res = await fetchNewsAPI({
          type: "get",
          endpoint: "search",
          query: {
            q: searchParams,
            'page-size': 20,
            'order-by': 'newest',
            'show-fields': 'thumbnail,trailText,byline,publication,headline',
            'show-tags': 'contributor',
          },
        });

        if (res?.data?.response?.status === "ok") {
          setData(res.data);
        } else {
          setError("Failed to fetch results");
        }
        console.log(res);
      } catch (error: any) {
        setError(error?.message || "An error occurred");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchParams]);

  // Loading state
  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">
              Searching for &quot;{searchParams}&quot;...
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <AlertCircle className="w-12 h-12 mx-auto mb-4 text-red-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  // No search query
  if (!searchParams) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No search query
            </h2>
            <p className="text-gray-600">
              Please enter a search term to find news articles.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 md:py-8">
      {/* Search Header */}
      <div className="mb-8">
        <span className="flex items-center gap-2 md:gap-4 text-2xl font-bold text-gray-900 mb-2">
          <SearchIcon /> Search Results
        </span>
        <span className="flex flex-col sm:flex-row sm:items-center justify-between">
          <p className="text-gray-600">
            Showing results for:{" "}
            <span className="font-medium text-gray-800">&quot;{searchParams}&quot;</span>
          </p>
          {data && data.response && (
            <p className="text-sm text-gray-500 mt-1">
              {data.response.total.toLocaleString()} articles found
            </p>
          )}
        </span>
      </div>

      {/* Results */}
      {data && data.response && data.response.results && data.response.results.length > 0 ? (
        <div className="flex flex-wrap gap-4 space-y-2">
          {data.response.results.map((article, index) => (
            <NewsCard key={article.id || index} article={article} />
          ))}
        </div>
      ) : (
        <div className="flex items-center justify-center min-h-64">
          <div className="text-center">
            <Search className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              No results found
            </h2>
            <p className="text-gray-600">
              No articles found for &quot;{searchParams}&quot;. Try different
              keywords.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

const Page = () => {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center min-h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
};

export default Page;