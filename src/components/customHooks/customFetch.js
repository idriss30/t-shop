import { useReducer, useEffect } from "react";
import axios from "axios";

const reducer = (state, action) => {
  switch (action.type) {
    case "/fetch/loading":
      return {
        ...state,
        loading: true,
        fetchErr: false,
      };
    case "/fetch/complete": {
      return {
        ...state,
        loading: false,
        fetchErr: false,
        data: action.payload,
      };
    }

    case "/fetch/error": {
      return {
        ...state,
        loading: false,
        fetchErr: true,
      };
    }

    default:
      throw new Error("can't fetch");
  }
};

const useMyCustomFetch = (link, initialItems) => {
  const [state, dispatch] = useReducer(reducer, {
    loading: false,
    fetchErr: false,
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
