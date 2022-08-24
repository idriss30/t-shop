import { useReducer, useEffect } from "react";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "/fetch/loading":
      return {
        ...state,
        loading: true,
        error: false,
      };
    case "/fetch/complete": {
      return {
        loading: false,
        error: false,
        ...state,
        data: action.payload,
      };
    }

    case "/fetch/error": {
      return {
        ...state,
        loading: false,
        error: true,
      };
    }

    default:
      throw new Error("can't fetch");
  }
};

const useMyCustomFetch = (link, initialItems) => {
  const [state, dispatch] = useReducer(reducer, {
    error: false,
    loading: false,
    data: initialItems,
  });

  useEffect(() => {
    let isComponentMounted = false;
    const fetchData = async () => {
      try {
        dispatch({ type: "/fetch/loading" });
        const fetchResponse = await axios.get(link);
        if (!isComponentMounted) {
          dispatch({ type: "/fetch/complete", payload: fetchResponse.data });
        }
      } catch (error) {
        dispatch({ type: "/fetch/error" });
      }
    };

    fetchData();
    return () => {
      isComponentMounted = true;
    };
  }, [link]);

  return state;
};

export default useMyCustomFetch;
