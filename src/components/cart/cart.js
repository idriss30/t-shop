/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { decrement, increment, remove } from "../../redux/cartSlice";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";

import { totalPrice } from "../reusable";
import { Navigate } from "react-router-dom";
const sectionStyle = {
  minHeight: "70vh",
  width: "70%",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};
const containerStyle = {
  minHeight: "70vh",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  "@media(max-width:720px)": {
    display: "block",
  },
};

const itemsStyle = {
  display: "flex",
  borderBottom: "1px solid black",
  position: "relative",
  margin: "2rem 0",
  padding: "1rem 0",
  img: {
    display: "block",
    width: "8rem",
    height: "8rem",
  },
  button: {
    width: "1.5rem",
    height: "1.5rem",
    backgroundColor: "black",
    padding: ".1rem",
    color: "white",
    borderRadius: ".5rem",
    textAlign: "center",
    cursor: "pointer",
  },
};
const closeButton = {
  position: "absolute",
  top: "-1rem",
  right: "0rem",
};
const productTextStyle = {
  display: "flex",
  justifyContent: "space-between",
  flexDirection: "column",
  marginLeft: "1rem",
};
const quantityStyle = {
  color: "red",
  width: "2rem",
  display: "inline-block",
  backgroundColor: "whitesmoke",
  textAlign: "center",
};
const billingStyle = {
  backgroundColor: "whitesmoke",
  justifySelf: "end",
  width: "70%",
  height: "50vh",
  padding: "1rem",
  position: "sticky",
  top: "2rem",
  "@media(max-width:720px)": {
    width: "90%",
  },

  button: {
    backgroundColor: "black",
    margin: "1rem auto",
    padding: ".3rem",
    border: "none",
    color: "white",
    borderRadius: "2rem",
    width: "70%",
  },
};

const DisplayProd = ({ products }) => {
  const dispatch = myUseDispatch();
  const handleIncreaseQty = (product) => dispatch(increment(product));

  const handleReduceQty = (product) => dispatch(decrement(product));
  const deleteCartItem = (product) => dispatch(remove(product));
  return products.map((product) => {
    return (
      <div css={itemsStyle} key={product.name + Math.random()}>
        <div>
          <img
            src={require(`../../assets/${product.img}-display.jpg`)}
            alt={`${product.img} tee-shirt`}
          />
          <button css={closeButton} onClick={() => deleteCartItem(product)}>
            X
          </button>
        </div>

        <div css={productTextStyle}>
          <span css={{ fontWeight: "bold" }}>{product.name}</span>
          <span> size: {product.size}</span>
          <span> price: ${product.price}</span>
          <div>
            <button onClick={() => handleReduceQty(product)}>-</button>
            <span css={quantityStyle}>{product.quantity}</span>
            <button onClick={() => handleIncreaseQty(product)}>+</button>
          </div>
        </div>
      </div>
    );
  });
};

const BillingDisplay = ({ totalProducts, totalAmount }) => {
  return (
    <div css={billingStyle}>
      <p>
        Number of items :<span title="item-quantity">{totalProducts}</span>
      </p>
      <p>
        Total: <span>${totalAmount}</span>
      </p>
      <p>
        Delivery Cost: <span css={{ fontWeight: "bold" }}>Free</span>
      </p>
      <p>
        Amount to pay:
        <span title="total" css={{ color: "red", fontWeight: "bold" }}>
          ${totalAmount}
        </span>
      </p>
      <button>Checkout</button>
    </div>
  );
};

export const Cart = () => {
  const totalProducts = myUseSelector((state) => state.cart.totalProducts);
  const [totalAmount, setTotalAmount] = useState(null);
  const products = myUseSelector((state) => state.cart.products);

  useEffect(() => {
    const total = totalPrice(products);
    setTotalAmount(total);
  }, [products]);

  return (
    <section css={sectionStyle}>
      {totalProducts === 0 && <Navigate to="/" replace={true} />}
      <div css={containerStyle}>
        <div>
          <DisplayProd products={products} />
        </div>

        <BillingDisplay
          totalProducts={totalProducts}
          totalAmount={totalAmount}
        />
      </div>
    </section>
  );
};
