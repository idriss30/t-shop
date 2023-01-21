/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import { myUseSelector } from "../../redux/reduxHooks";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import CheckoutForm from "./checkoutForm";

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
  return (
    <>
      <section css={sectionStyle}>
        {!isLoggedIn && <InviteToLogin />}
        <Elements stripe={stripePromise}>
          <CheckoutForm />
        </Elements>
      </section>
    </>
  );
};

export default Checkout;
