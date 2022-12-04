/** @jsxImportSource @emotion/react */
import { keyframes } from "@emotion/react";

const shadowRolling = keyframes`
  0% {
    box-shadow: 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  12% {
    box-shadow: 100px 0 black, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  25% {
    box-shadow: 110px 0 black, 100px 0 black, 0px 0 rgba(255, 255, 255, 0), 0px 0 rgba(255, 255, 255, 0);
  }
  36% {
    box-shadow: 120px 0 black, 110px 0 black, 100px 0 black, 0px 0 rgba(255, 255, 255, 0);
  }
  50% {
    box-shadow: 130px 0 black, 120px 0 black, 110px 0 black, 100px 0 black;
  }
  62% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 130px 0 black, 120px 0 black, 110px 0 black;
  }
  75% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 black, 120px 0 black;
  }
  87% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 130px 0 black;
  }
  100% {
    box-shadow: 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0), 200px 0 rgba(255, 255, 255, 0);
  }`;

const loaderSectionStyle = {
  position: "fixed",
  backgroundColor: "white",
  top: "0",
  width: "100%",
  height: "100vh",
  zIndex: "1000",
};

const loaderContainerStyle = {
  position: "absolute",
  width: "20rem",
  height: "10rem",
  top: "50%",
  left: "50%",
  transform: "translate(-50%,-50%)",
};

const loaderStyle = {
  width: "15px",
  height: "15px",
  borderRadius: "50%",
  display: "block",
  margin: "15px auto",
  position: "relative",
  color: "black",
  left: "-100px",
  boxSizing: "border-box",

  animation: `${shadowRolling} 2s linear infinite`,
};

const Loader = ({ style }) => {
  return (
    <div css={style ? style : loaderSectionStyle}>
      <div css={loaderContainerStyle}>
        <span data-testid="loader" css={loaderStyle}></span>
      </div>
    </div>
  );
};

export default Loader;
