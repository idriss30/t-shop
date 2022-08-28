/** @jsxImportSource @emotion/react */
import displayShirt from "../../assets/zipBlack-display.jpg";

const sectionStyle = {
  width: "70%",
  height: "80vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const containerStyle = {
  width: "100%",
  height: "80vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  fontSize: ".9rem",
  "@media(max-width:620px)": {
    flexDirection: "column",
    height: "auto",
  },
};

const imageStyle = {
  width: "98%",
  height: "100%",
  position: "relative",
  right: "-4rem",
  "@media(max-width:820px)": {
    right: "-3.2rem",
  },
  "@media(max-width:620px)": {
    right: "0",
    top: "-2rem",
    width: "100%",
    height: "80%",
  },
};

const textStyle = {
  "@media(max-width:820px)": {
    flexBasis: "50%",
  },
  "@media(max-width:620px)": {
    width: "100%",
  },
};
const imageContainerStyle = {
  "@media(max-width:820px)": {
    flexBasis: "50%",
  },
  "@media(max-width:620px)": {
    width: "100%",
  },
};
const MaterialCare = () => {
  return (
    <section css={sectionStyle}>
      <div css={containerStyle}>
        <div css={textStyle}>
          <h1 css={{ fontSize: "1.1rem" }}>Content & Care</h1>
          <h2 css={{ fontSize: ".9rem" }}>Join Life</h2>
          <p>Care for water: produced using less water.</p>
          <p>
            We use the Join Life label for items that have been produced using
            technologies and raw materials that help us reduce the environmental
            impact of our products.
          </p>
          <p>
            These garments were produced using technologies that reduce water
            consumption in their production processes.
          </p>
        </div>
        <div css={imageContainerStyle}>
          <img src={displayShirt} alt="black tee-shirt" css={imageStyle} />
        </div>
      </div>
    </section>
  );
};

export default MaterialCare;
