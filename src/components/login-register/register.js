/** @jsxImportSource @emotion/react */
import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import { sectionStyle } from "../reusableStyle";

const containerStyle = {
  h1: {
    fontSize: "1.1rem",
  },
  p: {
    fontSize: "1.2rem",
    cursor: "pointer",
  },
  form: {
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
  },
};
const formGroupStyle = {
  display: "flex",
  height: "2rem",
  margin: "1rem 0",
  alignItems: "center",
  input: {
    flexBasis: "2rem",
  },
};
const Register = () => {
  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
  }, []);

  const [userName, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [zip, setZip] = useState("");
  const [terms, setTerms] = useState(false);
  const [loader, setLoader] = useState(false);
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState("");

  const resetAll = () => {
    setUsername("");
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setAddress("");
    setCity("");
    setState("");
    setZip("");
    setTerms(false);
  };

  const renderPopup = (message) => {
    setPopup(true);
    setMessage(message);
  };

  const removePopup = () => {
    return setTimeout(() => {
      setPopup(false);
    }, 2000);
  };

  const handleRegister = async () => {
    setLoader(true);
    const userInfo = {
      username: userName,
      firstname: firstName,
      lastname: lastName,
      password,
      email,
      address,
      city,
      state,
      zip,
    };
    try {
      await axios.post(`${process.env.REACT_APP_URL}/api/users/register`, {
        ...userInfo,
      });
      setLoader(false);
      renderPopup("your account was created");
      removePopup();
    } catch (error) {
      setLoader(false);
      renderPopup("sorry can't create your account try later !");
      removePopup();
    }
  };
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    resetAll();
    await handleRegister();
  };

  return (
    <>
      <section css={sectionStyle}>
        <div css={containerStyle}>
          <h1>Register</h1>
          <Link to={"/login"}>
            <p>&larr;</p>
          </Link>
          <form onSubmit={handleFormSubmit}>
            <input
              type={"text"}
              placeholder="username"
              required
              value={userName}
              onChange={(e) => setUsername(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="first name"
              required
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="last name"
              required
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type={"email"}
              placeholder="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <input
              type={"password"}
              placeholder="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="city"
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="state"
              required
              value={state}
              onChange={(e) => setState(e.target.value)}
            />
            <input
              type={"text"}
              placeholder="Zip code"
              required
              minLength={5}
              maxLength={5}
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
            <div css={formGroupStyle}>
              <input
                id="checkbox"
                type={"checkbox"}
                checked={terms}
                required
                onChange={() => setTerms(!terms)}
              />
              <label htmlFor="checkbox">
                I agree to the terms and conditions
              </label>
            </div>

            <button>Register</button>
          </form>
        </div>
      </section>
      {popup && <Popup message={message} />}
      {loader && <Loader />}
    </>
  );
};

export default Register;
