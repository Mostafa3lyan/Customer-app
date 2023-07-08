import axios from "axios";
import { cartActions } from "./cartSlice";
import { menusActions } from "./menusSlice";
import { toastActions } from "./toastSlice";
import { ordActions } from "./ord";

export const getCart = (id) => {
  return async (dispatch) => {
    const getAll = async () => {
      const { data } = await axios.get(
        `http://127.0.0.1:8000/customer/view_cart/${id}/`
      );
      console.log(data);
      return data;
    };
    try {
      dispatch(cartActions.setWaitingTrue());
      const data = await getAll();
      dispatch(cartActions.setWaitingFalse());
      dispatch(cartActions.getCartFromDb(data));
      dispatch(cartActions.clearCartError());
    } catch (err) {
      console.log(err);
      dispatch(cartActions.setErrorInGetCart(err));
      dispatch(cartActions.setWaitingFalse());
    }
  };
};

export const checkOut = (id) => {
  return async (dispatch) => {
    const getAll = async () => {
      const data = await fetch(`http://127.0.0.1:8000/customer/checkout`, {
        method: "POST",
        body: JSON.stringify({ customer_id: id }),
      });
      if(!data.ok) throw new Error('some thing wrong')
      const response = await data.json()
      return response.order_id;
    };
    try {
      dispatch(cartActions.setWaitingTrue());
      const orderId =  await getAll();
      dispatch(getSingleOrder(orderId))
      dispatch(
        toastActions.setToast({
          message: `We Recieved Your Order Succefully`,
          close: 5000,
          type: "success",
        })
      );
      
      dispatch(ordActions.requireRender());
      dispatch(cartActions.setWaitingFalse());
      dispatch(menusActions.setRequieRender());
      dispatch(cartActions.clearCartError());
    } catch (err) {
      console.log(err);
      dispatch(cartActions.setErrorInGetCart(err));
      dispatch(cartActions.setWaitingFalse());
    }
  };
};
export const outOrder = (info) => {
  
  return async (dispatch) => {
    const getAll = async () => {
      const data = await fetch(`http://127.0.0.1:8000/customer/pick_order`, {
        method: "POST",
        body: JSON.stringify(info),
      });
      console.log(data)
      
      if(!data.ok) throw new Error('something wrong')
      const response = await data.json()
      console.log(response.order_id)
      return response.order_id;
    };
    try {
      dispatch(cartActions.setWaitingTrue(true));
      const orderId = await getAll();
      dispatch(cartActions.setId(orderId))
      dispatch(
        toastActions.setToast({
          message: `We Recieved Your Order Succefully`,
          close: 5000,
          type: "success",
        })
      );
      
      dispatch(ordActions.requireRender());
      dispatch(cartActions.setWaitingFalse());
      dispatch(menusActions.setRequieRender());
      dispatch(cartActions.clearCartError());
    } catch (err) {
      console.log(err);
      dispatch(cartActions.setErrorInGetCart(err));
      dispatch(cartActions.setWaitingFalse());
    }
  };
};

export const getSingleOrder = (id) => {
  return async (dispatch) => {
    const getAll = async () => {
      dispatch(cartActions.setId(""));
      const  data  = await fetch(
        `http://127.0.0.1:8000/customer/track_order/${id}/`
      );
      console.log(data)
      if(!data.ok) throw new Error('something wrong')
      const response = await data.json() 
      return response;
    };
    try {
      
      dispatch(cartActions.setWaitingTrue());
      const data = await getAll();
      dispatch(cartActions.setWaitingFalse());
      dispatch(ordActions.getSingleOrderFromDb(data));
      dispatch(cartActions.clearCartError());
    } catch (err) {
      console.log(err);
      dispatch(cartActions.setErrorInGetCart(err));
      dispatch(cartActions.setWaitingFalse());
    }
  };
};