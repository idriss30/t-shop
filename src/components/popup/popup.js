/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";

const popupStyleDisplay = {
  width: "100%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "fixed",
  top: "0",
  zIndex: "1000",
};

const popupContainer = {
  width: "20rem",
  height: "10rem",
  border: "2px solid black",
  color: "white",
  backgroundColor: "black",
  position: "relative",
  "@media(max-width:620px)": {
    width: "15rem",
  },
};

const messageContainer = {
  display: "flex",
  width: "100%",
  height: "100%",
  padding: "0, .5rem",
  alignItems: "center",
  justifyContent: "center",

  p: {
    width: "80%",
  },
};

const buttonStyle = {
  backgroundColor: "black",
  color: "white",
  position: "absolute",
  top: "1rem",
  right: "1rem",
};

const Popup = ({ message, remove, style }) => {
  const [visibility, setVisibility] = useState(true);
  useEffect(() => {
    setTimeout(() => {
      setVisibility(false);
    }, 2000);
  }, []);
  return (
    <>
      {visibility && (
        <div aria-label="popup" css={style ? style : popupStyleDisplay}>
          <div css={popupContainer}>
            <div css={messageContainer}>
              <p>{message}</p>
            </div>

            <button css={buttonStyle} onClick={remove}>
              X
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Popup;
