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
    <div>
      <p>we have {orders.length} order(s) on you</p>
      <ul>
        {orders.map((order, index) => {
          return (
            <li key={order.id}>
              <p>
                order {index + 1} created :
                {new Date(`${order.createdAt}`).toLocaleString()} for a total of
                <span> ${order.totalOrder}</span>
              </p>
              <div>
                <p>
                  To be delivered at:
                  {` ${order.address} ${order.city} ${order.state} ${order.zip}`}
                </p>
              </div>
              <div>
                {Object.values(JSON.parse(order.items)).map((item) => {
                  return (
                    <div key={order.id}>
                      <p>Items for this order:</p>
                      <p>
                        <img
                          src={require(`../../assets/${item.img}-display.jpg`)}
                          alt={item.name}
                        />
                        <span>{item.name.toLowerCase()}</span>
                      </p>
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
