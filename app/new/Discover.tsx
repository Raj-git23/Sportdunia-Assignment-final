import { DiscoverSkeleton } from "@/components/loading-skeleton";
import NewsCard from "@/components/news-card";
import SelectFilter, { FilterState } from "@/components/select-filter";
import { fetchNewsAPI } from "@/helper/action";
import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Funnel } from 'lucide-react';
import ErrorComponent from "@/components/error";

interface DiscoverProps {
  filter: string;
}

const Discover = ({ filter }: DiscoverProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [data, setData] = useState<any>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>();
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const isDiscoverPage = pathname.includes('/discover');

  // State for filters
  const [filters, setFilters] = useState<FilterState>({
    contentType: "",
    source: "",
    dateRange: undefined,
    sortBy: "",
  });

  const activeFilter = filter === "all" ? "" : filter;

  // Function to build query parameters for Guardian API
  const buildQueryParams = () => {
    const queryParams: any = {
      'page-size': 24,
      'show-fields': 'thumbnail,trailText,byline,publication,headline',
      'show-tags': 'contributor',
    };

    // Add search query
    if (activeFilter) {
      queryParams.q = activeFilter;
    }

    // Add section filter (Guardian equivalent of source)
    if (filters.source) {
      queryParams.section = filters.source;
    }

    // Add order by filter (Guardian uses 'order-by')
    if (filters.sortBy) {
      // Map common sort options to Guardian API format
      const sortMapping: { [key: string]: string } = {
        publishedAt: 'newest',
        relevancy: 'relevance',
        popularity: 'newest', // Guardian doesn't have popularity, default to newest
      };
      queryParams['order-by'] = sortMapping[filters.sortBy] || 'newest';
    } else {
      queryParams['order-by'] = 'newest'; // Default sort
    }

    // Add date range filter
    if (filters.dateRange?.from) {
      queryParams['from-date'] = format(filters.dateRange.from, "yyyy-MM-dd");
      if (filters.dateRange.to) {
        queryParams['to-date'] = format(filters.dateRange.to, "yyyy-MM-dd");
      }
    }

    // Add content type to search query if selected
    if (filters.contentType) {
      const currentQuery = queryParams.q || '';
      queryParams.q = currentQuery ? `${currentQuery} ${filters.contentType}` : filters.contentType;
    }

    return queryParams;
  };

  const fetchData = async () => {
    setLoading(true);
    setError(undefined);

    try {
      const queryParams = buildQueryParams();

      // Guardian API endpoint is 'search' instead of 'everything'
      const res = await fetchNewsAPI({
        type: "get",
        endpoint: "search",
        query: queryParams,
      });

      // Guardian API response structure is different
      if (res?.data?.response?.status === "ok") {
        setData(res?.data?.response?.results);
      } else {
        setError("Failed to fetch news from Guardian API");
      }
    } catch (error: any) {
      console.error("API Error:", error);
      setError(error.message || "Failed to fetch news");
    } finally {
      setLoading(false);
    }
  };

  // Handle filter changes
  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
  };

  // Effect to fetch data when filter or filters change
  useEffect(() => {
    fetchData();
  }, [filter, filters]);


  if (error) {
    return (
      <ErrorComponent error={error} handleError={fetchData} />
    );
  }

  // console.log(data)
  return (
    <main className="mb-4">
      <span className="flex w-full justify-between mb-2 items-center">
        <span className="text-2xl font-bold">Discover</span>
        <span className="text-gray-500 text-sm pt-3 cursor-pointer">
          {isDiscoverPage ? (
            <>
              <div className="hidden lg:flex">
                <SelectFilter
                  filters={filters}
                  onFiltersChange={handleFiltersChange}
                />
              </div>
              <Button
                variant="link"
                className="py-1 border-2 px-0.5 h-fit w-fit flex lg:hidden"
                onClick={() => setIsFilterOpen((prev) => !prev)}
              >
                <Funnel /> Filters
              </Button>
            </>
          ) : (
            <Button variant="ghost" onClick={() => router.push("/discover")}>
              See More...
            </Button>
          )}
        </span>
      </span>


      {isFilterOpen && <div className="pb-1"> <SelectFilter filters={filters} onFiltersChange={handleFiltersChange} /> </div>}


      {loading ? (
        <DiscoverSkeleton />
      ) : data && data.length > 0 ? (
        <div className="w-full flex flex-wrap gap-4 space-y-4 md:space-y-8">
          {data.map((article: any, idx: number) => (
            <NewsCard key={idx} article={article} />
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">
            No articles found matching your criteria.
          </p>
        </div>
      )}
    </main>
  );
};

export default Discover;