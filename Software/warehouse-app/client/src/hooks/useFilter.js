import { useContext } from "react";
import { FilterContext } from "../context/filter.jsx";

export function useFilter(){
  const {filters, setFilters} = useContext(FilterContext)

  const filterProducts = (products) => {
    return products.filter(product =>{ // product almacena el valor de products
      return(
        product.category === filters.category || filters.category === 'all'
      )
    })
  }
  return{ filters, setFilters, filterProducts }
}