/** @jsxImportSource @emotion/react */
import { myUseSelector } from "../../redux/reduxHooks";
import { useState } from "react";
import { useEffect } from "react";
import { useStripe, useElements, CardElement } from "@stripe/react-stripe-js";
import { useNavigate } from "react-router-dom";
import { totalPrice } from "../reusable";
import Popup from "../popup/popup";
import axios from "axios";
import { reducedLoaderStyle, reducedPopupStyle } from "../reusableStyle";
import Loader from "../loader/loader";

const formStyle = {
  width: "100%",
  minHeight: "80vh",
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
    "@media(max-width:920px)": {
      width: "100%",
    },
  },
  button: {
    display: "block",
    margin: "3rem 0",
    width: "50%",
    padding: ".3rem",
    border: "none",
    backgroundColor: "black",
    color: "white",
    borderRadius: "2rem",

    "@media(max-width:420px)": {
      width: "100%",
    },
  },
};

const formContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  height: "100%",

  "@media(max-width:870px)": {
    display: "block",
  },
};

const customFormStyle = {
  flexBasis: "50%",
  "@media(max-width:820px)": {
    marginBottom: "2rem",
  },
};

const stripeFormStyle = {
  backgroundColor: "whitesmoke",
  flexBasis: "45%",
  height: "80%",
  padding: "0rem 1rem",
  position: "sticky",
  top: "2rem",
};

const stripeElementStyle = {
  margin: "2rem 0",
  borderBottom: "1px solid black",
  padding: "1rem 0",
};

const title = {
  fontSize: "1.1rem",
  margin: "2rem 0",
};

const CheckoutForm = () => {
  const userInfo = myUseSelector((state) => state.user.userInfo);
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const products = myUseSelector((state) => state.cart.products);
  const [first, setFirst] = useState(userInfo.firstname || "");
  const [last, setLast] = useState(userInfo.lastname || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [address, setAddress] = useState(userInfo.address || "");
  const [city, setCity] = useState(userInfo.city || "");
  const [state, setState] = useState(userInfo.state || "");
  const [zip, setZip] = useState(userInfo.zip || "");
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [loading, setIsLoading] = useState(true);
  const [tokenError, setTokenError] = useState(false);
  const [clientSecret, setClientSecret] = useState("");
  const removePopup = () => setPopup(false);
  const navigate = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const getUserInfoIfLoggeIn = async () => {
    const sendRequest = await axios.get(
      `${process.env.REACT_APP_URL}/api/users/profile`,
      { withCredentials: true }
    );
    return sendRequest.data;
  };

  const autoFillForm = (user) => {
    setFirst(user.firstname);
    setLast(user.lastname);
    setEmail(user.email);
    setAddress(user.address);
    setCity(user.city);
    setState(user.state);
    setZip(user.zip);
  };

  const postOrderToDatabase = async () => {
    let id = userInfo.id;
    const total = totalPrice(products);
    const items = JSON.stringify(products);

    const order = {
      first,
      last,
      email,
      address,
      city,
      state,
      zip,
      id: id,
      total,
      items,
    };
    const postResponse = await axios.post(
      `${process.env.REACT_APP_URL}/api/cart/orders`,
      {
        order,
      }
    );

    return postResponse;
  };

  const redirectOnSuccess = () => {
    setTimeout(() => {
      navigate("/success");
    }, 1200);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    if (!stripe || !elements) {
      return;
    }

    const result = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    const { error, paymentIntent } = result;
    if (error) {
      setIsLoading(false);
      setPopupMessage(error.message);
      setPopup(true);
      return;
    }
    if (paymentIntent.status === "succeeded") {
      try {
        await postOrderToDatabase();
        setIsLoading(false);
        setPopupMessage("your order has been placed. Redirecting...");
        setPopup(true);
        redirectOnSuccess();
      } catch (error) {
        setIsLoading(false);
        setPopupMessage(error.message);
        setPopup(true);
      }
    }
  };

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
        setIsLoading(false);
        setClientSecret(response.clientSecret);
      })
      .catch((error) => {
        setIsLoading(false);
        setPopupMessage(error.message);
        setPopup(true);
        setTokenError(true);
      });
  }, [products]);

  useEffect(() => {
    if (products.length === 0 || tokenError) {
      setTimeout(() => {
        navigate("/");
      }, 1000);
    }
  }, [navigate, products.length, tokenError]);

  useEffect(() => {
    if (isLoggedIn && Object.keys(userInfo).length === 0) {
      getUserInfoIfLoggeIn()
        .then((response) => {
          let userDetails = { ...response.user };
          autoFillForm(userDetails);
        })
        .catch((error) => {
          setPopupMessage(error.message);
          setPopup(true);
        });
    }
  }, [isLoggedIn, userInfo]);

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup(false);
      }, 1500);
    }
  }, [popup]);

  return (
    <>
      {loading && <Loader style={reducedLoaderStyle} />}
      {popup && (
        <Popup
          message={popupMessage}
          remove={removePopup}
          style={reducedPopupStyle}
        />
      )}
      {isLoggedIn && (
        <>
          <h1 css={title}>Hello, {first}</h1>
          <p>
            Make sure any autofilled information is correct before submitting
          </p>
        </>
      )}

      <form title={"checkout-form"} css={formStyle} onSubmit={handleFormSubmit}>
        <div css={formContainerStyle}>
          <div css={customFormStyle}>
            <h2 css={title}>Personal Information</h2>
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
              placeholder="delivery address"
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
          </div>
          <div css={stripeFormStyle}>
            <h3 css={title}>Card information</h3>
            <p>
              use following demo card info for successfull payment: {<br />}
              <span css={{ color: "red" }}>4242424242424242</span>
              {<br />}
              Followed by any Zip code or CVV
            </p>
            <p>
              For unsuccessfull payment use: {<br />}
              <span css={{ color: "red" }}>4000000000009995</span>
              {<br />}
              Followed by any Zip code or CVV
            </p>
            <div css={stripeElementStyle}>
              <CardElement />
            </div>
          </div>
        </div>
        <button disabled={!stripe}>Place order</button>
      </form>
    </>
  );
};

export default CheckoutForm;
