/** @jsxImportSource @emotion/react */
import { sectionStyle } from "../reusableStyle";

const imgStyle = {
  width: "25vw",
  height: "40vh",
  display: "block",
  margin: "0 auto",

  "@media(max-width:520px)": {
    width: "auto",
    height: "auto",
  },
};

const Render404 = () => {
  return (
    <section css={sectionStyle}>
      <h1>Nothing to see here, Please navigate away.</h1>
      <p>Some pages were left empty because this is not a commercial shop.</p>
      <p>Feel free to test other features.</p>
      <img
        css={imgStyle}
        alt="404"
        src={`${require("../../assets/404.png")}`}
      />
    </section>
  );
};

export default Render404;
