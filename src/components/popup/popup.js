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

const removePopupDisplay = {
  display: "none",
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
};

const buttonStyle = {
  backgroundColor: "black",
  color: "white",
  position: "absolute",
  top: "1rem",
  right: "1rem",
};

const Popup = ({ message }) => {
  const [style, setStyle] = useState(popupStyleDisplay);
  useEffect(() => {
    let isMounted = false;
    setTimeout(() => {
      if (!isMounted) return setStyle(removePopupDisplay);
    }, 2000);

    return () => {
      clearTimeout();
      isMounted = true;
    };
  }, []);

  return (
    <div css={style}>
      <div css={popupContainer}>
        <div css={messageContainer}>{message}</div>

        <button
          css={buttonStyle}
          onClick={() => {
            setStyle(removePopupDisplay);
          }}
        >
          X
        </button>
      </div>
    </div>
  );
};

export default Popup;
