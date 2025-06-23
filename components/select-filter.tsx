"use client";

import React, { useState } from "react";
import { Calendar as CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { DateRange } from "react-day-picker";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

// Types for the filters
export interface FilterState {
  contentType: string;
  source: string;
  dateRange: DateRange | undefined;
  sortBy: string;
}

interface SelectFilterProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

const SelectFilter = ({ filters, onFiltersChange }: SelectFilterProps) => {
  const [openComboboxes, setOpenComboboxes] = useState({
    contentType: false,
    source: false,
    sortBy: false,
  });

  // Content type options
  const contentTypes = [
    { value: "news", label: "News" },
    { value: "blog", label: "Blog" },
    { value: "post", label: "Post" },
    { value: "article", label: "Article" },
    { value: "opinion", label: "Opinion" },
    { value: "review", label: "Review" },
    { value: "interview", label: "Interview" },
  ];

  // Source options
  const sources = [
    { value: "bbc-news", label: "BBC News" },
    { value: "cnn", label: "CNN" },
    { value: "reuters", label: "Reuters" },
    { value: "associated-press", label: "Associated Press" },
    { value: "the-guardian-uk", label: "The Guardian" },
    { value: "the-new-york-times", label: "New York Times" },
    { value: "the-wall-street-journal", label: "Wall Street Journal" },
    { value: "techcrunch", label: "TechCrunch" },
    { value: "the-verge", label: "The Verge" },
    { value: "medium", label: "Medium" },
  ];

  // Sort by options
  const sortByOptions = [
    { value: "publishedAt", label: "Newest First" },
    { value: "relevancy", label: "Most Relevant" },
    { value: "popularity", label: "Most Popular" },
  ];

  const handleFilterChange = (
    filterType: keyof Omit<FilterState, "dateRange">,
    value: string
  ) => {
    const newFilters = {
      ...filters,
      [filterType]: value === filters[filterType] ? "" : value,
    };
    onFiltersChange(newFilters);
    setOpenComboboxes((prev) => ({ ...prev, [filterType]: false }));
  };

  const handleDateRangeSelect = (dateRange: DateRange | undefined) => {
    const newFilters = {
      ...filters,
      dateRange,
    };
    onFiltersChange(newFilters);
  };

  const clearAllFilters = () => {
    const clearedFilters: FilterState = {
      contentType: "",
      source: "",
      dateRange: undefined,
      sortBy: "",
    };
    onFiltersChange(clearedFilters);
  };

  const hasActiveFilters =
    filters.contentType ||
    filters.source ||
    filters.dateRange ||
    filters.sortBy;

  return (
    <div className="flex gap-2 py-2">
      <div className="flex flex-wrap gap-2 ml-auto">
        {/* Content Type Filter */}
        <div className="flex flex-col space-y-2">
          <Popover
            open={openComboboxes.contentType}
            onOpenChange={(open) =>
              setOpenComboboxes((prev) => ({ ...prev, contentType: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openComboboxes.contentType}
                className="w-32 justify-between text-xs h-fit"
              >
                {filters.contentType
                  ? contentTypes.find(
                      (type) => type.value === filters.contentType
                    )?.label
                  : "Select type..."}
                <ChevronsUpDown className="ml-0 h-3 w-3 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-33 p-0">
              <Command>
                <CommandInput placeholder="Search content type..." className="text-xs"/>
                <CommandEmpty>No content type found.</CommandEmpty>
                <CommandGroup>
                  {contentTypes.map((type) => (
                    <CommandItem
                      key={type.value}
                      value={type.value}
                      onSelect={() =>
                        handleFilterChange("contentType", type.value)
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          filters.contentType === type.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <p className="text-xs">{type.label}</p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Source Filter */}
        <div className="flex flex-col space-y-2">
          <Popover
            open={openComboboxes.source}
            onOpenChange={(open) =>
              setOpenComboboxes((prev) => ({ ...prev, source: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openComboboxes.source}
                className="w-36 justify-between text-xs h-fit"
              >
                {filters.source
                  ? sources.find((source) => source.value === filters.source)
                      ?.label
                  : "Select source..."}
                <ChevronsUpDown className="ml-0 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-44 p-0">
              <Command>
                <CommandInput placeholder="Search source..." className="text-xs"/>
                <CommandEmpty>No source found.</CommandEmpty>
                <CommandGroup>
                  {sources.map((source) => (
                    <CommandItem
                      key={source.value}
                      value={source.value}
                      onSelect={() =>
                        handleFilterChange("source", source.value)
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          filters.source === source.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <p className="text-xs">{source.label}</p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Sort By Filter */}
        <div className="flex flex-col space-y-2">
          <Popover
            open={openComboboxes.sortBy}
            onOpenChange={(open) =>
              setOpenComboboxes((prev) => ({ ...prev, sortBy: open }))
            }
          >
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openComboboxes.sortBy}
                className="w-32 justify-between text-xs h-fit"
              >
                {filters.sortBy
                  ? sortByOptions.find(
                      (option) => option.value === filters.sortBy
                    )?.label
                  : "Sort by"}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-36 p-0">
              <Command>
                <CommandInput placeholder="Search sort option..." className="text-xs"/>
                <CommandEmpty>No sort option found.</CommandEmpty>
                <CommandGroup>
                  {sortByOptions.map((option) => (
                    <CommandItem
                      key={option.value}
                      value={option.value}
                      onSelect={() =>
                        handleFilterChange("sortBy", option.value)
                      }
                    >
                      <Check
                        className={cn(
                          "mr-2 h-3 w-3",
                          filters.sortBy === option.value
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      <p className="text-xs">{option.label}</p>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>

        {/* Date Range Filter */}
        <div className="flex flex-col space-y-2">
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-48 justify-start text-left font-normal text-xs h-fit"
              >
                <CalendarIcon className="h-3 w-3" />
                {filters.dateRange?.from ? (
                  filters.dateRange.to ? (
                    <>
                      {format(filters.dateRange.from, "LLL dd, y")} -{" "}
                      {format(filters.dateRange.to, "LLL dd, y")}
                    </>
                  ) : (
                    format(filters.dateRange.from, "LLL dd, y")
                  )
                ) : (
                  "Pick a date range"
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                initialFocus
                mode="range"
                defaultMonth={filters.dateRange?.from}
                selected={filters.dateRange}
                onSelect={handleDateRangeSelect}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>
      </div>

      {/* Clear Filters Button */}
      {hasActiveFilters && (
        <div className="flex justify-start">
          <Button
            variant="ghost"
            onClick={clearAllFilters}
            className="text-xs px-1"
          >
            Clear All
          </Button>
        </div>
      )}

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {filters.contentType && (
            <span className="inline-flex items-center p-2 rounded-md text-xs font-medium bg-blue-100 text-blue-800">
              {contentTypes.find((t) => t.value === filters.contentType)?.label}
            </span>
          )}
          {filters.source && (
            <span className="inline-flex items-center p-2 h-fit rounded-md text-xs font-medium bg-green-100 text-green-800">
              {sources.find((s) => s.value === filters.source)?.label}
            </span>
          )}
          {filters.sortBy && (
            <span className="inline-flex items-center p-2 rounded-md text-xs font-medium bg-purple-100 text-purple-800">
              {sortByOptions.find((s) => s.value === filters.sortBy)?.label}
            </span>
          )}
          {filters.dateRange && (
            <span className="inline-flex items-center p-2 rounded-md text-xs font-medium bg-orange-100 text-orange-800">
              Date Range Selected
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default SelectFilter;