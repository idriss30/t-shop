import { CardElement } from "@stripe/react-stripe-js";

const cardOptions = {
  style: {
    base: {
      color: "#32325d",
      fontFamily: "sans-serif",
      fontSize: "16px",
      "::placeholder": {
        color: "#aab7c4",
      },
    },
    invalid: {
      color: "#fa755a",
      iconColor: "#fa755a",
    },
  },
};

const CardForm = () => {
  return (
    <label>
      Card details
      <CardElement options={cardOptions} />
    </label>
  );
};

export default CardForm;
