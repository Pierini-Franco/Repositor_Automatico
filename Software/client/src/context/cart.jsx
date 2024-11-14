import { createContext, useState } from "react";

export const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  const addToCart = (product) => {
    setCart((prevState) => {
      const existingProduct = prevState.find((item) => item.id === product.id);
      if (existingProduct) {
        return prevState.map((item) =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, item.stock) }
            : item
        );
      } else {
        return [
          ...prevState,
          {
            ...product,
            quantity: 1,
          },
        ];
      }
    });
  };

  const updateCart = (updatedCart) => {
    setCart(updatedCart);
  };

  const removeFromCart = (product) => {
    setCart((prevState) => prevState.filter((item) => item.id !== product.id));
  };

  const clearCart = () => {
    setCart([]);
  };

  // Nueva función que filtra el carrito para solo incluir `id`, direc y `nivel`
  const getCartSummary = () => {
    return cart.map(({ id, direc, nivel, quantity }) => ({ id, direc, nivel, quantity }));
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateCart,
        removeFromCart,
        clearCart,
        getCartSummary, // Exporta la nueva función
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
