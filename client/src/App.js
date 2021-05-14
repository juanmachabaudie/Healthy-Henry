import React from "react";
import { Route } from "react-router-dom";
import AddCategory from "./components/AddCategory";
import NavBar from "./components/NavBar";
import ProductDetail from "./components/ProductDetail";
import Products from "./components/Products";
import AddProduct from "./components/AddProduct.jsx"
import searchProduct from "./components/SearchProduct.jsx"

const App = () => {
  return (
    <React.Fragment>
      <Route path="/" component={NavBar} />
      <Route exact path="/products" component={Products} />
      <Route path="/product/detail" component={ProductDetail} />
      <Route exact path="/category/add" component={AddCategory} />
      <Route exact path="/product/add" component={AddProduct}/> 
      <Route path="/product/search" component={searchProduct}/>
    </React.Fragment>
  );
};

export default App;
