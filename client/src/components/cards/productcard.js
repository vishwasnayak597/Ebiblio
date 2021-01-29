import React,{useState} from "react";
import { Card,Tooltip } from "antd";
import { EyeOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import book1 from "../../images/book1.jpg";
import { Link } from "react-router-dom";
import { showAverage } from "../../functions/rating";
import _ from "lodash";
import {useSelector,useDispatch} from 'react-redux'

const { Meta } = Card;
const ProductCard = ({ product }) => {
const [tooltip, setTooltip] = useState("Click to add");

 // redux
 const { user, cart } = useSelector((state) => ({ ...state }));
 const dispatch = useDispatch();

const handleAddToCart = () => {
  // create cart array
  let cart = [];
  if (typeof window !== "undefined") {
    // if cart is in local storage GET it
    if (localStorage.getItem("cart")) {
      cart = JSON.parse(localStorage.getItem("cart"));
    }

    // push new product to cart
    cart.push({...product,
      count: 1,
    });
    // remove duplicates usimg lodash method
    let unique = _.uniqWith(cart, _.isEqual);
    // save to local storage
    
    localStorage.setItem("cart", JSON.stringify(unique));
    // show tooltip
    setTooltip("Added"); //tooltip  at top
      // add to reeux state
      dispatch({
        type: "ADD_TO_CART",
        payload: unique,
      });
      //show cart item in drawe
      dispatch({
        type: "SET_VISIBLE",
        payload: true,
      });
  }
};

  // destructure
  const { images, title, description, slug ,price} = product;
  return (
    <>
    {product && product.ratings && product.ratings.length > 0 ? (
      showAverage(product)
    ) : (
      <div className="text-center pt-1 pb-3">No rating yet</div>
    )}
    <Card
      cover={
        <img
          src={images && images.length ? images[0].url : book1}
          style={{ height: "150px", objectFit: "cover" }} alt="novel"
          className="p-1"
        />
      }
      actions={[
        <Link to={`/product/${slug}`}>
          <EyeOutlined className="text-warning" /> <br /> View Product
        </Link>,
        <Tooltip  title={tooltip}>
          <a onClick={handleAddToCart} disabled={product.quantity<1}>
          <ShoppingCartOutlined className="text-danger" /> <br />
            {product.quantity <1 ? 'Out of Stock':'Add to cart'}
        </a>,
        </Tooltip>
        
      ]}
    >
      <Meta
        title={`${title}- Rs. ${price} `}
        description={`${description && description.substring(0, 40)}...`}
      />
    </Card>
    </>
  );
};

export default ProductCard;
