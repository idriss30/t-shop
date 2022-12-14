/** @jsxImportSource @emotion/react */
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { totalPrice } from "../reusable";
import { remove } from "../../redux/cartSlice";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import { gsap } from "gsap";

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
  "@media(max-width:420px)": {
    padding: "0",
  },
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
  "@media(max-width:420px)": {
    right: "3rem",
    top: "1.7rem",
  },
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
const globalContainer = {
  "@media(max-width:420px)": {
    width: "75%",
    margin: "0 auto",
  },
};

const Minicart = ({ hideMiniCart }) => {
  // take a function that should close the cart when button is clicked
  const cart = myUseSelector((state) => state.cart.products);
  const [total, setTotal] = useState(0);
  const [reversed, setReversed] = useState(false);
  const asideRef = useRef();
  const timeLine = useRef();

  const dispatch = myUseDispatch();

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      timeLine.current = gsap.timeline().from(asideRef.current, { x: "100%" });
    }, asideRef);

    return () => ctx.revert();
  }, []);

  useEffect(() => {
    timeLine.current.reversed(reversed);
  }, [reversed]);

  useEffect(() => {
    setTotal(() => totalPrice(cart));
  }, [cart]);

  return (
    <aside aria-label="section" css={sectionStyle} ref={asideRef}>
      <div css={globalContainer}>
        <button
          css={closeButtonStyle}
          onClick={() => {
            setReversed(true);
            setTimeout(() => {
              hideMiniCart();
            }, 1000);
          }}
        >
          X
        </button>
        <div css={cartContainerStyle}>
          total:
          <span
            css={{ color: "red", margin: "1rem 0", display: "inline-block" }}
          >
            ${total}
          </span>
          {cart.map((product) => {
            return (
              <div key={`${product.name} ${Math.random(3)}`}>
                <div css={singleProductContainerStyle}>
                  <img
                    src={require(`../../assets/${product.img}-display.jpg`)}
                    alt={product.name}
                  />
                  <div css={cartTextGrid}>
                    <span>{product.name.toLowerCase()}</span>
                    <span>size: {product.size}</span>
                    <span>Quantity : {product.qty}</span>
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
            Go to cart
          </Link>
        </div>
      </div>
    </aside>
  );
};

export default Minicart;
