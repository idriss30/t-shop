/** @jsxImportSource @emotion/react */
import { useState } from "react";
import axios from "axios";
import Popup from "../popup/popup";

const sectionStyle = {
  width: "70%",
  margin: "6rem auto",
  "@media(max-width:620px)": {
    width: "75%",
  },
};

const formStyle = {
  width: "50%",
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  "@media(max-width:620px)": {
    width: "75%",
  },

  input: {
    width: "50%",
    padding: ".5rem .2rem",
    textAlign: "center",
    margin: "0 auto",
    borderRadius: "2rem",
    border: "2px solid black",
    "@media(max-width:620px)": {
      width: "75%",
    },
  },

  button: {
    width: "30%",
    margin: "1rem auto",
    padding: ".3rem",
    border: "none",
    backgroundColor: "black",
    color: "white",
    borderRadius: "2rem",
    "@media(max-width:620px)": {
      width: "50%",
    },
  },
};

const headerStyle = {
  marginBottom: "2rem",
  fontSize: "1.2rem",
  textAlign: "center",
  "@media(max-width:420px)": {
    fontSize: "1rem",
  },
};

const NewsLetter = () => {
  const [emailInput, setEmailInput] = useState("");
  const [isFormSubmitted, setIsFormSubmitted] = useState(false);
  const [message, setMessage] = useState("welcome to the t-shop club");
  const onInputChange = (e) => {
    setEmailInput(e.target.value);
  };

  const onFormSubmit = async (e) => {
    e.preventDefault();
    setEmailInput("");
    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/news/email`, {
        email: emailInput,
      });
    } catch (error) {
      setMessage("error adding email");
    }
    setIsFormSubmitted(true);
    return setTimeout(() => {
      setIsFormSubmitted(false);
    }, 2000);
  };

  return isFormSubmitted ? (
    <Popup message={message} />
  ) : (
    <div css={sectionStyle}>
      <h1 css={headerStyle}>Join our newsLetter</h1>
      <form css={formStyle} onSubmit={onFormSubmit}>
        <input
          placeholder="enter your email"
          value={emailInput}
          onChange={onInputChange}
          type={"email"}
          required
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default NewsLetter;
