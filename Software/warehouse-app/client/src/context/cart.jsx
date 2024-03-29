import { createContext, useState } from "react";
// 1 crear contexto
export const CartContext = createContext()
// 2 crear provider
export function CartProvider({ children }){
  const [cart, setCart] = useState([])
  // agregar al carrito
  const addToCart = (product) =>{

    // agregar si es nuevo 
    setCart(prevState =>([
      ...prevState,
      {
        ...product,
        quantity: 1
      }
    ]))
  }
  // actualizar carrt cuando cambie la quantity de un producto
  const updateCart = (updatedCart) => {
    setCart(updatedCart)
  }

  const removeFromCart = (product) =>{
    const newCart = cart.filter(item => item.id !== product.id )
    console.log(newCart);
    setCart(newCart)
  }
  // sacar del carrito
  // vaciar todo el carrito
  const clearCart = () => {
    setCart([])
  }

  return(
    <CartContext.Provider value={{
      cart,
      addToCart,
      updateCart,
      removeFromCart,
      clearCart
    }}>
      {children}
    </CartContext.Provider>
  )
}