/** @jsxImportSource @emotion/react */
import { useLocation, Link } from "react-router-dom";
import { useEffect, useLayoutEffect, useState } from "react";
import manDisplay from "../../assets/black2-front.jpg";
import womanDisplay from "../../assets/asia-front.jpg";
import {
  filterProducts,
  lazyloadImages,
  sectionFading,
  selectAllImages,
} from "../reusable";
import { sectionStyle } from "../reusableStyle";
import blur from "../../assets/blur.png";

const displayStyle = {
  width: "50%",
  margin: "0 auto 6rem auto",
  fontSize: ".7rem",
  fontWeight: "bold",
  "@media(max-width:820px)": {
    width: "70%",
  },
  "@media(max-width:620px)": {
    width: "100%",
  },

  h1: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },
};
const imageDisplayStyle = {
  width: "35vw",
  height: "63vh",
  display: "block",
  margin: "0 auto",
  "@media(max-width:820px)": {
    width: "50vw",
  },
  "@media(max-width:620px)": {
    width: "75vw",
    height: "55vh",
  },
};

const sectionGrid = {
  width: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  "@media(max-width:620px)": {
    display: "block",
  },
};

const singleGridStyle = {
  fontSize: ".8rem",
  fontWeight: "bold",
  width: "30vw",
  margin: "2rem auto",
  "@media(max-width:960px)": {
    width: "28vw",
    margin: "2rem 0",
  },

  "@media(max-width:820px)": {
    width: "100%",

    p: {
      width: "90%",
    },
  },
};

const imageGridStyle = {
  width: "30vw",
  height: "60vh",
  display: "block",
  "@media(max-width:960px)": {
    height: "37vh",
    width: "33vw",
  },
  "@media(max-width:820px)": {
    width: "33vw",
    height: "30vh",
  },
  "@media(max-width:620px)": {
    display: "block",
    width: "75vw",
    height: "50vh",
  },
};
const header2Style = {
  fontSize: ".9rem",
  "@media(max-width:820px)": {
    width: "90%",
  },
};

const staticGenderObject = {
  woman: {
    title: "T-SHIRTS FOR WOMEN",
    text: `OUR NEW ONLINE COLLECTION OF WOMEN'S T-SHIRTS HAS EVERYDAY BASICS AS WELL AS TREND-CONSCIOUS STATEMENT PIECES.
       FROM BRETON STRIPED TOPS TO UNIQUE SLOGANS, EMBELLISHED DESIGNS TO PRINTED PATTERNS, OUR SELECTION IS PACKED WITH VARIETY TO CHANGE UP YOUR CASUAL STYLE. 
       BLACK OR WHITE T-SHIRTS CAN BECOME THE BASE PIECE FOR ANY OFF-DUTY OUTFIT`,
  },

  man: {
    title: "T-SHIRTS FOR MEN",
    text: ` T-SHIRTS FOR MEN ARE A STYLE BASIC. FROM CLASSIC CUTS TO
            CONTEMPORARY VERSIONS, THEY COME IN MULTIPLE SHAPES AND SILHOUETTES.
            LONG-SLEEVED, SHORT-SLEEVED AND SLEEVELESS STYLES ARE ALL OPTIONS IN
            OUR COLLECTION. WHETHER YOU PREFER STRIPED OR SLOGAN DESIGNS, BASIC
            OR FLORAL PATTERNS, YOUR TASTE`,
  },
};

const Display = ({ products }) => {
  const [gender, setGender] = useState("");
  const location = useLocation();

  useLayoutEffect(() => {
    sectionFading();
  }, []);
  useEffect(() => {
    if (location.pathname === "/man") {
      setGender("man");
    } else {
      setGender("woman");
    }
  }, [location]);

  //lazyLad images useEffect
  useEffect(() => {
    const images = selectAllImages();
    lazyloadImages(images);
  });

  const productsToDisplay = filterProducts(products, "category", gender);

  return (
    <section css={sectionStyle}>
      <div>
        <div css={displayStyle}>
          <Link to={gender === "woman" ? "/shop/asia" : "/shop/black2"}>
            <img
              css={imageDisplayStyle}
              alt="display tee-shirt"
              src={blur}
              data-src={gender === "man" ? manDisplay : womanDisplay}
            />
          </Link>
          <h1>
            {gender === "man"
              ? staticGenderObject.man.title
              : staticGenderObject.woman.title}
          </h1>
          <p>
            {gender === "man"
              ? staticGenderObject.man.text
              : staticGenderObject.woman.text}
          </p>
        </div>
        <div css={sectionGrid}>
          {productsToDisplay.map((product) => {
            return (
              <div key={product.id} css={singleGridStyle}>
                <Link to={`/shop/${product.imageName}`}>
                  <img
                    css={imageGridStyle}
                    src={blur}
                    data-src={require(`../../assets/${product.imageName}-front.jpg`)}
                    alt={product.name}
                  />
                </Link>
                <h2 css={header2Style}>{product.name}</h2>
                <p>{product.description}</p>
                <p>{`$${product.price}`}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Display;
