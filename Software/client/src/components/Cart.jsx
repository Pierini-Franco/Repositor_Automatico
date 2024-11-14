import { useId } from "react";
import { CartIcon, ClearFromCartIcon, CheckCartIcon, PlusIcon, MinusIcon, TrashCanIcon } from "./Icons.jsx";
import './Cart.css';
import { useCart } from "../hooks/useCart.js";
import useWebSocket from "../hooks/useWebSocket.js";

export function Cart() {
  const checkBoxId = useId();
  const { cart, clearCart, updateCart, removeFromCart, getCartSummary } = useCart(); // Asegúrate de incluir getCartSummary
  const { sendMessage } = useWebSocket('ws://localhost:8000');

  // Actualiza la cantidad de un producto específico en el carrito
  const updateQuantity = (productId, amount) => {
    const updatedCart = cart.map(item => {
      if (item.id === productId) {
        const newQuantity = Math.min(Math.max(item.quantity + amount, 1), item.stock);
        return { ...item, quantity: newQuantity };
      }
      return item;
    });
    updateCart(updatedCart);
  };

  const handleAdd = (crt) => updateQuantity(crt.id, 1);
  const handleSubtract = (crt) => updateQuantity(crt.id, -1);

  const handleInputChange = (crt, value) => {
    const quantity = parseInt(value, 10);
    const updatedQuantity = Math.min(Math.max(isNaN(quantity) ? 1 : quantity, 1), crt.stock);

    const updatedCart = cart.map(item => {
      if (item.id === crt.id) {
        return { ...item, quantity: updatedQuantity };
      }
      return item;
    });

    updateCart(updatedCart);
  };

  const renderCartItems = () => {
    if (cart.length === 0) {
      return (
        <>
          <hr className="prCart-hrDivision"/>
          <span className="prCart-noProducts">Aún no hay productos en el carrito</span>
          <hr className="prCart-hrDivision"/>
        </>
      );
    } else {
      return cart.map(cartItem => (
        <section key={cartItem.id} className="prCart-container">
          <article className="prCart">
            <img className="prCart-image" src={cartItem.image} alt={cartItem.name} />
            <div className="prCart-info">
              <strong>{cartItem.name}</strong>
              <div className="prCart-info-quantity">
                <label htmlFor={cartItem.id}>
                  <small>Cantidad:</small>
                </label>
                <button
                  className="prCart-minus-button"
                  id={cartItem.id}
                  onClick={() => handleSubtract(cartItem)}
                >
                  <MinusIcon />
                </button>
                <input
                  type="number"
                  value={cartItem.quantity}
                  onChange={(e) => handleInputChange(cartItem, e.target.value)}
                  min="1"
                  max={cartItem.stock}
                  className="prCart-quantity-input"
                />
                <button
                  className="prCart-plus-button"
                  id={cartItem.id}
                  onClick={() => handleAdd(cartItem)}
                >
                  <PlusIcon />
                </button>
                <button 
                  className="prCart-trash-can"
                  onClick={() => removeFromCart(cartItem)}
                >
                  <TrashCanIcon />
                </button>
              </div>
            </div>
          </article>
          <hr className="prCart-hrDivision"/>
        </section>
      ));
    }
  };

  const handleCheckCart = () => {
    const filteredCart = getCartSummary(); // Llama a `getCartSummary` desde el contexto
    const message = {
      type: 'cartUpdate',
      cart: filteredCart,
    };

    console.log('Mensaje enviado:', message);
    sendMessage(message);
  };

  return (
    <>
      <label htmlFor={checkBoxId} className="cartButton">
        <CartIcon />
      </label>
      <input id={checkBoxId} type="checkbox" hidden />
      <aside className="cart-container">
        <section className="productsCart-container">
          {renderCartItems()}
        </section>
        <section className="prCart-buttonsContainer">
          <button 
            className="buttonClearCart"
            onClick={clearCart}
          >
            <ClearFromCartIcon />
          </button>
          <button 
            className="buttonCheckCart" 
            onClick={handleCheckCart}
          >
            <CheckCartIcon />
          </button>
        </section>
      </aside>
    </>
  );
}
