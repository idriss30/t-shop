/** @jsxImportSource @emotion/react */
import { Link, Navigate } from "react-router-dom";
import { myUseSelector } from "../../redux/reduxHooks";
import { useEffect, useState } from "react";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";
import axios from "axios";
import Popup from "../popup/popup";
import { sectionStyle } from "../reusableStyle";
const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE}`);

const InviteToLogin = () => {
  return (
    <>
      <h1> Do you have an account ?</h1>
      <p>
        login <Link to="/login"> here &rarr;</Link> to autofill the form.
      </p>
      <p>Or please provide your details to checkout as a guest </p>
    </>
  );
};

const Checkout = () => {
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const [clientSecret, setClientSecret] = useState();
  const products = myUseSelector((state) => state.cart.products);
  const [popup, setPopup] = useState(false);
  const [redirect, setRedirect] = useState(false);
  const [popupMessage, setPopupMessage] = useState();

  useEffect(() => {
    const fetchToken = async () => {
      const response = await axios.post(
        `${process.env.REACT_APP_URL}/api/stripe/paymentIntent`,
        { products }
      );
      return response.data;
    };
    fetchToken()
      .then((response) => {
        setClientSecret(response.clientSecret);
      })
      .catch((error) => {
        setPopupMessage(error.message);
        setPopup(true);
      });
  }, [products]);

  useEffect(() => {
    if (products.length === 0) {
      setRedirect(true);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  const appearance = {
    theme: "stripe",
  };
  const options = {
    clientSecret,
    appearance,
  };

  return (
    <>
      {redirect && <Navigate to={"/"} />}
      {popup && <Popup message={popupMessage} remove={() => setPopup(false)} />}
      <section css={sectionStyle}>
        {!isLoggedIn && <InviteToLogin />}
        {clientSecret && (
          <Elements stripe={stripePromise} options={options} key={clientSecret}>
            <CheckoutForm />
          </Elements>
        )}
      </section>
    </>
  );
};

export default Checkout;
