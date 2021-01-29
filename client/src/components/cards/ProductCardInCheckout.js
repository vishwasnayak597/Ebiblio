import React from "react";
import ModalImage from 'react-modal-image';
import Book1 from '../../images/book1.jpg';
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import {CheckCircleOutlined,CloseCircleOutlined,CloseOutlined} from "@ant-design/icons";

const ProductCardInCheckout = ({ p }) => {
    let dispatch = useDispatch();

    const handleQuantityChange = (e) => {
    let count = e.target.value < 1 ? 1 : e.target.value;  //preventing qty less than 1

    if (count > p.quantity) {     //check whether count is more than actual quantity in stock
      toast.error(`Max available quantity: ${p.quantity}`);
      return;
    }

    let cart = [];

    if (typeof window !== "undefined") {  //if we have window obj grab local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }

      cart.map((product, i) => {
        if (product._id === p._id) {  //check if product id matches one which is in card
          cart[i].count = count;  //get each product
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart)); //setback cart info to local storage
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  const handleRemove = () => {
    let cart = [];

    if (typeof window !== "undefined") {   //checking if its there in local storage
      if (localStorage.getItem("cart")) {
        cart = JSON.parse(localStorage.getItem("cart"));
      }
      // [1,2,3,4,5]  suppose index 3 - 3rd item in array is removed then check and remove item
      cart.map((product, i) => {
        if (product._id === p._id) {
          cart.splice(i, 1);  //remove item when product of actual item(p) matches of that in cart product
        }
      });

      localStorage.setItem("cart", JSON.stringify(cart));
      dispatch({
        type: "ADD_TO_CART",
        payload: cart,
      });
    }
  };

  return (
    <tbody>
      <tr>
        <td>
          <div style={{width:"100px",height:"auto"}}>                             
            {p.images.length ? (<ModalImage small={p.images[0].url} large={p.images[0].url} />)
            :
            (
                <ModalImage small={Book1} large={Book1} />
            ) }
          </div>
        </td>
        <td>{p.title}</td>
        <td>Rs. {p.price} </td>
        <td>
          <input
            type="number" step="1"
            className="form-control"
            value={p.count}
            onChange={handleQuantityChange}
          />
        </td>
        <td className="text-center">
          {p.shipping === "Yes" ? (
            <CheckCircleOutlined className="text-success" /> /* shipping icon */
          ) : (
            <CloseCircleOutlined className="text-danger" />
          )}
        </td>
        
        <td className="text-center">
          <CloseOutlined
            onClick={handleRemove}
            className="text-danger pointer"
          />
        </td>
      </tr>
    </tbody>
  );
};

export default ProductCardInCheckout;
