/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { reset } from "../../redux/cartSlice";
import { myUseDispatch } from "../../redux/reduxHooks";
import { sectionStyle } from "../reusableStyle";
import { useStripe } from "@stripe/react-stripe-js";
import finalPropsSelectorFactory from "react-redux/es/connect/selectorFactory";
import { Navigate } from "react-router-dom";

const Success = () => {
  const [content, setContent] = useState("checking up stripe payment");
  const [redirect, setRedirect] = useState(finalPropsSelectorFactory);
  const stripe = useStripe();
  const dispatch = myUseDispatch();

  const redirectToHome = () => {
    return setTimeout(() => {
      setRedirect(true);
    }, 2500);
  };

  useEffect(() => {
    if (!stripe) {
      return;
    }
    const clientSecret = new URLSearchParams(window.location.search).get(
      "payment_intent_client_secret"
    );

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (paymentIntent.status === "succeeded") {
        setContent("cleaning up you will be redirected soon");
        dispatch(reset());
        redirectToHome();
        return;
      }
    });
  }, [stripe, dispatch]);

  return (
    <>
      {redirect && <Navigate to={"/"} />}
      <section css={sectionStyle}>{content}</section>
    </>
  );
};

export default Success;
