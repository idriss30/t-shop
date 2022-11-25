/** @jsxImportSource @emotion/react */
import { Link } from "react-router-dom";
import { myUseSelector } from "../../redux/reduxHooks";
import { useState } from "react";
import { totalPrice } from "../reusable";
import { useEffect } from "react";
import axios from "axios";
import { PaymentElement } from "@stripe/react-stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Popup from "../popup/popup";

const sectionStyle = {
  width: "70%",
  minHeight: "60vh",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const formStyle = {
  width: "50%",
  display: "flex",
  flexDirection: "column",
  "@media(max-width:920px)": {
    width: "100%",
  },
  input: {
    border: "none",
    borderBottom: "1px solid black",
    display: "inline-block",
    width: "80%",
    margin: "1rem 0",
    padding: ".5rem 0",
    "&:focus": {
      outline: "none",
      borderBottom: "1px solid red",
    },
    "@media(max-width:420px)": {
      width: "100%",
    },
  },
  button: {
    margin: "2rem 0",
    width: "50%",
    padding: ".3rem",
    border: "none",
    backgroundColor: "black",
    color: "white",
    borderRadius: "2rem",
    "@media(max-width:420px)": {
      width: "70%",
    },
  },
};

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

const CheckoutForm = () => {
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");

  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const userInfo = myUseSelector((state) => state.user.userInfo);

  const autoFillForm = (user) => {
    setFirst(user.firstname);
    setLast(user.lastname);
    setEmail(user.email);
    setAddress(user.address);
    setCity(user.city);
    setState(user.state);
    setZip(user.zip);
  };

  useEffect(() => {
    if (isLoggedIn) {
      autoFillForm(userInfo);
    }
  }, [isLoggedIn, userInfo]);

  return (
    <form css={formStyle}>
      <input
        type={"text"}
        required
        placeholder="first name"
        value={first}
        onChange={(e) => setFirst(e.target.value)}
      />
      <input
        type={"text"}
        required
        placeholder="last name"
        value={last}
        onChange={(e) => setLast(e.target.value)}
      />
      <input
        type={"email"}
        required
        placeholder="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type={"text"}
        required
        placeholder=" delivery address"
        value={address}
        onChange={(e) => setAddress(e.target.value)}
      />
      <input
        type={"text"}
        required
        placeholder="city"
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />
      <input
        type={"text"}
        required
        placeholder="state"
        value={state}
        onChange={(e) => setState(e.target.value)}
      />
      <input
        type={"text"}
        required
        placeholder="zip"
        value={zip}
        minLength={5}
        maxLength={5}
        onChange={(e) => setZip(e.target.value)}
      />
      <PaymentElement />
      <button>Place order</button>
    </form>
  );
};

const Checkout = () => {
  const [stripeToken, setStripeToken] = useState();
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");

  const products = myUseSelector((state) => state.cart.products);
  const stripePromise = loadStripe(`${process.env.REACT_APP_STRIPE}`);
  const options = {
    clientSecret: `{{${stripeToken}}}`,
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const tokenRequest = await axios.post(
          `${process.env.REACT_APP_URL}/api/stripe/paymentIntent`,
          { products }
        );
        setStripeToken(tokenRequest.data.clientSecret);
      } catch (error) {
        setPopupMessage(error);
        setPopup(true);
      }
    };

    (async () => {
      await fetchToken();
    })();
  }, [products]);

  return (
    <>
      {popup && <Popup message={popupMessage} />}
      <section css={sectionStyle}>
        {!isLoggedIn && <InviteToLogin />}
        <h1>your info</h1>
        <Elements stripe={stripePromise} options={options}>
          <CheckoutForm />
        </Elements>
      </section>
    </>
  );
};

export default Checkout;
