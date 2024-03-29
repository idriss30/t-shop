/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import displayShirt from "../../assets/zipBlack-display.jpg";
import { sectionStyle } from "../reusableStyle";

const containerStyle = {
  width: "100%",
  height: "100%",
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  boxSizing: "border-box",
  alignItems: "center",
  "@media(max-width: 820px)": {
    display: "block",
  },
};

const imageStyle = {
  display: "block",
  float: "right",
  width: "26vw",
  height: "58vh",
  "@media(max-width: 820px)": {
    float: "none",
    width: "42vw",
    height: "50vh",
    margin: "1rem auto",
  },
  "@media(max-width: 620px)": {
    width: "56vw",
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
          <Link to={`/shop/zipBlack`}>
            <img src={displayShirt} alt="black tee-shirt" css={imageStyle} />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default MaterialCare;
