/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import { sectionStyle } from "../reusableStyle";
import blur from "../../assets/blur.png";

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "grid",
  fontWeight: "bold",
  fontSize: ".8rem",
  gridTemplateColumns: "1fr 1fr 1fr",
  columnGap: "1rem",
  "@media(max-width: 960px)": {
    gridTemplateColumns: "1fr 1fr",
    rowGap: "0",
  },

  "@media(max-width: 620px)": {
    display: "block",
  },
};
const imagesStyle = {
  width: "100%",
  height: "100%",
  "@media(max-width: 620px)": {
    display: "block",
    width: "75vw",
    height: "50vh",
  },
};

const gridStyle = {
  display: "flex",
  flexDirection: "column",
  height: "100%",
  "@media(max-width: 460px)": {
    marginBottom: "2rem",
  },
};

const textStyle = {
  p: {
    minHeight: "2rem",
    "@media(max-width:620px)": {
      minHeight: "3rem",
    },
    "@media(max-width:460px)": {
      minHeight: "1rem",
    },
  },
};
const header2Style = {
  fontSize: ".9rem",
  minHeight: "2rem",
  "@media(max-width:460px)": {
    minHeight: "1rem",
  },
};

const linkStyle = {
  display: "inline-block",
  height: "55%",
  "@media(max-width: 620px)": {
    height: "50vh",
  },
};

const Collection = ({ products }) => {
  return (
    <section css={sectionStyle}>
      <div>
        <h1 css={{ fontSize: "1.1rem", margin: "0rem 0 2rem 0" }}>
          Our Collection
        </h1>
        <div css={containerStyle}>
          {products.map((product) => {
            return (
              <div key={product.id} css={gridStyle}>
                <Link to={`/shop/${product.imageName}`} css={linkStyle}>
                  <img
                    css={imagesStyle}
                    src={blur}
                    data-src={require(`../../assets/${product.imageName}-front.jpg`)}
                    alt={`${product.imageName} tee-shirt`}
                  />
                </Link>

                <div css={textStyle}>
                  <h2 css={header2Style}>{product.name}</h2>
                  <p>{product.description}</p>
                  <p>{`$${product.price}`}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default Collection;
