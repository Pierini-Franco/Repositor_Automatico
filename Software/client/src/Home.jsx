import { ProductCard } from "./components/ProductCard.jsx";
import { Header } from './components/Header.jsx';
import { Footer } from "./components/Footer.jsx";
import { Cart } from "./components/Cart.jsx";
import { CartProvider } from "./context/cart.jsx";
import { useFilter } from "./hooks/useFilter.js";
import { NewProduct } from "./components/NewProduct.jsx";
import useWebSocket from "./hooks/useWebSocket";
import { useEffect, useState } from "react";

export function Home({ username }) {
    const WS_URL = 'ws://127.0.0.1:8000';
    const { data, error, sendMessage } = useWebSocket(WS_URL);

    const { filterProducts } = useFilter();
    const [products, setProducts] = useState([]);

    useEffect(() => {
        // Cargar productos iniciales cuando se monta el componente
        const fetchInitialProducts = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/products');
                if (!response.ok) throw new Error("Error al cargar productos iniciales");
                const initialProducts = await response.json();
                setProducts(initialProducts);
            } catch (error) {
                console.error('Error al cargar productos iniciales:', error);
            }
        };

        fetchInitialProducts();
    }, []);

    useEffect(() => {
        // Actualizar productos cuando llegan datos del WebSocket
        if (data.length > 0) {
            setProducts(data);
        }
    }, [data]);

    const filteredProducts = filterProducts(products);

    return (
        <CartProvider>
            <Header username={username} />
            <NewProduct onNewProduct={(newProduct) => setProducts((prev) => [...prev, newProduct])} sendMessage={sendMessage} />
            <Cart sendMessage={sendMessage} />
            <ProductCard products={filteredProducts} sendMessage={sendMessage} />
            <Footer />
        </CartProvider>
    );
}
