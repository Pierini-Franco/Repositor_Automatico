import { useId } from "react"
import { CartIcon, ClearFromCartIcon, CheckCartIcon, PlusIcon, MinusIcon, TrashCanIcon } from "./Icons.jsx"
import './Cart.css'
import { useCart } from "../hooks/useCart.js"

export function Cart({ sendJsonMessage }){

  const checkBoxId = useId()
  const { cart, clearCart, updateCart } = useCart()

  // sumar quantity del producto
  const handleAdd = (crt) =>{
    // hallar y guardar producto q se le quiere cabiar la quantity
    let product = cart.find((cart) => cart.name === crt.name)
    // sumarle uno a quantity
    product.quantity += 1
    if(product.quantity > product.stock){
      product.quantity = product.stock
    }
    console.log(product)
    // crear nuevo array con las modificacion de cantidades
    const updatedProducts = cart.map(item => {
      // si se halla el producto q queremos modificar, se guarda en el array el producto con la nueva cantidad 
      if(product.name === item.name) return product
      // si no se halla, no se modifica el producto
      return item
    })
    // actualizar carrt con las quantities actualizadas
    updateCart(updatedProducts)
  }

  // restar quantity del producto
  const handleSubtract = (crt) =>{
    let product = cart.find((cart) => cart.name === crt.name)

    product.quantity -= 1
    if(product.quantity === 0){
      product.quantity = 1
    }
    console.log(product)
    
    const updatedProducts = cart.map(item => {
      // si se halla el producto q queremos modificar, se guarda en el array el producto con la nueva cantidad 
      if(product.name === item.name) return product
      // si no se halla, no se modifica el producto
      return item
    })
    // actualizar carrt con las quantities actualizadas
    updateCart(updatedProducts)
  }

  const isThereProducts = (cart) => {
    if(cart.length === 0){
      return(
        <>
          <hr className="prCart-hrDivision"/>
          <span className="prCart-noProducts">
            Aun no hay productos en el carrito 
          </span>
          <hr className="prCart-hrDivision"/>
        </>
      )
    }
    else{
      return(
        cart.map(cart => {
          return(
            <section key={cart.id} className="prCart-container">
              <article className="prCart">
                <img className="prCart-image" src={cart.image} alt={cart.name} />
                <div className="prCart-info">
                  <strong>{cart.name}</strong>
                  <div className="prCart-info-quantity">
                    <label htmlFor={cart.id}>
                      <small>Cantidad:</small>
                    </label>
                    <button
                      className="prCart-minus-button"
                      id={cart.id}
                      onClick={() => {handleSubtract(cart)}}
                    >
                      <MinusIcon />
                    </button>
                    <small>{cart.quantity}</small>
                    <button
                      className="prCart-plus-button"
                      id={cart.id}
                      onClick={() => {handleAdd(cart)}}
                    >
                      <PlusIcon />
                    </button>
                    <button className="prCart-trash-can">
                      <TrashCanIcon />
                    </button>
                  </div>
                </div>
              </article>
              <hr className="prCart-hrDivision"/>
            </section>
          )
        })
      )
    }
  }
  
  return(
    <>
      <label htmlFor={checkBoxId} className="cartButton">
        <CartIcon />
      </label>
      <input id={checkBoxId} type="checkbox" hidden/>
      <aside className="cart-container">
        <section className="productsCart-container">
          {
            isThereProducts(cart)
          }
        </section>

        <section className="prCart-buttonsContainer">
          <button 
            className="buttonClearCart"
            onClick={clearCart} // clear cart; poner 'clearCart()' no funciona
            >
            <ClearFromCartIcon />
          </button>
          <button 
            className="buttonCheckCart" 
            onClick={() => {
              console.log('mensaje enviado 2')
              console.log(cart)
              sendJsonMessage(cart)
            }}
            >
            <CheckCartIcon />
          </button>
        </section>
        
        
      </aside>
    </>
  )
}