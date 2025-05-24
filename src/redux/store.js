import { configureStore } from "@reduxjs/toolkit";
import listaReducer from "./listaSlice";
import itemReducer from "./itemSlice";

const store = configureStore({
  reducer: {
    lista: listaReducer,
    item: itemReducer,
  },
});

export default store