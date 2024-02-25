import { useId } from "react"
import { CartIcon, ClearFromCartIcon, CheckCartIcon } from "./Icons.jsx"
import './Cart.css'
import { useCart } from "../hooks/useCart.js"

export function Cart(){
  const checkBoxId = useId()
  const inputQuantityId = useId()
  const { cart } = useCart()
  
  return(
    <>
      <label htmlFor={checkBoxId} className="cartButton">
        <CartIcon />
      </label>
      <input id={checkBoxId} type="checkbox" hidden/>
      <aside className="cart-container">
        <section className="productsCart-container">
          
          {
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
                        <input id={cart.id} type="number" defaultValue={cart.quantity} max={cart.stock}/>{/* product.quantity, product.stock */}
                      </div>
                    </div>
                  </article>
                  <hr className="prCart-hrDivision"/>
                </section>
              )
            })
          }

        </section>

        <section className="prCart-buttonsContainer">
          <button className="buttonClearCart">
            <ClearFromCartIcon />
          </button>
          <button className="buttonCheckCart">
            <CheckCartIcon />
          </button>
        </section>
        
        
      </aside>
    </>
  )
}