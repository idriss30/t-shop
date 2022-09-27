/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { totalPrice } from "../reusable";
import { remove } from "../../redux/cartSlice";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";

const sectionStyle = {
  width: "25%",
  height: "100vh",
  fontSize: ".9rem",
  position: "fixed",
  top: "0",
  right: "0",
  zIndex: "2000",
  backgroundColor: "whitesmoke",
  "@media(max-width:980px)": {
    width: "50%",
  },
  "@media(max-width:420px)": {
    width: "100%",
  },
};

const cartContainerStyle = {
  margin: "2rem 0",
  padding: "2rem",
  height: "90vh",
  overflowY: "auto",
};

const singleProductContainerStyle = {
  display: "flex",
  marginBottom: "1rem",
  img: {
    display: "block",
    marginRight: "1rem",
    width: "5rem",
    height: "5rem",
  },
};

const cartTextGrid = {
  display: "flex",
  flexDirection: "column",

  img: {
    width: "1rem",
    height: "auto",
    display: "inline-block",
    cursor: "pointer",
    marginTop: "1rem",
  },
};

const closeButtonStyle = {
  position: "absolute",
  top: "2rem",
  right: "2rem",
  backgroundColor: "black",
  color: "white",
  cursor: "pointer",
  borderRadius: "50%",
};

const cartButtonStyle = {
  display: "inline-block",
  margin: "2rem 0",
  textAlign: "center",
  width: "50%",
  backgroundColor: "black",
  color: "white",
  borderRadius: "2rem",

  ":visited": {
    color: "white",
  },

  "@media(max-width:520px)": {
    width: "70%",
  },
};
const Minicart = ({ hideMiniCart }) => {
  // take a function that should close the cart when button is clicked
  const cart = myUseSelector((state) => state.cart.products);
  const [total, setTotal] = useState(0);

  const dispatch = myUseDispatch();
  useEffect(() => {
    setTotal(() => totalPrice(cart));
  }, [cart]);
  return (
    <aside aria-label="section" css={sectionStyle}>
      <button css={closeButtonStyle} onClick={hideMiniCart}>
        X
      </button>
      <div css={cartContainerStyle}>
        total:
        <span css={{ color: "red", margin: "1rem 0", display: "inline-block" }}>
          ${total}
        </span>
        {cart.map((product) => {
          return (
            <div key={`${product.name} ${Math.random(3)}`}>
              <div css={singleProductContainerStyle}>
                <img
                  src={require(`../../assets/${product.name}-display.jpg`)}
                  alt={product.name}
                />
                <div css={cartTextGrid}>
                  <span>{product.name} tee-shirt</span>
                  <span>size: {product.size}</span>
                  <span>Quantity : {product.quantity}</span>
                  <span onClick={() => dispatch(remove({ ...product }))}>
                    <img
                      src={require(`../../assets/trash.png`)}
                      alt="garbage icon"
                    />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
        <Link css={cartButtonStyle} to={"/cart"} onClick={hideMiniCart}>
          Go to Cart
        </Link>
      </div>
    </aside>
  );
};

export default Minicart;
