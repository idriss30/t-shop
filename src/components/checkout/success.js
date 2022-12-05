/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { reset } from "../../redux/cartSlice";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import { sectionStyle } from "../reusableStyle";

import { Navigate } from "react-router-dom";

const containerStyle = {
  height: "60vh",
  justifyContent: "center",
  fontSize: "1.5rem",
  color: "red",
  display: "flex",
  alignItems: "center",
};

const Success = () => {
  const [content, setContent] = useState("cleaning up please wait...");
  const products = myUseSelector((state) => state.cart.products);

  const [redirect, setRedirect] = useState(false);

  const dispatch = myUseDispatch();

  const redirectToHome = () => {
    setContent("cleanup done you will be redirected");
    return setTimeout(() => {
      setRedirect(true);
    }, 2500);
  };

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      redirectToHome();
    }
  }, [products.length]);

  return (
    <>
      {redirect && <Navigate to={"/"} />}
      <section css={sectionStyle}>
        <div css={containerStyle}>{content}</div>
      </section>
    </>
  );
};

export default Success;
