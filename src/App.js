import { Route, Routes } from "react-router-dom";
import Footer from "./components/footer/footer";
import Home from "./components/home/home";
import Gender from "./components/GenderComponent/genderComponent";
import { NavBar } from "./components/navBar/navBar";
import SingleProduct from "./components/singleProduct/singleProduct";
import { Cart } from "./components/cart/cart";
import PageDisplay from "./components/login-register/login";
import Register from "./components/login-register/register";
import Profile from "./components/profile/profile";
import UpdateProfileForm from "./components/profile/updateDisplay";
import Checkout from "./components/checkout/checkout";
import Success from "./components/checkout/success";
import Render404 from "./components/404/404";

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
        <Route path="/login" element={<PageDisplay />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/users/profile" element={<Profile />}></Route>
        <Route path="/users/update" element={<UpdateProfileForm />}></Route>
        <Route path="/checkout" element={<Checkout />}></Route>
        <Route path="/success" element={<Success />}></Route>
        <Route path="/about" element={<Render404 />}></Route>
        <Route path="/terms" element={<Render404 />}></Route>
        <Route path="/privacy" element={<Render404 />}></Route>
        <Route path="*" element={<Render404 />}></Route>
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
