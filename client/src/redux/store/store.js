import { createStore, applyMiddleware, compose, combineReducers } from "redux";
// import reducer_1 from '../reducers/reducer' //el reducer
import thunk from "redux-thunk"; //nos ayuda a trabajar con promesas con redux
//import {composeWithDevTools} from 'redux-devtools-extension' //nos ayuda a ver los state de la herramienta

import productReducers from "../reducers/productReducers";
import categoryReducers from "../reducers/categoryReducers";
import cartReducers from "../reducers/cartReducers";
import userReducer from "../reducers/userReducers";
import orderReducer from "../reducers/orderReducers";
import {restoreSessionAction} from '../actions/userActions'

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const cartInLocalStorage = localStorage.getItem("cart")
  ? JSON.parse(localStorage.getItem("cart"))
  : [];

// const userInLocalStorage = localStorage.getItem('users') 
// ? restoreSessionAction() : []
 
const rootReducer = combineReducers({
  products: productReducers,
  categories: categoryReducers,
  cart: cartReducers,
  cartInLocalStorage: cartInLocalStorage,
  user: userReducer,
  orders: orderReducer,
  // userInLocalStorage: userInLocalStorage
});

export default function generatorStore() {
  let store = createStore(
    rootReducer, // --->>  persistedReducer
    composeEnhancers(applyMiddleware(thunk))
    )
    restoreSessionAction()(store.dispatch)
    return store
} 
  
