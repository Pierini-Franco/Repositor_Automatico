//ProductCard.jsx
import { useState } from 'react';
import { CartFilled, CartNotFilled } from './Icons.jsx';
import './ProductCard.css';
import { useCart } from '../hooks/useCart.js';
import useWebSocket from '../hooks/useWebSocket.js';

export function ProductCard() {
    const { cart, addToCart, removeFromCart } = useCart();
    const { data: products, error } = useWebSocket('ws://localhost:8000');

    // Verifica si hay un error
    if (error) {
        console.error('Error al recibir datos del WebSocket:', error);
        return <p>Error: {error}</p>;
    }

    // Si no hay productos, muestra un mensaje de carga
    if (!products || products.length === 0) {
        console.log('Cargando productos...');
        return <p>Cargando productos...</p>;
    }

    console.log('Productos recibidos:', products);

    return (
        <section className='productsWrap'>
            <ul>
                {products.map((product, index) => {
                    const isProductInCart = cart.some(item => item.id === product.id);

                    return (
                        <li key={`${product.id}-${index}`} className="prCard"> {/* Usar index para generar un key único */}
                            <div className="prCard-imageContainer">
                                <img className="prCard-image" alt={product.name} src={product.image} />
                            </div>

                            <div className="prCard-infoContainer">
                                <h3 className="prCard-prName">{product.name}</h3>
                                <h4 className="prCard-prStock">Cajas disponibles: {product.stock}</h4>
                            </div>
                            
                            <div className="prCard-buttonContainer">

                                
                                <button
                                    className="prCard-cartButton"
                                    onClick={() => {
                                        if (isProductInCart) {
                                            console.log(`Removiendo del carrito: ${product.name}`);
                                            removeFromCart(product);
                                        } else {
                                            console.log(`Agregando al carrito: ${product.name}`);
                                            addToCart(product);
                                        }
                                    }}
                                >
                                    {isProductInCart ? <CartFilled /> : <CartNotFilled />}
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>
        </section>
    );
}
