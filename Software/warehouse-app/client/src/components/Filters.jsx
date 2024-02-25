import { useId } from "react"
import { useFilter } from "../hooks/useFilter.js"
import './Filters.css'

export function Filters(){
  const categoryFilterId = useId()
  const { setFilters } = useFilter()
  const handleChangeCategory = (event) =>{
    setFilters(prevState =>({
      ...prevState,
      category: event.target.value
    }))
  }

  return(
    <section>
      <div className="container-filters">
        <label className="label-categoryFilter" htmlFor={categoryFilterId}>Categoria: </label>
        <select name="category" id={categoryFilterId} onChange={handleChangeCategory}>
          <option value="all">Todos</option>
          <option value="screw">Tornillos</option>
          <option value="roller-bearing">Rulemanes</option>
          <option value="ceramic">Ceramicos</option>
          <option value="electric">Electrico</option>
        </select>
      </div>
    </section>
  )
}