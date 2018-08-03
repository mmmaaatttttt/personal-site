import { createStore as reduxCreateStore } from "redux";

const reducer = (state, action) => {
  return state;
};

const createStore = () => reduxCreateStore(reducer, {});
export default createStore;
