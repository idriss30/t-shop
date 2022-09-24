import { useParams } from "react-router-dom";
import ProductDisplay from "./singleProductDisplay";

import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import {
  saveProductsToLocalStorage,
  filterProducts,
  isProductsInLocalStorage,
} from "../reusable";

const FetchSingleProduct = ({ productName }) => {
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
  const product = filterProducts(products, "imageName", productName);
  if (product.length > 0) return <ProductDisplay product={product[0]} />;
};

const SingleProduct = () => {
  const { productName } = useParams();
  const isProducts = isProductsInLocalStorage();
  if (!isProducts) return <FetchSingleProduct productName={productName} />;

  const product = filterProducts(
    JSON.parse(isProducts),
    "imageName",
    productName
  );

  return <ProductDisplay product={product[0]} />;
};

export default SingleProduct;
