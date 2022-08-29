/** @jsxImportSource @emotion/react */
import displayShirt from "../../assets/zipBlack-display.jpg";

const sectionStyle = {
  width: "70%",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  boxSizing: "border-box",
  alignItems: "center",
  "@media(max-width: 620px)": {
    display: "block",
  },
};

const imageStyle = {
  display: "block",
  float: "right",
  width: "80%",
  height: "90%",
  "@media(max-width: 620px)": {
    float: "none",
    width: "55%",
    height: "50vh",
    margin: "1rem auto",
  },
  "@media(max-width: 420px)": {
    width: "75%",
    height: "45vh",
    margin: "1rem auto",
  },
};

const textStyle = {
  width: "90%",
  "@media(max-width: 620px)": {
    width: "100%",
  },
};
const imageContainerStyle = {
  width: "100%",
  height: "80%",
  justifySelf: "end",
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
