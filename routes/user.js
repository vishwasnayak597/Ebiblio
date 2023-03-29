const express=require('express');

const router=express.Router();

 //import middlewares
 const {authCheck}=require('../middlewares/auth');

 //controller
const { userCart,getUserCart,emptyCart, saveAddress,applyCouponToUserCart,
    createOrder,orders,addToWishlist,wishlist,removeFromWishlist} =require('../controllers/user');

router.post("/user/cart", authCheck,userCart); //save cart
router.get("/user/cart", authCheck,getUserCart); //to dispaly in checkout
router.delete("/user/cart",authCheck,emptyCart)
router.post("/user/address",authCheck,saveAddress);

router.post("/user/order",authCheck,createOrder)
router.get("/user/orders",authCheck,orders)
router.post("/user/cart/coupon",authCheck,applyCouponToUserCart);
router.post("/user/wishlist", authCheck, addToWishlist);
router.get("/user/wishlist", authCheck, wishlist);
router.put("/user/wishlist/:productId", authCheck, removeFromWishlist);

module.exports=router;