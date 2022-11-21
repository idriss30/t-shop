import { createSlice } from "@reduxjs/toolkit";
import {
  isCartInSessionStorage,
  saveCartToSessionStorage,
  totalCountQuantity,
} from "../components/reusable";

const getInitialProductsCount = () => {
  const cart = sessionStorage.getItem("cart");
  if (!cart) return 0;
  return totalCountQuantity(JSON.parse(cart));
};

const createCart = (state, action) => {
  const cart = [];
  cart.push({
    id: action.payload.id,
    name: action.payload.name,
    img: action.payload.imageName,
    qty: 1,
    size: action.payload.size,
    price: action.payload.price,
  });
  saveCartToSessionStorage(cart);
  ++state.totalProducts;
  state.products = JSON.parse(isCartInSessionStorage());
};

const getProductIndex = (productId, size) => {
  const cart = JSON.parse(isCartInSessionStorage());
  let index = null;
  if (cart) {
    cart.forEach((item, i) => {
      if (item.id === productId && item.size === size) {
        index = i;
      }
    });
  }

  return index;
};

const pushNewProduct = (state, action) => {
  const itemToadd = {
    id: action.payload.id,
    name: action.payload.name,
    img: action.payload.imageName,
    qty: 1,
    size: action.payload.size,
    price: action.payload.price,
  };
  const cart = JSON.parse(isCartInSessionStorage());
  cart.push(itemToadd);
  saveCartToSessionStorage(cart);
  ++state.totalProducts;
  state.products = [...cart];
};

const incrementQuantity = (state, action) => {
  const index = getProductIndex(action.payload.id, action.payload.size);
  const arr = [...state.products];
  arr[index].qty++;
  saveCartToSessionStorage(arr);
  state.products = [...arr];
  ++state.totalProducts;
};
const resetState = (state) => {
  state.totalProducts = 0;
  state.products = [];
  sessionStorage.clear();
};
const removeProduct = (state, action) => {
  const index = getProductIndex(action.payload.id, action.payload.size);
  const newProdState = [...state.products];
  newProdState.splice(index, 1);
  if (state.products.length === 1) {
    resetState(state);
  } else {
    state.totalProducts -= action.payload.qty;
    state.products = [...newProdState];
    saveCartToSessionStorage(newProdState);
  }
};

const decrementQuantity = (state, action) => {
  const index = getProductIndex(action.payload.id, action.payload.size);
  const getArr = [...state.products];
  if (getArr[index].qty === 1) {
    removeProduct(state, action);
  } else {
    --state.totalProducts;
    --getArr[index].qty;
    state.products = [...getArr];
    saveCartToSessionStorage([...getArr]);
  }
};

const adding = (state, action) => {
  const isCart = isCartInSessionStorage();
  if (!isCart) {
    createCart(state, action);
  } else {
    const productIndex = getProductIndex(
      action.payload.id,
      action.payload.size
    );
    if (productIndex !== null) {
      incrementQuantity(state, action);
    } else {
      pushNewProduct(state, action);
    }
  }
};

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    totalProducts: getInitialProductsCount(),
    products: JSON.parse(isCartInSessionStorage()) || [],
  },

  reducers: {
    add: adding,
    increment: incrementQuantity,
    decrement: decrementQuantity,
    remove: removeProduct,
    reset: resetState,
  },
});

export const { add, increment, decrement, remove, reset } = cartSlice.actions;
export default cartSlice.reducer;
