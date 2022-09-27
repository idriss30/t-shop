/** @jsxImportSource @emotion/react */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import { Pagination } from "swiper";
import "./swiperBullet.css";
import { useEffect, useState } from "react";
import { myUseDispatch } from "../../redux/reduxHooks";
import { add } from "../../redux/cartSlice";
import Popup from "../popup/popup";

const sectionStyle = {
  width: "70%",
  minHeight: "65vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const sectionGrid = {
  width: "100%",
  height: "100%",
  display: "grid",
  fontSize: ".9rem",
  gridTemplateColumns: "1fr 2fr 1fr",
  columnGap: "2rem",
  marginBottom: "10rem",
  "@media(max-width:1040px)": {
    gridTemplateColumns: "2fr 1fr",
  },
  "@media(max-width:620px)": {
    gridTemplateColumns: "1fr",
  },
};

const materialTextStyle = {
  h1: {
    fontSize: "1.1rem",
  },
  p: {
    margin: "2rem 0",
    width: "90%",
  },
  "@media(max-width:1040px)": {
    display: "none",
  },
};

const productDetailText = {
  h2: {
    fontSize: ".9rem",
  },
  p: {
    width: "90%",
  },
  button: {
    margin: "1rem auto",
    width: "50%",
    padding: ".3rem",
    border: "none",
    backgroundColor: "black",
    color: "white",
    borderRadius: "2rem",
    "@media(max-width: 1040px)": {
      width: "80%",
    },
    "@media(max-width:640px)": {
      width: "50%",
    },
  },
};

const swiperContainer = {
  width: "100%",
  height: "65vh",
  "@media(max-width:1040px)": {
    height: "85vh",
  },
  "@media(max-width:640px)": {
    height: "60vh",
  },
};

const swiperImageStyle = {
  width: "100%",
  height: "100%",
  display: "block",
};

const listStyle = {
  borderTop: "1px solid black",
  borderBottom: "1px solid",
  listStyle: "none",
  padding: "0",
  "@media(max-width:1040px)": {
    padding: "0",
  },
};
const selectedListStyleCss = {
  backgroundColor: "lightgrey",
  padding: ".5rem",
};
const notSelectedListStyle = {
  padding: ".5rem 0",
  cursor: "pointer",
  ":hover": {
    backgroundColor: "lightgrey",
    paddingLeft: ".5rem",
  },
};
const ProductDisplay = ({ product }) => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const productImgArray = [
    `${product.imageName}-display`,
    `${product.imageName}-front`,
    `${product.imageName}-side`,
  ];
  const dispatch = myUseDispatch();
  const [size, setSize] = useState(null);
  const [isPopup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const resetPopupState = () => {
    return setTimeout(() => {
      setPopup(false);
    }, 1200);
  };

  const selectSize = (e) => {
    return setSize(e.target.innerText.toLowerCase());
  };

  const renderPopup = (message) => {
    setPopup(true);
    setPopupMessage(message);
    resetPopupState();
  };

  const handleAddToCart = (product) => {
    if (!size) {
      renderPopup("please select a size");
      return;
    }
    dispatch(add({ ...product, size: size }));
    renderPopup(`${product.imageName} added to cart`);
  };

  return (
    <>
      <section css={sectionStyle}>
        <div css={sectionGrid}>
          <div css={materialTextStyle}>
            <h1>Material & Care</h1>
            <p>
              We are working with monitoring programs to guarantee compliance
              with the social, environmental, and health and safety standards of
              our garments.
            </p>
            <p>
              To evaluate their compliance, we have developed an auditing
              program and plans for continual improvement.
            </p>
          </div>
          <Swiper
            direction={"vertical"}
            pagination={{
              clickable: true,
              renderBullet: function (index, className) {
                return `<span class = "${className} bullet-style"><img class = "bullet-img" src =${require(`../../assets/${productImgArray[index]}.jpg`)} alt= "${
                  product.imageName
                } t-shirt" /></span>`;
              },
            }}
            modules={[Pagination]}
            css={swiperContainer}
          >
            <SwiperSlide>
              <img
                css={swiperImageStyle}
                src={require(`../../assets/${product.imageName}-display.jpg`)}
                alt={product.name}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                css={swiperImageStyle}
                src={require(`../../assets/${product.imageName}-front.jpg`)}
                alt={product.name}
              />
            </SwiperSlide>
            <SwiperSlide>
              <img
                css={swiperImageStyle}
                src={require(`../../assets/${product.imageName}-side.jpg`)}
                alt={product.name}
              />
            </SwiperSlide>
          </Swiper>
          <div css={productDetailText}>
            <h2>{product.name}</h2>
            <p>{product.description}</p>
            <p css={{ fontWeight: "bold" }}>${product.price}</p>
            <ul css={listStyle} onClick={(event) => selectSize(event)}>
              <li
                css={
                  size === "small" ? selectedListStyleCss : notSelectedListStyle
                }
                aria-label={"small"}
              >
                Small
              </li>
              <li
                aria-label={"medium"}
                css={
                  size === "medium"
                    ? selectedListStyleCss
                    : notSelectedListStyle
                }
              >
                Medium
              </li>
              <li
                aria-label={"large"}
                css={
                  size === "large" ? selectedListStyleCss : notSelectedListStyle
                }
              >
                Large
              </li>
              <li
                aria-label={"xl"}
                css={
                  size === "xl" ? selectedListStyleCss : notSelectedListStyle
                }
              >
                XL
              </li>
            </ul>
            <button onClick={() => handleAddToCart(product)}>
              Add to cart
            </button>
          </div>
        </div>
      </section>
      {isPopup === true ? <Popup message={popupMessage} /> : ""}
    </>
  );
};

export default ProductDisplay;
