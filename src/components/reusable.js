const saveProductsToLocalStorage = (products) => {
  return localStorage.setItem("products", JSON.stringify(products));
};

const filterProducts = (products, filter, condition) => {
  return products.filter((product) => product[filter] === condition);
};

const isProductsInLocalStorage = () => {
  return localStorage.getItem("products");
};

const saveCartToSessionStorage = (cart) => {
  sessionStorage.setItem("cart", JSON.stringify(cart));
};

const isCartInSessionStorage = () => {
  return sessionStorage.getItem("cart");
};

const totalCountQuantity = (cart) => {
  return cart.reduce((acc, product) => {
    return acc + product.quantity;
  }, 0);
};

const totalPrice = (cart) => {
  return cart.reduce((init, product) => {
    return init + product.price * product.quantity;
  }, 0);
};
export {
  saveProductsToLocalStorage,
  filterProducts,
  isProductsInLocalStorage,
  saveCartToSessionStorage,
  totalCountQuantity,
  isCartInSessionStorage,
  totalPrice,
};
