/** @jsxImportSource @emotion/react */
import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer/footer";
import Home from "./components/home/home";
import Gender from "./components/GenderComponent/genderComponent";
import { NavBar } from "./components/navBar/navBar";
import SingleProduct from "./components/singleProduct/singleProduct";
import { Cart } from "./components/cart/cart";

function App() {
  return (
    <div className="App">
      <NavBar counter={0} />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/man" element={<Gender />} />
        <Route path="/woman" element={<Gender />}></Route>
        <Route path="/shop/:productName" element={<SingleProduct />}></Route>
        <Route path="/cart" element={<Cart />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
