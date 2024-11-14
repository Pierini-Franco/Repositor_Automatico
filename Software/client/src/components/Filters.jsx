import { useId } from "react";
import { useFilter } from "../hooks/useFilter.js";
import './Filters.css';
import { categoryOptions } from "../data/CategoryOptions.jsx";

export function Filters(){
  const categoryFilterId = useId();
  const { filters, setFilters } = useFilter(); // Asegúrate de que `filters` está siendo devuelto por `useFilter`

  const handleChangeCategory = (event) => {
    setFilters(prevState => ({
      ...prevState,
      category: event.target.value
    }));
  };

  return (
    <section>
      <div className="container-filters">
        <label className="label-categoryFilter" htmlFor={categoryFilterId}>
          Categoria:
        </label>
        <select 
          id={categoryFilterId} 
          value={filters.category || ""}  // Si `filters.category` no está definido, usa una cadena vacía
          onChange={handleChangeCategory} // Usa `handleChangeCategory`
        >
          <option value="">Selecciona una categoría</option>
          {categoryOptions.map((cat, index) => (
            <option key={index} value={cat}>{cat}</option>
          ))}
        </select>
      </div>
    </section>
  );
}
