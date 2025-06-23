"use client";
import React, { useEffect, useState, useRef } from "react";
import { Input } from "./ui/input";
import { useRouter } from "next/navigation";
import { fetchNewsAPI } from "@/helper/action";
import {
  Search as SearchIcon,
  Clock,
  ExternalLink,
  Loader2,
} from "lucide-react";
import ErrorComponent from "./error";

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

const Search = () => {
  const router = useRouter();
  const [searchValue, setSearchValue] = useState("");
  const [data, setData] = useState<GuardianData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!searchValue.trim()) {
        setData(null);
        setShowDropdown(false);
        return;
      }

      try {
        setLoading(true);
        setError("");

        const res = await fetchNewsAPI({
          type: "get",
          endpoint: "search",
          query: {
            q: searchValue,
            'page-size': 5,
            'order-by': 'newest',
            'show-fields': 'thumbnail,trailText,byline,publication,headline',
            'show-tags': 'contributor',
          },
        });

        if (res?.data?.response?.status === "ok") {
          setData(res.data);
          setShowDropdown(true);
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

    // Debounce the API call
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(() => {
      fetchData();
    }, 300); // Wait 300ms after user stops typing

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [searchValue]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (searchValue.trim()) {
      setShowDropdown(false);
      router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
    }

    console.log("Search submitted:", searchValue);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(e.target.value);
  };

  const handleArticleClick = (url: string) => {
    setShowDropdown(false);
    window.open(url, "_blank");
  };

  const handleSeeAllResults = () => {
    setShowDropdown(false);
    router.push(`/search?q=${encodeURIComponent(searchValue.trim())}`);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor(
      (now.getTime() - date.getTime()) / (1000 * 60 * 60)
    );

    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if(error) return <ErrorComponent error={error} />

  return (
    <div className="relative w-full max-w-2xl" ref={searchRef}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 md:w-5 md:h-5" />
          <Input
            type="text"
            placeholder="Search news..."
            value={searchValue}
            onChange={handleInputChange}
            onFocus={() =>
              data && data.response.results.length > 0 && setShowDropdown(true)
            }
            className="w-full sm:min-w-xs lg:min-w-lg pl-8 md:pl-10 pr-4 md:py-3 text-xs sm:text-base h-fit border-2 border-gray-200 rounded-md focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
          />
          {loading && (
            <Loader2 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 animate-spin" />
          )}
        </div>

        {/* Dropdown Results */}
        {showDropdown && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-xl z-50 max-h-96 overflow-y-auto">
            {loading && (
              <div className="p-4 text-center">
                <Loader2 className="w-6 h-6 animate-spin mx-auto mb-2 text-blue-500" />
                <p className="text-gray-500 text-sm">Searching...</p>
              </div>
            )}

            {error && (
              <div className="p-4 text-center">
                <p className="text-red-500 text-sm">{error}</p>
              </div>
            )}

            {data && data.response && data.response.results && data.response.results.length > 0 && (
              <>
                <div className="p-3 border-b border-gray-100">
                  <p className="text-sm text-gray-500">
                    Found {data.response.total.toLocaleString()} results
                  </p>
                </div>

                <div className="py-2">
                  {data.response.results.map((article, index) => (
                    <div
                      key={article.id || index}
                      onClick={() => handleArticleClick(article.webUrl)}
                      className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-50 last:border-b-0 transition-colors"
                    >
                      <div className="flex gap-3">
                        {article.fields?.thumbnail && (
                          <img
                            src={article.fields.thumbnail}
                            alt={article.webTitle}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <h4 className="font-medium text-gray-900 text-sm line-clamp-2 mb-1">
                            {article.webTitle}
                          </h4>
                          {article.fields?.trailText && (
                            <p className="text-gray-600 text-xs line-clamp-2 mb-2">
                              {article.fields.trailText}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>{article.sectionName}</span>
                            <span>•</span>
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {formatTimeAgo(article.webPublicationDate)}
                            </div>
                            <ExternalLink className="w-3 h-3 ml-auto" />
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={handleSeeAllResults}
                    className="w-full text-center text-blue-600 hover:text-blue-800 font-medium text-sm py-2 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    See all results for &quot;{searchValue}&quot;
                  </button>
                </div>
              </>
            )}

            {data &&
              data.response &&
              data.response.results &&
              data.response.results.length === 0 &&
              !loading && (
                <div className="p-8 text-center">
                  <SearchIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500 text-sm">
                    No results found for &quot;{searchValue}&quot;
                  </p>
                  <p className="text-gray-400 text-xs mt-1">
                    Try different keywords
                  </p>
                </div>
              )}
          </div>
        )}
      </form>
    </div>
  );
};

export default Search;