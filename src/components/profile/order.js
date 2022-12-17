/** @jsxImportSource @emotion/react */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useMyCustomFetch from "../customHooks/customFetch";
import Loader from "../loader/loader";
import { sectionStyle } from "../reusableStyle";

const noOrderStyle = {
  p: {
    fontSize: "1.5rem",
    fontWeight: "bold",
  },
};

const renderOrdersStyle = {
  minHeight: "70vh",
  span: {
    color: "red",
    fontWeight: "bold",
  },

  ul: {
    listStyle: "none",
    li: {
      borderTop: "2px solid black",
    },
    "@media(max-width:520px)": {
      paddingLeft: "0px",
    },
  },
};

const orderInfoStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  height: "20vh",
  width: "80%",
  backgroundColor: "whiteSmoke",
  padding: "0rem 1rem",
  margin: "1.5rem 0",
  img: {
    width: "120px",
    height: "120px",
  },
  "@media(max-width:520px)": {
    width: "100%",
    paddingRight: "0px",
  },
};

const NoOrders = ({ firstName }) => {
  return (
    <div css={noOrderStyle}>
      <p>No orders found for your account {firstName}.</p>
      <p>Please visit the store and get you some nice tee-shirts !</p>
    </div>
  );
};

const RenderOrders = ({ orders }) => {
  return (
    <div css={renderOrdersStyle}>
      <p>
        we have <span>{orders.length}</span> order(s) on you
      </p>
      <ul>
        {orders.map((order) => {
          return (
            <li key={order.id}>
              <p>
                One order created :
                {new Date(`${order.createdAt}`).toLocaleString()} for a total of
                <span> ${order.totalOrder}</span>
              </p>
              <div>
                <p>
                  To be delivered at:
                  <span>{` ${order.address} ${order.city} ${order.state} ${order.zip}`}</span>
                </p>
                <p>Item(s) for this order:</p>
                <p>Click image picture to see product</p>
              </div>
              <div>
                {Object.values(JSON.parse(order.items)).map((item) => {
                  return (
                    <div key={order.id + Math.random()} css={orderInfoStyle}>
                      <p>
                        {` ${item.qty} ${item.size} ${item.name.toLowerCase()}`}
                      </p>
                      <Link to={`/shop/${item.img}`}>
                        <img
                          src={require(`../../assets/${item.img}-display.jpg`)}
                          alt={item.name}
                        />
                      </Link>
                    </div>
                  );
                })}
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const Orders = ({ firstName, hideOrders }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [content, setContent] = useState("");
  const orderState = useMyCustomFetch(
    `${process.env.REACT_APP_URL}/api/cart/orders/${firstName}`,
    { orders: [] }
  );
  const { loading, fetchErr, data } = orderState;
  // const ordersInfo = data.orders;
  useEffect(() => {
    if (loading) {
      setIsLoading(true);
    }
    if (fetchErr) {
      setIsLoading(false);
      setContent(<NoOrders firstName={firstName} />);
    }
    if (data) {
      setIsLoading(false);
      if (data.orders.length === 0)
        return setContent(<NoOrders firstName={firstName} />);
      setContent(<RenderOrders orders={data.orders} />);
    }
  }, [loading, fetchErr, data, firstName]);

  return (
    <>
      {isLoading && <Loader />}

      <section css={sectionStyle}>
        <h1>Orders details</h1>
        <Link to={"#"} onClick={hideOrders}>
          <span> &larr; Go back</span>
        </Link>
        {content}
      </section>
    </>
  );
};

export default Orders;
