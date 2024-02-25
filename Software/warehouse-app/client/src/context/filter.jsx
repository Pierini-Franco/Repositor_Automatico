import { createContext, useState } from "react";
// 1 crear contexto
export const FilterContext = createContext()
// 2 crear provider
export function FilterProvider({ children }){
  const [filters, setFilters] = useState({
    category: 'all'
  })
  
  return(
    <FilterContext.Provider value={{
      filters,
      setFilters
    }}>
      {children}
    </FilterContext.Provider>
  )
}