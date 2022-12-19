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
    return acc + product.qty;
  }, 0);
};

const totalPrice = (cart) => {
  return cart.reduce((init, product) => {
    return init + product.price * product.qty;
  }, 0);
};

const selectAllImages = () => {
  return document.querySelectorAll("img");
};
const lazyLoadImagesCallback = (entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting && entry.target.dataset.src) {
      entry.target.src = entry.target.dataset.src;
      observer.unobserve(entry.target);
    }
  });
};

const observer = new IntersectionObserver(lazyLoadImagesCallback);

const lazyloadImages = (images) => {
  return images.forEach((image) => observer.observe(image));
};

export {
  saveProductsToLocalStorage,
  filterProducts,
  isProductsInLocalStorage,
  saveCartToSessionStorage,
  totalCountQuantity,
  isCartInSessionStorage,
  totalPrice,
  selectAllImages,
  lazyloadImages,
};
