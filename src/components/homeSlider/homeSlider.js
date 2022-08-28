/** @jsxImportSource @emotion/react */
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { Autoplay, Pagination, Navigation } from "swiper";
import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import "./overWriteSlider.css";

const sliderSectionStyle = {
  width: "70%",
  height: "65vh",
  margin: "4rem auto",
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

const isProductsInLocalStorage = () => {
  return localStorage.getItem("products");
};

const filterBestSellerProducts = (products) => {
  return products.filter((product) => product.bestSeller === true);
};

const Display = ({ products }) => {
  return (
    <section css={sliderSectionStyle}>
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
                <img
                  css={imageStyle}
                  src={require(`../../assets/${product.imageName}-front.jpg`)}
                  alt={`${product.imageName} tee-shirt`}
                />
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>
    </section>
  );
};

const FetchProducts = () => {
  const fetchProductState = useMyCustomFetch(
    "http://localhost:5000/api/shop/products",
    {
      products: [],
    }
  );
  const { loading, fetchErr, data } = fetchProductState;
  if (loading) return <Loader />;
  if (fetchErr) return <Popup message="can not fetch products" />;
  const products = data.products;
  localStorage.setItem("products", JSON.stringify(products));
  const bestSellers = filterBestSellerProducts(products);
  return <Display products={bestSellers} />;
};

const HomeSlider = () => {
  const isValidProd = isProductsInLocalStorage("products");
  if (!isValidProd || isValidProd.length === 0) return <FetchProducts />;
  const products = JSON.parse(isValidProd);
  const bestSellers = filterBestSellerProducts(products);
  return <Display products={bestSellers} />;
};

export default HomeSlider;
