/** @jsxImportSource @emotion/react */
import Popup from "../popup/popup";

const sectionStyle = {
  width: "70%",
  minHeight: "80vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

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
  "@media(max-width: 460px)": {
    display: "block",
  },
};
const imagesStyle = {
  width: "100%",
  height: "65%",
  "@media(max-width: 960px)": {
    height: "55%",
  },
  "@media(max-width: 460px)": {
    height: "60vh",
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

const Collection = () => {
  const products = JSON.parse(localStorage.getItem("products"));
  if (!products) return <Popup message={"problem getting best sellers"} />;
  const productCollection = products.filter(
    (product) => product.bestSeller !== true
  );

  return (
    <section css={sectionStyle}>
      <div>
        <h1 css={{ fontSize: "1.1rem", margin: "0rem 0 2rem 0" }}>
          Our Collection
        </h1>
        <div css={containerStyle}>
          {productCollection.map((product) => {
            return (
              <div key={product.id} css={gridStyle}>
                <img
                  css={imagesStyle}
                  src={require(`../../assets/${product.imageName}-front.jpg`)}
                  alt={`${product.name} tee shirt`}
                />
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