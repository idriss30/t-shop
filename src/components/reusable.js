const saveProductsToLocalStorage = (products) => {
  return localStorage.setItem("products", JSON.stringify(products));
};

const filterProducts = (products, filter, condition) => {
  return products.filter((product) => product[filter] === condition);
};

const isProductsInLocalStorage = () => {
  return localStorage.getItem("products");
};
export { saveProductsToLocalStorage, filterProducts, isProductsInLocalStorage };
