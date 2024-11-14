import { ProductCard } from "./components/ProductCard.jsx";
import { Header } from './components/Header.jsx';
import { productsJson as initialProductsJson } from './mocks/productsJson.json'
import { useFilter } from "./hooks/useFilter.js";
import { Footer } from "./components/Footer.jsx";
import { Cart } from "./components/Cart.jsx";
import { CartProvider } from "./context/cart.jsx";
// header - products - footer
import useWebSocket from "react-use-websocket";

export function Home({ username }){
	const WS_URL = 'ws://127.0.0.1:8000'
	const { sendJsonMessage } = useWebSocket(WS_URL, {
		queryParams: {username}
	})
	
	const { filterProducts, filters } = useFilter()
	const filteredProducts = filterProducts(initialProductsJson)
	console.log(filters)
	return(
		<CartProvider>
			<Header username={username}/>
			<Cart sendJsonMessage={sendJsonMessage}/>
			<ProductCard filteredProducts={filteredProducts} sendJsonMessage={sendJsonMessage}/>
			<Footer />
		</CartProvider>
	);
};