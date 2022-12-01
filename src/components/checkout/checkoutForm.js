/** @jsxImportSource @emotion/react */
import { myUseSelector } from "../../redux/reduxHooks";
import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { useEffect } from "react";
import Loader from "../loader/loader";
import Popup from "../popup/popup";

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
  const [first, setFirst] = useState("");
  const [last, setLast] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
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

  const removePopup = () => setPopup(false);

  useEffect(() => {
    if (isLoggedIn) {
      autoFillForm(userInfo);
    }
  }, [isLoggedIn, userInfo]);

  useEffect(() => {
    if (!stripe) {
      return;
    }

    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    if (!clientSecret) {
      return;
    }

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      switch (paymentIntent.status) {
        case "succeeded":
          setPopupMessage("Payment succeeded!");
          setPopup(true);
          break;
        case "processing":
          setPopupMessage("Your payment is processing.");
          setPopup(true);
          break;
        case "requires_payment_method":
          setPopupMessage("Your payment was not successful, please try again.");
          setPopup(true);
          break;
        default:
          setPopupMessage("Something went wrong.");
          setPopup(true);
          break;
      }
    });
  }, [stripe]);

  useEffect(() => {
    if (popup) {
      setTimeout(() => {
        setPopup(false);
      }, 2000);
    }
  }, [popup]);

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: "http://localhost:3000/",
      },
    });
    setIsLoading(false);
    if (error.type === "card_error" || error.type === "validation_error") {
      setPopupMessage(error.message);
      setPopup(true);
    } else {
      setPopupMessage("An unexpected error occurred.");
      setPopup(true);
    }
  };

  const paymentElementOptions = {
    layout: "tabs",
  };

  return (
    <>
      {isLoading && <Loader />}
      {popup && <Popup message={popupMessage} remove={removePopup} />}
      <form css={formStyle} onSubmit={handleFormSubmit}>
        <div css={formContainerStyle}>
          {/*   <div css={customFormStyle}>
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
          </div> */}
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
