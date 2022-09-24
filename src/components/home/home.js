import Collection from "../collection/collection";
import HomeSlider from "../homeSlider/homeSlider";
import MaterialCare from "../materials&Care/materialCareProgram";
import NewsLetter from "../newsLetter/newsLetter";
import {
  filterProducts,
  isProductsInLocalStorage,
  saveProductsToLocalStorage,
} from "../reusable";
import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import Popup from "../popup/popup";

const HomeDisplay = ({ products }) => {
  const bestSellers = filterProducts(products, "bestSeller", true);
  const collectionProducts = filterProducts(products, "bestSeller", false);
  return (
    <>
      <HomeSlider products={bestSellers} />
      <MaterialCare />
      <Collection products={collectionProducts} />
      <NewsLetter />
    </>
  );
};

const FetchProductsFromLocalStorage = () => {
  const products = JSON.parse(isProductsInLocalStorage());
  return <HomeDisplay products={products} />;
};

const FetchProductsFromServer = () => {
  const fetchProductState = useMyCustomFetch(
    `${process.env.REACT_APP_URL}/api/shop/products`,
    {
      products: [],
    }
  );
  const { loading, fetchErr, data } = fetchProductState;
  if (loading) return <Loader />;
  if (fetchErr) return <Popup message="can not fetch products" />;
  const products = data.products;
  saveProductsToLocalStorage(products);
  return <HomeDisplay products={products} />;
};

const Home = () => {
  const isProductSaved = isProductsInLocalStorage();
  if (!isProductSaved || JSON.parse(isProductSaved).length === 0)
    return <FetchProductsFromServer />;
  return <FetchProductsFromLocalStorage />;
};

export default Home;
