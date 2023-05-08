import "./App.css";
import Header from "./components/layout/Header/Header.js";
import Footer from "./components/layout/Footer/Footer.js";
import { BrowserRouter as Router, Route } from "react-router-dom";
import { useEffect, useState } from "react";
import WebFont from "webfontloader";
import React from "react";
import Home from "./components/Home/Home.js";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js";
import Search from "./components/Product/Search.js";
import LoginSignUp from "./components/User/LoginSignUp";
import Profile from "./components/User/Profile.js";
import store from "./store";
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Header/UserOption.js";
import { useSelector } from "react-redux";
import Protected from "./components/Route/Protected";
import UpdateProfile from './components/User/UpdateProfile.js'
import UpdatePassword from './components/User/UpdatePassword.js'
import ForgotPassword from "./components/User/ForgotPassword";
import ResetPassword from "./components/User/ResetPassword";
import Cart from "./components/Cart/Cart.js";
import axios from "axios";
import { Elements } from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import Shipping from "./components/Cart/Shipping.js";
import Payment from "./components/Cart/Payment.js";
import MyOrders from "./components/Order/MyOrders.js";
import OrderSuccess from "./components/Cart/OrderSuccess.js";
import ConfirmOrder from "./components/Cart/ConfirmOrder.js";
function App() {
  const { isAuthenticated, user } = useSelector((state) => state.user);

  const [stripeApiKey, setStripeApiKey] = useState("");

  async function getStripeApiKey() {
    const { data } = await axios.get("/api/stripeapikey");

    setStripeApiKey(data.stripeApiKey);
  }
  useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans"],
      },
    });
    store.dispatch(loadUser());
    getStripeApiKey()
  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user} />}
      {stripeApiKey && (
        <Elements stripe={loadStripe(stripeApiKey)}>
          <Protected exact path="/process/payment" component={Payment} />
        </Elements>
      )}
        
        <Route exact path="/" component={Home} />
        <Route exact path="/product/:id" component={ProductDetails} />
        <Route exact path="/products" component={Products} />
        <Route path="/products/:keyword" component={Products} />
        <Route exact path="/search" component={Search} />
        <Protected exact path="/account" component={Profile} />
        <Protected exact path="/me/update" component={UpdateProfile} />
        <Protected exact path="/password/update" component={UpdatePassword} />
        <Route exact path="/password/forgot" component={ForgotPassword} />
        <Route exact path="/password/reset/:token" component={ResetPassword} />
        <Route exact path="/cart" component={Cart} />
        <Protected exact path="/shipping" component={Shipping} />
        <Protected exact path="/order/confirm" component={ConfirmOrder} />
        <Protected exact path="/orders" component={MyOrders} />
        <Protected exact path="/success" component={OrderSuccess} />
        
        <Route exact path="/login" component={LoginSignUp} />
      
      <Footer />
    </Router>
  );
}

export default App;
