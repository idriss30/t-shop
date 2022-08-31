/** @jsxImportSource @emotion/react */
import cart from "../../assets/cart.svg";
import { Link } from "react-router-dom";

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
const cartAfter = {
  position: "relative",
};
const countStyle = {
  border: "1px solid black",
  borderRadius: "50%",
  backgroundColor: "black",
  textAlign: "center",
  color: "white",
  position: "absolute",
  top: "-1.2rem",
  right: "0rem",
  width: "1.2rem",
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
// components logics

export const NavBar = ({ counter }) => {
  return (
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
          <Link to="/login">Log in</Link>
          <Link to="/cart">
            <img src={cart} alt="cart-img" css={cartImage} />
          </Link>
          <div css={cartAfter}>
            <span css={countStyle}>{counter}</span>
          </div>
        </div>
      </div>
    </header>
  );
};
