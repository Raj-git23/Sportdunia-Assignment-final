"use client"
import React, { createContext, useContext, useState, ReactNode } from 'react'

// Define the filter context type
interface FilterContextType {
  activeFilter: string
  setActiveFilter: (filter: string) => void
  handleFilterChange: (filter: string) => void
}

// Create the context with default values
const FilterContext = createContext<FilterContextType | undefined>(undefined)

// Provider component props
interface FilterProviderProps {
  children: ReactNode
  defaultFilter?: string
}

// Filter Provider component
export const FilterProvider = ({ children, defaultFilter = "all" }: FilterProviderProps) => {
  const [activeFilter, setActiveFilter] = useState<string>(defaultFilter)

  const handleFilterChange = (selectedFilter: string) => {
    setActiveFilter(selectedFilter)
  }

  const value: FilterContextType = {
    activeFilter,
    setActiveFilter,
    handleFilterChange,
  }

  return (
    <FilterContext.Provider value={value}>
      {children}
    </FilterContext.Provider>
  )
}

// Custom hook to use the filter context
export const useFilter = (): FilterContextType => {
  const context = useContext(FilterContext)
  
  if (context === undefined) {
    throw new Error('useFilter must be used within a FilterProvider')
  }
  
  return context
}

// Export the context for advanced use cases
export { FilterContext }