/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import axios from "axios";
import { Link, Navigate } from "react-router-dom";
import Loader from "../loader/loader";
import Popup from "../popup/popup";
import { myUseDispatch, myUseSelector } from "../../redux/reduxHooks";
import {
  deleteUser,
  logoutUser,
  resetState,
  resetUserError,
} from "../../redux/userSlice";
import Orders from "./order";
import { sectionStyle } from "../reusableStyle";

const header2Style = {
  display: "inline-block",
  fontSize: ".9rem",
  minHeight: "1rem",
  "@media(max-width:460px)": {
    minHeight: "1rem",
  },
};
const logoutStyle = {
  textAlign: "right",
  margin: "2rem 0",
  a: {
    color: "red",
  },
};
const sectionContainerStyle = {
  h1: {
    fontSize: "1.1rem",
    padding: "1rem 0 .5rem 0",
  },
  a: {
    fontWeight: "bold",
    color: "red",
  },
  span: {
    paddingLeft: "1.5rem",
    "@media(max-width:460px)": {
      paddingLeft: ".5rem",
    },
  },
};

const ProfileDisplay = ({ user, showOrders }) => {
  const dispatch = myUseDispatch();

  const logUserOut = () => {
    dispatch(logoutUser());
  };

  const deleteUserFunction = () => {
    dispatch(deleteUser(user.username));
  };

  return (
    <section css={sectionStyle}>
      <div css={sectionContainerStyle}>
        <h1>Account Information</h1>
        <div css={logoutStyle}>
          <Link to={"#"} onClick={logUserOut}>
            <span>Logout &rarr;</span>
          </Link>
        </div>

        <h2 css={header2Style}>Welcome {user.firstname},</h2>
        <p>Here is what we have on you!</p>
        <h3 css={header2Style}>Email :</h3>
        <span>
          {user.email} <br />
        </span>
        <h3 css={header2Style}>Home & Delivery Address :</h3>
        <span>
          {user.address}, {user.city} {user.state} {user.zip}
        </span>
        <p>What would you like to do today ?</p>
        <p>
          To update your information please follow this link
          <Link to={"/users/update"}>
            <span>update &rarr;</span>
          </Link>
        </p>
        <p>
          To check your orders follow this link.
          <Link to={"#"} onClick={showOrders}>
            <span>orders &rarr;</span>
          </Link>
        </p>
        <p>
          To delete your account click
          <Link to={"#"} onClick={deleteUserFunction}>
            <span>delete &rarr;</span>
          </Link>
        </p>
      </div>
    </section>
  );
};

const PopupEmptyContainer = () => <div css={sectionStyle}></div>;

const Profile = () => {
  const isLoggedIn = myUseSelector((state) => state.user.isLoggedIn);
  const error = myUseSelector((state) => state.user.error);
  const isDeleted = myUseSelector((state) => state.user.isDeleted);
  const [tokenError, setTokenError] = useState(false);
  const [loader, setLoader] = useState(true);
  const [popup, setPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [user, setUser] = useState({});
  const [displayProfile, setDisplayProfile] = useState(true);
  const [emptyContainer, setEmptyContainer] = useState(false);
  const [showOrders, setShowOrders] = useState(false);

  const showOrderFunction = () => {
    setDisplayProfile(false);
    setShowOrders(true);
  };
  const hideOrderFunction = () => {
    setShowOrders(false);
    setDisplayProfile(true);
  };

  const dispatch = myUseDispatch();

  const tokenRequest = async () => {
    const response = await axios.get(
      `${process.env.REACT_APP_URL}/api/users/profile`,
      {
        withCredentials: true,
      }
    );

    return response;
  };

  const redirect = () => {
    setTimeout(() => {
      setPopupMessage("");
      setPopup(false);
      setTokenError(true);
    }, 1000);
  };

  // check token On mounting
  useEffect(() => {
    tokenRequest()
      .then((response) => {
        const user = { ...response.data.user };
        setUser(user);
        setLoader(false);
      })
      .catch((error) => {
        setDisplayProfile(false);
        setLoader(false);
        setEmptyContainer(true);
        if (error.response.status === 403) {
          setPopupMessage("token not valid");
          setPopup(true);
        } else {
          setPopupMessage("network error");
          setPopup(true);
          dispatch(resetState());
        }
        redirect();
      });
  }, [dispatch]);

  useEffect(() => {
    if (!isLoggedIn) {
      setPopupMessage("you are being logged out");
      setPopup(true);
      redirect();
    }
    if (error) {
      setPopupMessage(error);
      setPopup(true);
      dispatch(resetUserError());
    }

    if (isDeleted) {
      setPopupMessage("your account has been deleted");
      setPopup(true);
      redirect();
    }
  }, [isLoggedIn, error, dispatch, isDeleted]);

  return (
    <>
      {tokenError && <Navigate to={"/"} />}
      {popup && <Popup message={popupMessage} />}
      {emptyContainer && <PopupEmptyContainer />}
      {loader && <Loader />}
      {displayProfile && (
        <ProfileDisplay user={user} showOrders={showOrderFunction} />
      )}
      {showOrders && (
        <Orders firstName={user.firstname} hideOrders={hideOrderFunction} />
      )}
    </>
  );
};

export default Profile;
