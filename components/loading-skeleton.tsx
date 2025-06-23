import React from 'react'
import { Skeleton } from "@/components/ui/skeleton"

// Left side skeleton for Discover section
const DiscoverSkeleton = () => {
  return (
    <div className="space-y-6 w-full">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-24" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* Top row - 4 main articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom row - 4 additional articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-3">
            <Skeleton className="h-48 w-full rounded-lg" />
            <div className="space-y-2">
              <Skeleton className="h-3 w-20" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
              <div className="space-y-1">
                <Skeleton className="h-3 w-full" />
                <Skeleton className="h-3 w-2/3" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Right side skeleton for Latest News section
const LatestNewsSkeleton = () => {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-28" />
        <Skeleton className="h-4 w-20" />
      </div>

      {/* News items */}
      <div className="space-y-4">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="flex gap-3">
            {/* Image */}
            <Skeleton className="h-16 w-16 rounded-md flex-shrink-0" />
            
            {/* Content */}
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-4/5" />
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
                <Skeleton className="h-3 w-12" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Main loading skeleton component
const LoadingSkeleton = () => {
  return (
    <div className="container w-full px-4 py-6">
      {/* Filter tabs skeleton */}
      <div className="flex gap-2 mb-8 overflow-x-auto">
        {Array.from({ length: 9 }).map((_, index) => (
          <Skeleton key={index} className={`h-8 rounded-full px-4 py-2 ${
            index === 0 ? 'w-12' : 'w-20'
          }`} />
        ))}
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Left side - Discover section (3/4 width) */}
        <div className="lg:col-span-3">
          <DiscoverSkeleton />
        </div>

        {/* Right side - Latest News section (1/4 width) */}
        <div className="lg:col-span-1">
          <LatestNewsSkeleton />
        </div>
      </div>
    </div>
  )
}

// Single TrendingNewsCard skeleton
const TrendingNewsCardSkeleton = () => {
  return (
    <div className="relative rounded-md overflow-hidden h-64 md:h-72">
      {/* Background Image Skeleton */}
      <Skeleton className="absolute inset-0 w-full h-full rounded-md" />
      
      {/* Content Overlay Skeleton - Positioned at bottom */}
      <div className="absolute bottom-0 left-0 right-0 p-4 space-y-2">
        {/* Category and Time Row */}
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-16 rounded bg-white/20" />
          <Skeleton className="h-4 w-12 bg-white/20" />
        </div>

        {/* Title Lines */}
        <div className="space-y-1">
          <Skeleton className="h-4 w-full bg-white/20" />
          <Skeleton className="h-4 w-4/5 bg-white/20" />
          <Skeleton className="h-4 w-3/5 bg-white/20" />
        </div>
      </div>
    </div>
  )
}


// Export individual components for flexibility
export { DiscoverSkeleton, LatestNewsSkeleton, LoadingSkeleton, TrendingNewsCardSkeleton};