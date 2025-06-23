"use client"
import React from 'react'
import Discover from '../new/Discover'
import { FilterProvider, useFilter } from '@/contexts/filter-context'
import Filters from '../new/Filters'
import SelectFilter from '@/components/select-filter'

const PageContent = () => {
    const {activeFilter} = useFilter();
  return (
    <main className='px-4 lg:px-10 lg:py-6 w-full'>
      <div className='flex items-center justify-center mt-6 border-b-2 pb-4'>
        <Filters />
      </div>
      {/* <SelectFilter /> */}
      <Discover filter={activeFilter} />
    </main>
  )
}

const Page = () => {
  return (
    <FilterProvider defaultFilter="all">
      <PageContent />
    </FilterProvider>
  )
}

export default Page
