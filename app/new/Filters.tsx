import { Button } from '@/components/ui/button'
import { useFilter } from '@/contexts/filter-context'
import React from 'react'

// Remove the onFilterChange prop since we're using context now
const Filters = () => {
  const { activeFilter, handleFilterChange } = useFilter()

  const filters = [
    'all',
    'technology',
    'world',
    'politics',
    'sports',
    'business',
    'science',
    'health',
    'entertainment',
    'general'
  ]

  return (
    <div className="flex flex-wrap gap-3 px-2 mx-auto justify-center">
      {filters.map((filter) => (
        <button
          key={filter}
          onClick={() => handleFilterChange(filter)}
          className={`px-2 py-1 md:px-4 md:py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
            activeFilter === filter
              ? 'bg-black text-white'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          }`}
        >
          {filter.charAt(0).toUpperCase() + filter.slice(1)}
        </button>
      ))}
    </div>
  )
}

export default Filters