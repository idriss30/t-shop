import { Link } from "react-router-dom";

/** @jsxImportSource @emotion/react */
const facebookIcon = require("../../assets/facebook.png");
const instaIcon = require("../../assets/insta.png");
const twitterIcon = require("../../assets/twitter.jpg");

const footerStyle = {
  width: "70%",
  height: "15rem",
  margin: "6rem auto 0rem auto",
  position: "relative",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const globalContainerStyle = {
  display: "grid",
  fontSize: ".8rem",
  gridTemplateRows: "2fr 1fr",
  width: "100%",
  height: "100%",
};

const footerImagesStyle = {
  display: "block",
  width: "1.5rem",
  height: "1.5rem",
  "@media(max-width:420px)": {
    marginRight: ".7rem",
  },
};

const copyrightStyle = {
  borderTop: "2px solid black",
  display: "flex",
  justifyContent: "space-between",
  padding: ".5rem 0",
};

const firstGroupStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "50%",
  "@media(max-width:1120px)": {
    width: "70%",
  },
  "@media(max-width:920px)": {
    width: "100%",
  },
};

const firstGroupTextStyle = {
  width: "50%",

  p: {
    lineHeight: "1.2rem",
    margin: "0",
  },
};
const linkStyleContainer = {
  "@media(max-width:420px)": {
    position: "absolute",
    bottom: "5rem",
    display: "flex",
    margin: ".5rem auto",
    width: "50%",
  },
};
const linksStyle = {
  display: "block",
  padding: ".2rem 0",
};

const listLinkStyle = {
  listStyle: "none",
  paddingLeft: "0",

  a: {
    display: "block",
    padding: ".2rem 0",
    textDecoration: "underline",
    fontWeight: "bold",
  },
  "@media(max-width:420px)": {
    marginBottom: "4rem",
  },
};

const Footer = () => {
  return (
    <footer css={footerStyle}>
      <div css={globalContainerStyle}>
        <div css={firstGroupStyle}>
          <ul css={listLinkStyle}>
            <li>
              <Link to="/about">About us</Link>
            </li>
            <li>
              <Link to="/terms">Terms of use</Link>
            </li>
            <li>
              <Link to="/privacy">Privacy policy</Link>
            </li>
          </ul>
          <div css={firstGroupTextStyle}>
            <p>Portfolio concept do not put your real info.</p>
            <p>credit card and user demo are available in the readme File</p>
            <p>Images were taken from Zara.</p>
          </div>
          <div css={linkStyleContainer}>
            <a
              css={linksStyle}
              href="https://facebook.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                css={footerImagesStyle}
                src={facebookIcon}
                alt="facebook-icon"
              />
            </a>
            <a
              css={linksStyle}
              href="https://instagram.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                css={footerImagesStyle}
                src={instaIcon}
                alt="instagram-icon"
              />
            </a>
            <a
              css={linksStyle}
              href="https://twitter.com"
              rel="noopener noreferrer"
              target="_blank"
            >
              <img
                css={footerImagesStyle}
                src={twitterIcon}
                alt="twitter-icon"
              />
            </a>
          </div>
        </div>

        <div css={copyrightStyle}>
          <p>T-SHOP | USA</p>
          <p>ALL right reserved</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
