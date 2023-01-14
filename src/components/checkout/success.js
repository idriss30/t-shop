/** @jsxImportSource @emotion/react */
import { useEffect } from "react";
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
  const products = myUseSelector((state) => state.cart.products);
  const redirect = useNavigate();
  const dispatch = myUseDispatch();

  useEffect(() => {
    dispatch(reset());
  }, [dispatch]);

  useEffect(() => {
    if (products.length === 0) {
      setTimeout(() => {
        redirect("/");
      }, 1200);
    }
  }, [products.length, redirect]);

  return (
    <section css={sectionStyle}>
      <div css={containerStyle}>cleaning up you will be redirected</div>
    </section>
  );
};

export default Success;
