/** @jsxImportSource @emotion/react */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import { Link } from "react-router-dom";
import "./overWriteSlider.css";
import blur from "../../assets/blur.png";
import { useEffect, useLayoutEffect } from "react";
import { lazyloadImages, sectionFading, selectAllImages } from "../reusable";

const sliderSectionStyle = {
  width: "70%",
  height: "65vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const swiperContainer = {
  width: "100%",
  height: "100%",
  marginBottom: "2rem",
};

const swiperStyle = {
  width: "100%",
  height: "100%",
};
const imageStyle = {
  width: "50%",
  height: "100%",
  display: "block",
  margin: "0 auto",
  "@media(max-width:820px)": {
    width: "70%",
  },
  "@media(max-width:520px)": {
    width: "100%",
  },
};

const HomeSlider = ({ products }) => {
  useEffect(() => {
    const images = selectAllImages("lazy");
    lazyloadImages(images);
  }, []);
  useLayoutEffect(() => {
    sectionFading();
  }, []);

  return (
    <section css={sliderSectionStyle} className="section">
      <Swiper
        css={swiperContainer}
        spaceBetween={30}
        centeredSlides={true}
        autoplay={{
          delay: 2000,
          disableOnInteraction: false,
        }}
        pagination={{
          clickable: true,
        }}
        navigation={true}
        modules={[Autoplay, Pagination, Navigation]}
        className="mySwiper"
      >
        {products.map((product) => {
          return (
            <SwiperSlide key={product.id}>
              <div css={swiperStyle}>
                <Link to={`/shop/${product.imageName}`}>
                  <img
                    className="lazy"
                    css={imageStyle}
                    src={blur}
                    data-src={require(`../../assets/${product.imageName}-front.jpg`)}
                    alt={`${product.imageName} tee-shirt`}
                  />
                </Link>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

export default HomeSlider;
