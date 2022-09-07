import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import {
  isProductsInLocalStorage,
  saveProductsToLocalStorage,
} from "../reusable";
import Display from "./genderFilter";

const UseCustomFetchGender = () => {
  const prodData = useMyCustomFetch("http://localhost:5000/api/shop/products", {
    products: [],
  });
  const { loading, fetchErr, data } = prodData;
  if (loading) return <Loader />;
  if (fetchErr) return <Popup message="can not fetch products" />;
  const products = data.products;
  saveProductsToLocalStorage(products);
  return <Display products={products} />;
};

const Gender = () => {
  const isProductSaved = isProductsInLocalStorage();
  if (!isProductSaved) return <UseCustomFetchGender />;
  const products = JSON.parse(isProductSaved);
  return <Display products={products} />;
};

export default Gender;
