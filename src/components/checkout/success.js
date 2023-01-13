/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { reset } from "../../redux/cartSlice";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import { sectionStyle } from "../reusableStyle";

import { useNavigate } from "react-router-dom";

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
  const redirect = useNavigate();
  const dispatch = myUseDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      setContent("cleanup done you will be redirected");
      setTimeout(() => {
        redirect("/");
      }, 2000);
    }
  }, [products.length, redirect]);

  return (
    <section css={sectionStyle}>
      <div css={containerStyle}>{content}</div>
    </section>
  );
};

export default Success;
