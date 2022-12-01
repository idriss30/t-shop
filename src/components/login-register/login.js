/** @jsxImportSource @emotion/react */
import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import { getUser } from "../../redux/userSlice";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import { sectionStyle } from "../reusableStyle";
const sectionContainerStyle = {
  display: "flex",
  justifyContent: "space-between",
  "@media(max-width:680px)": {
    display: "block",
  },
};
const loginFormStyle = {
  flexBasis: "45%",
  height: "50vh",
  "@media(max-width:680px)": {
    height: "40vh",
  },

  h1: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },
  form: {
    input: {
      border: "none", // cancel borders first
      borderBottom: "1px solid black",
      display: "block",
      margin: "1rem 0",
      width: "60%",
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
      margin: "1rem auto",
      width: "35%",
      padding: ".3rem",
      border: "none",
      backgroundColor: "black",
      color: "white",
      cursor: "pointer",
      borderRadius: "2rem",
      "@media(max-width:420px)": {
        width: "70%",
      },
    },
  },
};

const inviteToRegisterStyle = {
  flexBasis: "45%",
  height: "50vh",
  "@media(max-width:680px)": {
    height: "40vh",
    fontSize: ".8rem",
  },

  h2: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },

  a: {
    margin: "1rem auto",
    width: "35%",
    padding: ".05rem",
    border: "none",
    backgroundColor: "black",
    color: "white",
    borderRadius: "2rem",
    display: "inline-block",
    textAlign: "center",
    "@media(max-width:420px)": {
      width: "70%",
    },
  },
};
const contentHeight = {
  minHeight: "20vh",
  "@media(max-width:1005px)": {
    minHeight: "30vh",
  },
  "@media(max-width:680px)": {
    height: "auto",
    minHeight: "auto",
  },
};

const Login = () => {
  const dispatch = myUseDispatch();
  const [popup, setPopup] = useState(false);
  const [message, setPopupMessage] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const autoRemovePopup = () => {
    return setTimeout(() => {
      setPopupMessage("");
      setPopup(false);
    }, 1000);
  };

  const displayPopup = (message) => {
    setPopup(true);
    setPopupMessage(message);
    autoRemovePopup();
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setUsername("");
    setPassword("");
    const user = {
      username,
      password,
    };
    dispatch(getUser(user)).then((response) => {
      if (response.type.includes("rejected")) {
        displayPopup(response.error.message);
      } else {
        displayPopup("setting up your account");
      }
    });
  };

  const removePopupWithClick = () => setPopup(false);

  return (
    <>
      {popup && <Popup message={message} remove={removePopupWithClick} />}

      <section css={sectionStyle}>
        <div css={sectionContainerStyle}>
          <div css={loginFormStyle}>
            <h1>Log in</h1>
            <form onSubmit={handleLogin}>
              <div css={contentHeight}>
                <input
                  type={"text"}
                  placeholder="username"
                  required
                  onChange={(e) => setUsername(e.target.value)}
                  value={username}
                />
                <input
                  type={"password"}
                  placeholder="password"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                  value={password}
                />
              </div>

              <button>Log in</button>
            </form>
          </div>
          <div css={inviteToRegisterStyle}>
            <h2>Register</h2>
            <div css={contentHeight}>
              <p css={{ textTransform: "uppercase" }}>
                If you still don't have a t-shop account, use this option to
                access the registration form.
                <br />
                Provide your details to make t-shop purchases easier.
              </p>
            </div>

            <Link to={"/register"}>Register</Link>
          </div>
        </div>
      </section>
    </>
  );
};

const PageDisplay = () => {
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const isLoading = myUseSelector((state) => state.user.isLoading);
  return (
    <>
      {isLoading && <Loader />}
      {isLoggedIn && <Navigate to={"/users/profile"} />}
      <Login />
    </>
  );
};

export default PageDisplay;
