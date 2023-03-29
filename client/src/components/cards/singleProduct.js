import React,{useState} from "react";
import { Card,Tabs } from "antd";
import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import ProductListItems from "./productlistitems";
import Book from '../../images/book1.jpg';
import StarRating from "react-star-ratings";
import RatingModal from '../modal/starmodal';
import {showAverage} from '../../functions/rating';
import { Tooltip } from "antd";
import _ from "lodash";
import {useSelector,useDispatch} from 'react-redux'
import { addToWishlist } from "../../functions/user";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

const { TabPane } = Tabs;

// this is childrend component of Product page
const SingleProduct = ({ product,onStarClick,star }) => {
  const { title, images, description,review,_id } = product;

  const [tooltip, setTooltip] = useState("Click to add");

  // redux
  const { user, cart } = useSelector((state) => ({ ...state }));
  const dispatch = useDispatch();
  let history = useHistory();

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
   
  const handleAddToWishlist = (e) => {
    e.preventDefault();
    addToWishlist(product._id, user.token).then((res) => {
      console.log("ADDED TO WISHLIST", res.data);
      toast.success("Added to wishlist");
      history.push("/user/wishlist");
    });
  };

  
  return (
    <>
      <div className="col-md-7">
        {images && images.length ? (
          <Carousel showArrows={true} autoPlay infiniteLoop>
            {images && images.map((i) => <img src={i.url} key={i.public_id} />)}
          </Carousel>
        ) : (
          <Card cover={<img src={Book} className="mb-3 card-image" />}></Card>
        )}
        

        <Tabs type="card">
          <TabPane tab="Description" key="1"> 
            {description && description} {/*if we have description */}
          </TabPane> 
          <TabPane tab="Admin book review" key="2">
            {review && review}
          </TabPane>
        </Tabs>
      </div>

      <div className="col-md-5">
        <h1 className="bg-info p-3">{title}</h1>
         
        {product && product.ratings && product.ratings.length > 0
          ? showAverage(product)
          : (
            <div className="text-center pt-1 pb-3">No rating yet</div>
          )}
  

        <Card
          actions={[
            <Tooltip  title={tooltip}>
          <a onClick={handleAddToCart} disabled={product.quantity<1}>
          <ShoppingCartOutlined className="text-danger" /> <br />
            {product.quantity <1 ? 'Out of Stock':'Add to cart'}
        </a>,
        </Tooltip>,
             <a onClick={handleAddToWishlist}>
             <HeartOutlined className="text-info" /> <br /> Add to Wishlist
           </a>,
            <RatingModal>
              <StarRating
                name={_id}
                numberOfStars={5}
                rating={star}
                changeRating={onStarClick}
                isSelectable={true}
                starRatedColor="red"
              />
            </RatingModal>,
          ]}
        >
          <ProductListItems product={product} />
        </Card>
      </div>
    </>
  );
};

export default SingleProduct;
