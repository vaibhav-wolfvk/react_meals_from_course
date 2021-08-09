import React, { useContext, useState } from "react";
import CartContext from "../../store/cart-context";
import classes from "./Cart.module.css";
import Modal from "../UI/Modal";
import CartItem from "./CartItem";
import CheckOut from "./CheckOut";

const Cart = (props) => {
  const [isSubmiting,setIsSubmiting] = useState(false)
  const [didSubmit,setDidSubmit] = useState(false)
  const cartCtx = useContext(CartContext);
  const [checkout, setCheckout] = useState(false);

  const totalAmount = `$${cartCtx.totalAmount.toFixed(2)}`;
  const hasItems = cartCtx.items.length > 0;

  const cartItemRemovalHandler = (id) => {
    cartCtx.removeItem(id);
  };

  const cartItemAddHandler = (item) => {
    cartCtx.addItem({ ...item, amount: 1 });
  };

  const OrderHandler = () => {
    setCheckout(true);
  };

  const submitOrderHandler =async(userData) =>{
    setIsSubmiting(true)
     await fetch('https://reactmealsbackend-default-rtdb.firebaseio.com/orders.json',{
      method:'POST',
      body: JSON.stringify({
        user: userData,
        orderedItems: cartCtx.items
      })
    })
    setIsSubmiting(false)
    setDidSubmit(true)
    cartCtx.clearCart()
  }
  const cartitems = (
    <ul className={classes["cart-items"]}>
      {cartCtx.items.map((item) => (
        <CartItem
          key={item.id}
          name={item.name}
          amount={item.amount}
          price={item.price}
          onRemove={cartItemRemovalHandler.bind(null, item.id)}
          onAdd={cartItemAddHandler.bind(null, item)}
        />
      ))}
    </ul>
  );

  const cartModalContent = <React.Fragment>
 {cartitems}
      <div className={classes.total}>
        <span>Total Amount</span>
        <span>{totalAmount}</span>
      </div>
      {checkout && (
        <CheckOut onConfirm={submitOrderHandler} onCancel={props.onClose} />
      )}
      <div className={classes.actions}>
        {!checkout && (
          <button className={classes["button--art"]} onClick={props.onClose}>
            Close
          </button>
        )}
        {hasItems && !checkout && (
          <button className={classes.button} onClick={OrderHandler}>
            Order
          </button>
        )}{" "}
      </div>
  </React.Fragment>
  const isSubmitingModalContent=<p>Sending order data...</p>

  const didSubmitModalContent =<React.Fragment>
    <p>Succesfully sent the order! will contact you shortly</p>
    <div className={classes.actions}>
        
          <button className={classes.button} onClick={props.onClose}>
            Close
          </button>
        
        </div>
    </React.Fragment>
  return (
    <Modal onClose={props.onClose}>
     {!isSubmiting && !didSubmit && cartModalContent}
     {isSubmiting && isSubmitingModalContent}
     {didSubmit && didSubmitModalContent}
    </Modal>
  );
};
export default Cart;
