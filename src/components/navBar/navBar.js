/** @jsxImportSource @emotion/react */
import cart from "../../assets/cart.svg";
import userIconImg from "../../assets/user.png";
import { Link } from "react-router-dom";
import { myUseSelector } from "../../redux/reduxHooks";
import Minicart from "../miniCart/miniCart";
import { useEffect, useState } from "react";

//styles
const hearderStyle = {
  width: "100%",
  height: "5rem",
  position: "relative",
  zIndex: "1100",
};
const navBarContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "70%",
  height: "100%",
  margin: "0 auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const logoStyle = {
  fontFamily: "buba, open sans-serif",
  fontSize: "2rem",
  "@media(max-width:620px)": {
    fontSize: "1.5rem",
  },
};

const menuLinksStyle = {
  display: "flex",
  height: "100%",
  alignItems: "center",
  position: "relative",
  zIndex: "1100",

  a: {
    padding: "0rem 1rem",
    "@media(max-width:620px)": {
      padding: ".5rem",
    },
  },
};
const cartImage = {
  width: "2rem",
  height: "2rem",
  position: "relative",
};
const cartStyle = {
  position: "relative",
  lineHeight: "1.4rem",
};
const countStyle = {
  border: "1px solid black",
  borderRadius: "50%",
  backgroundColor: "black",
  fontSize: ".7rem",
  textAlign: "center",
  color: "white",
  position: "absolute",
  top: "-.3rem",
  right: "0rem",
  width: "1.4rem",
  "@media(max-width:620px)": {
    right: "-.5rem",
  },
};
const linksMobile1 = {
  "@media(max-width:420px)": {
    position: "absolute",
    top: "4rem",
    left: "-3rem",
    textDecoration: "underline",
  },
};
const linksMobile2 = {
  "@media(max-width:420px)": {
    position: "absolute",
    top: "4rem",
    textDecoration: "underline",
  },
};
// components logic

export const NavBar = () => {
  const totalProd = myUseSelector((state) => state.cart.totalProducts);
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const [useMiniCart, setUseMiniCart] = useState(false);

  useEffect(() => {
    if (totalProd === 0 && useMiniCart) setUseMiniCart(false);
  }, [totalProd, useMiniCart]);

  const handleOpenMiniCart = (event) => {
    event.preventDefault();
    if (totalProd > 0) setUseMiniCart(true);
  };

  const hideMiniCart = () => setUseMiniCart(false);
  return (
    <>
      <header css={hearderStyle}>
        <div css={navBarContainerStyle}>
          <div css={logoStyle}>
            <Link to="/">TSHOP</Link>
          </div>
          <div css={menuLinksStyle}>
            <Link to="/man" css={linksMobile1}>
              Man
            </Link>
            <Link to="/woman" css={linksMobile2}>
              Woman
            </Link>
          </div>
          <div css={menuLinksStyle}>
            <Link to="/login">
              {isLoggedIn ? (
                <img style={cartImage} src={userIconImg} alt="user icon" /> // copy cart img style to avoid css repetition
              ) : (
                "log in"
              )}
            </Link>
            <div css={cartStyle}>
              <Link to="/miniCart" onClick={handleOpenMiniCart}>
                <img src={cart} alt="cart-img" css={cartImage} />
              </Link>
              <span role={"menuitem"} css={countStyle}>
                {totalProd}
              </span>
            </div>
          </div>
        </div>
      </header>
      {useMiniCart && <Minicart hideMiniCart={hideMiniCart} />}
    </>
  );
};
