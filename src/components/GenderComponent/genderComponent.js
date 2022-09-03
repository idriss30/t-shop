import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import Display from "./genderFilter";

const UseCustomFetchGender = () => {
  const prodData = useMyCustomFetch("http://localhost:5000/api/shop/products", {
    products: [],
  });
  const { loading, fetchErr, data } = prodData;
  if (loading) return <Loader />;
  if (fetchErr) return <Popup message="can not fetch products" />;
  const products = data.products;
  localStorage.setItem("products", JSON.stringify(products));
  return <Display products={products} />;
};

const Gender = () => {
  const isProductsInLocalStorage = localStorage.getItem("products");
  if (!isProductsInLocalStorage) return <UseCustomFetchGender />;
  const products = JSON.parse(isProductsInLocalStorage);
  return <Display products={products} />;
};

export default Gender;
