import { ProductCard } from "./components/ProductCard.jsx";
import { Header } from './components/Header.jsx';
import { productsJson as initialProductsJson } from './mocks/productsJson.json'
import { useFilter } from "./hooks/useFilter.js";
import { Footer } from "./components/Footer.jsx";
import { Cart } from "./components/Cart.jsx";
import { CartProvider } from "./context/cart.jsx";
// header - products - footer

export function App(){
   const { filterProducts, filters } = useFilter()
   const filteredProducts = filterProducts(initialProductsJson)
   console.log(filters)
   return(
      <CartProvider>
         <Header />
         <Cart />
         <ProductCard filteredProducts={filteredProducts} />
         <Footer />
      </CartProvider>
   );
};