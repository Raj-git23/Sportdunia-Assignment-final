"use client"
import React from 'react'
import Discover from './Discover'
import { ScrollArea } from '@/components/ui/scroll-area'
import RecentNews from './RecentNews'
import Filters from './Filters'
import TrendingNews from './TrendingNews'
import { FilterProvider, useFilter } from '@/contexts/filter-context'

// Inner component that uses the context
const PageContent = () => {
  const { activeFilter } = useFilter()

  return (
    <main className='max-h-screen'>
      <div className='flex items-center justify-center mt-6 border-b-2 pb-4'>
        <Filters />
      </div>
      <div className="flex w-full h-screen">
        <ScrollArea className='w-2/3 h-full px-8'>
          <Discover filter={activeFilter} />
        </ScrollArea>

        <div className="flex flex-col w-1/3 gap-6 h-full pb-4 px-4 overflow-auto">
          <RecentNews filter={activeFilter} />
          <TrendingNews />
        </div>
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