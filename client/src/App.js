import React,{useEffect}from 'react';
import {Switch,Route} from 'react-router-dom';
import Header from './components/nav/header';
import Login from './Pages/auth/login';
import Register from './Pages/auth/register';
import Home from './Pages/home';
import ForgotPassword from './Pages/auth/forgotpassword';
//for toast notifications with css
import {ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import RegisterComplete from './Pages/auth/registercomplete';
import {auth} from './firebase/firebase';
//to dispatch action and payload
import { useDispatch } from "react-redux";
import {currentUser} from './functions/auth';
import History from './Pages/user/history';
import UserRoute from './components/routes/userRoute';
import AdminRoute from './components/routes/adminRoute';
import Password from './Pages/user/password';
import Wishlist from './Pages/user/wishlist';
import AdminDashboard from './Pages/admin/adminDashboard';
import CategoryCreate from './Pages/admin/category/categoryCreate';
import CategoryUpdate from './Pages/admin/category/CategoryUpdate';
import ProductCreate from './Pages/admin/product/productCreate';
import ProductUpdate from './Pages/admin/product/productupdate';
import AllProducts from './Pages/admin/product/AllProducts';
import Product from './Pages/product';
import CategoryHome from './Pages/category/categoryhome';
import Shop from './Pages/shop';
import Cart from './Pages/cart';
import SideDrawer from './components/drawer/sidedrawer';
import Checkout from './Pages/checkout';
import CreateCouponPage from './Pages/admin/coupon/createcoupon';
import Payment from './Pages/payment';
import AuthorCreate from './Pages/admin/author/authorCreate';
import AuthorUpdate from './Pages/admin/author/authorUpdate';
import AuthorHome from './Pages/author/authorHome';

const App=() =>{
  const dispatch=useDispatch();
  useEffect(()=>{
      //accessing currently logged in user and clearing state and preventing memeory leak
      const unsubscribe= auth.onAuthStateChanged(async (user)=>{
        if(user){
          //get user token
          const idTokenResult=await user.getIdTokenResult();
          //dispath token it to redux store
          currentUser(idTokenResult.token)
            .then((res) => {
              dispatch({
                type: "LOGGED_IN_USER",
                payload: {
                  name: res.data.name,
                  email: res.data.email,
                  token: idTokenResult.token,
                  role: res.data.role,
                  _id: res.data._id,
                },
              });
            })
            .catch();
  
        }
      });
      //cleanup
      return ()=> unsubscribe();
  });
  return (
    //fragments similar to div
    <>
      <Header/>
      <SideDrawer/> {/*dispaly it on all pages */}
      <ToastContainer />
    <Switch>
      <Route exact path="/" component={Home}/>
      <Route exact path="/login" component={Login}/>
      <Route exact path="/register" component={Register}/>
      <Route exact path="/register/complete" component={RegisterComplete}/>
      <Route exact path="/forgotpassword" component={ForgotPassword}/>
      <UserRoute exact path="/user/history" component={History}/>
      <UserRoute exact path="/user/password" component={Password}/>
      <UserRoute exact path="/user/wishlist" component={Wishlist}/>
      <AdminRoute exact path="/admin/dashboard" component={AdminDashboard}/>
      <AdminRoute exact path="/admin/category" component={CategoryCreate}/>
      <AdminRoute exact path="/admin/category/:slug" component={CategoryUpdate}/>
      <AdminRoute exact path="/admin/product" component={ProductCreate}/>
      <AdminRoute exact path="/admin/products" component={AllProducts}/>
      <AdminRoute exact path="/admin/product/:slug" component={ProductUpdate}/>
      <Route exact path="/product/:slug" component={Product}/>
      <Route exact path="/category/:slug" component={CategoryHome}/>
      <Route exact path="/shop" component={Shop}/>
      <Route exact path="/cart" component={Cart}/>
      <UserRoute exact path="/checkout" component={Checkout}/>
      <AdminRoute exact path="/admin/coupon" component={CreateCouponPage}/>
      <UserRoute exact path="/payment" component={Payment}/>
      <AdminRoute exact path="/admin/author" component={AuthorCreate}/>
      <AdminRoute exact path="/admin/author/:slug" component={AuthorUpdate}/>
      <Route exact path="/author/:slug" component={AuthorHome}/>

    </Switch>
    </>
  );
}

export default App;
