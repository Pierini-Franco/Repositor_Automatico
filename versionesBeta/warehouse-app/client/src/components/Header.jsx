import { Filters } from "./Filters.jsx";

export function Header({ username }){
  return(
    <>
      <h1 className="title-h1">{`Wellcome, ${username}`}</h1>
      <Filters />
    </>
  )
}