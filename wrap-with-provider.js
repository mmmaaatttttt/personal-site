import React from "react";
import { Provider } from "react-redux";

import createStore from "./src/store/reducers";

// const store = createStore();
// console.log("STORE", store.getState());

// eslint-disable-next-line react/display-name,react/prop-types
export default ({ element }) => {
  const store = createStore();
  return <Provider store={store}>{element}</Provider>;
};
