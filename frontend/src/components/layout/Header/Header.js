import React from "react";
import { ReactNavbar } from "overlay-navbar";
import logo from "../../../images/logo.png"
const Header = () => {
  return (
    <div>
    <ReactNavbar
      burgerColorHover="#eb4034"
      logo={logo}
      logoWidth="20vmax"
      navColor1="white"
      logoHoverSize="10px"
      logoHoverColor="#eb4034"
      link1Text="Home"
      link2Text="Products"
      link3Text="Cart"
      link4Text="Login"
      link1Url="/"
      link2Url="/products"
      link3Url="/cart"
      link4Url="/login"
      link1Size="1.3vmax"
      link1Color="rgba(0 0 00.8)"
      nav1justifyContent="flex-end"
      nav2justifyContent="flex-end"
      nav3justifyContent="flex-start"
      nav4justifyContent="flex-start"
      link1ColorHover="#eb4034"
      link1Margin="1vmax"
      profileIconUrl="/login"
      profileIconColor="rgba(35 35 350.8)"
      searchIconColor="rgba(35 35 350.8)"
      cartIconColor="rgba(35 35 350.8)"
      profileIconColorHover="#eb4034"
      searchIconColorHover="#eb4034"
      cartIconColorHover="#eb4034"
      cartIconMargin="1vmax"
      
    />
    
    </div>
  );
};

export default Header;
