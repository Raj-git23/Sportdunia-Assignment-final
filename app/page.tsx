"use client"
import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'

import { FilterProvider, useFilter } from '@/contexts/filter-context'
import Filters from './new/Filters'
import Discover from './new/Discover'
import RecentNews from './new/RecentNews'
import TrendingNews from './new/TrendingNews'
import { useAuth } from '@/contexts/auth-context'

// Inner component that uses the context
const PageContent = () => {
  const { activeFilter } = useFilter();
  const { user, logout, isAdmin } = useAuth();

  return (
    <main className='h-full flex flex-col' style={{"height": "calc(100dvh - 134px)"}}>
      {/* Fixed header */}
      <div className='flex items-center justify-center mt-2 md:mt-6 border-b-2 pb-1.5 px-2 md:pb-4 flex-shrink-0'>
        <Filters />
      </div>
      
      {/* Scrollable content area */}
      <div className="flex flex-col-reverse lg:flex-row lg:w-screen flex-1 gap-6 lg:gap-0 pt-4 md:px-10 lg:px-0 lg:max-h-full">
        {/* Left scrollable area */}
        <div className="lg:w-2/3">
          <ScrollArea className="h-full px-4">
            <Discover filter={activeFilter} />
          </ScrollArea>
        </div>

        {/* Right fixed area */}
        <ScrollArea className="flex flex-col lg:w-1/3 gap-6 lg:gap-2 px-2">
          
          <div className="flex-shrink-0">
            <TrendingNews />
          </div>

          <div className="flex-shrink-0 mt-4">
            <RecentNews filter={activeFilter} />
          </div>

        </ScrollArea>
      </div>
    </main>
  )
}

// Main Page component wrapped with Provider
const Page = () => {
  return (
    <FilterProvider defaultFilter="all">
      <PageContent />
    </FilterProvider>
  )
}

export default Page