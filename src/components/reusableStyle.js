const sectionStyle = {
  width: "70%",
  minHeight: "60vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
  h1: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },
  a: {
    color: "red",
  },
};

const reducedPopupStyle = {
  width: "75%",
  height: "100vh",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  position: "fixed",
  top: "0",
  zIndex: "1000",
};

const reducedLoaderStyle = {
  position: "fixed",
  backgroundColor: "white",
  top: "0",
  width: "75%",
  height: "100vh",
  zIndex: "1000",
};
export { sectionStyle, reducedPopupStyle, reducedLoaderStyle };
