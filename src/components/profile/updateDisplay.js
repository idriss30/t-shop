/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import Popup from "../popup/popup";
import axios from "axios";
import { Link } from "react-router-dom";

const sectionStyle = {
  width: "70%",
  minHeight: "60vh",
  margin: "6rem auto",
  h1: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },
  a: {
    display: "inline-block",
    color: "red",
    margin: "1rem 0",
  },
  "@media(max-width:620px)": {
    width: "75%",
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

const getUsername = () => {
  const cookies = document.cookie;
  const cookiesArr = cookies.split("=");
  return cookiesArr[1]; // only one cookie is accessible
};

const UpdateProfileForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [usState, setUsState] = useState("");
  const [zip, setZip] = useState("");
  const [username, setUsername] = useState("");
  const [popup, setPopup] = useState(false);
  const [message, setMessage] = useState("");

  const resetPopup = () => {
    setTimeout(() => {
      setPopup(false);
    }, 1000);
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setAddress("");
    setCity("");
    setUsState("");
    setZip("");
  };

  const handleUpdateRequest = async (e) => {
    e.preventDefault();
    resetForm();
    const user = {
      username,
      email,
      password,
      address,
      city,
      state: usState,
      zip,
    };

    try {
      const updateResponse = await axios.put(
        `${process.env.REACT_APP_URL}/api/users/update/${user.username}`,
        { ...user },
        { withCredentials: true }
      );

      if (updateResponse.status === 200) {
        setMessage("your account has been updated");
        setPopup(true);
        resetPopup();
      }
    } catch (error) {
      setMessage(error.message);
      setPopup(true);
      resetPopup();
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setUsername(getUsername());
  }, []);

  return (
    <>
      {popup && <Popup message={message} />}
      <section css={sectionStyle}>
        <div>
          <h1>Please update your information</h1>
          <Link to={"/users/profile"}>&larr; Go back</Link>
          <form onSubmit={async (e) => await handleUpdateRequest(e)}>
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
              value={usState}
              onChange={(e) => setUsState(e.target.value)}
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
            <button>Update now</button>
          </form>
        </div>
      </section>
    </>
  );
};

export default UpdateProfileForm;
