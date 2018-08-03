import { combineReducers, createStore as reduxCreateStore } from "redux";
const req = require.context(".", true, /\.js$/);
const combinedReducerObj = req
  .keys()
  .filter(key => key !== "./index.js")
  .reduce((obj, key) => ({ ...obj, [key]: req(key) }), {});

const rootReducer = combineReducers(combinedReducerObj);

const createStore = () => reduxCreateStore(rootReducer, {});
export default createStore;
