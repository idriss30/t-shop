/** @jsxImportSource @emotion/react */
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import axios from "axios";
import { totalPrice } from "../reusable";
import { Navigate } from "react-router-dom";
import { reducedLoaderStyle, reducedPopupStyle } from "../reusableStyle";

const formStyle = {
  width: "100%",
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
      width: "90%",
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
  flexDirection: "row",
  flexWrap: "wrap",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  "@media(max-width:820px)": {
    flexDirection: "column",
  },
};

const customFormStyle = {
  flexBasis: "45%",
  "@media(max-width:820px)": {
    marginBottom: "2rem",
  },
};
const stripeFormStyle = {
  flexBasis: "45%",
  backgroundColor: "whiteSmoke",
  padding: "1rem",
  "@media(max-width:820px)": {
    width: "75%",
  },
  "@media(max-width:420px)": {
    width: "90%",
  },
};

const CheckoutForm = () => {
  const stripe = useStripe();
  const elements = useElements();
  const userInfo = myUseSelector((state) => state.user.userInfo);
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const dispatch = myUseDispatch();
  const [first, setFirst] = useState(userInfo.firstname || "");
  const [last, setLast] = useState(userInfo.lastname || "");
  const [email, setEmail] = useState(userInfo.email || "");
  const [address, setAddress] = useState(userInfo.address || "");
  const [city, setCity] = useState(userInfo.city || "");
  const [state, setState] = useState(userInfo.state || "");
  const [zip, setZip] = useState(userInfo.zip || "");
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [redirect, setRedirect] = useState(false);

  const products = myUseSelector((state) => state.cart.products);

  const removePopup = () => setPopup(false);

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

  useEffect(() => {
    if (isLoggedIn && !userInfo.length >= 0) {
      setIsLoading(true);
      getUserInfoIfLoggeIn()
        .then((response) => {
          let userDetails = { ...response.user };
          setIsLoading(false);
          autoFillForm(userDetails);
        })
        .catch((error) => {
          setIsLoading(false);
          setPopupMessage(error.message);
          setPopup(true);
        });
    }
  }, [isLoggedIn, userInfo.length, dispatch]);

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup(false);
      }, 2000);
    }
  }, [popup]);

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
      id: id || null,
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

  const redirectToHome = () => {
    return setTimeout(() => {
      setRedirect(true);
    }, 2000);
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/success",
      },
      redirect: "if_required",
    });
    setIsLoading(false);
    if (error) {
      setPopupMessage(error.message);
      setPopup(true);
    } else {
      try {
        await postOrderToDatabase();
        setPopupMessage("your order has been placed");
        setPopup(true);
        redirectToHome();
      } catch (error) {
        setPopupMessage(error.message);
        setPopup(true);
      }
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      {redirect && <Navigate to="/success" />}
      {isLoading && <Loader style={reducedLoaderStyle} />}
      {popup && (
        <Popup
          message={popupMessage}
          remove={removePopup}
          style={reducedPopupStyle}
        />
      )}
      <form css={formStyle} onSubmit={handleFormSubmit}>
        <div css={formContainerStyle}>
          <div css={customFormStyle}>
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
            <PaymentElement options={paymentElementOptions} />
          </div>
        </div>

        <button>Place order</button>
      </form>
    </>
  );
};

export default CheckoutForm;
