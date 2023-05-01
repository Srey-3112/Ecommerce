import "./App.css";
import Header from "./components/layout/Header/Header.js";
import Footer from "./components/layout/Footer/Footer.js";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import WebFont from "webfontloader";
import React from "react";
import Home from "./components/Home/Home.js";
import ProductDetails from "./components/Product/ProductDetails.js";
import Products from "./components/Product/Products.js"
import Search from "./components/Product/Search.js";
import LoginSignUp from "./components/User/LoginSignUp.js"
import store from "./store"
import { loadUser } from "./actions/userAction";
import UserOptions from "./components/layout/Header/UserOption.js";
import { useSelector } from "react-redux";

function App() {
  const {isAuthenticated, user}= useSelector(state=> state.user)


  React.useEffect(() => {
    WebFont.load({
      google: {
        families: ["Roboto", "Droid Sans"],
      },
    });
    store.dispatch(loadUser())

  }, []);
  return (
    <Router>
      <Header />
      {isAuthenticated && <UserOptions user={user}/>}
      <Routes>
        <Route exact path="/" element={<Home />} />
        <Route exact path="/product/:id" element={<ProductDetails />} />
        <Route exact path="/products" element={<Products />} />
        <Route  path="/products/:keyword" element={<Products />} />
        <Route exact path="/search" element={<Search />} />
        <Route exact path="/login" element={<LoginSignUp />} />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
