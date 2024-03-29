import { useState } from 'react';
import { CartFilled, CartNotFilled } from './Icons.jsx';
import './ProductCard.css'
import { useCart } from '../hooks/useCart.js';

export function ProductCard({ filteredProducts, sendJsonMessage }){
  const { cart, addToCart, removeFromCart } = useCart()

  const checkProductInCart = (product) =>{
    return cart.some(item => item.id === product.id)
  }

  return(
    <>
      <section className='productsWrap'>
        <ul>
          {
            filteredProducts.map(filteredProducts => {
              const isProductInCart = checkProductInCart(filteredProducts)
              console.log(isProductInCart, cart)
              return(
                <li key={filteredProducts.id} className="prCard">
                  <div className="prCard-imageContainer">
                    <img className="prCard-image" alt="Repositor Automatico - Inicio" src={filteredProducts.image} />
                  </div>

                  <div className="prCard-infoContainer">
                    <h3 className="prCard-prName">
                      {filteredProducts.name}
                    </h3>
                    <h4 className="prCard-prStock">
                      Cajas disponibles: {filteredProducts.stock}
                    </h4>
                  </div>
                  <div className="prCard-buttonContainer">
                    <button className="prCard-orderButton" onClick={() =>{
                      console.log(filteredProducts.name)
                      // agregar al objeto filteredProducts la propiedad quantity = 1
                      filteredProducts.quantity = 1
                      // guardar producto dentro de array
                      const product = [filteredProducts]
                      console.log(product)
                      sendJsonMessage(product)
                      console.log('mensaje enviado 1')
                    }}>
                      Ordenar
                    </button>
                    <button className= "prCard-cartButton" onClick={() => { isProductInCart ? removeFromCart(filteredProducts) : addToCart(filteredProducts)}}>
                      {
                        isProductInCart ? <CartFilled /> : <CartNotFilled />
                      }
                    </button>
                  </div>
                </li>
              )
            })
          }
        </ul>
      </section>
    </>
  );
};