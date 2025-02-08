/* eslint-disable import/no-cycle */
/* eslint-disable import/no-extraneous-dependencies */
import { combineReducers } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import productReducer from "./Slices/product";
import infomationReducer from "./Slices/infomation";
import cartReducer from "./Slices/cart";

const rootPersistConfig = {
    key: "root",
    storage,
};

const rootReducer = combineReducers({
    product: productReducer,
    information: infomationReducer,
    cart: cartReducer,
});

export { rootReducer, rootPersistConfig };
