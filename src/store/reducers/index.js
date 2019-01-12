import { combineReducers, createStore as reduxCreateStore } from "redux";
const req = require.context(".", true, /\.js$/);
const combinedReducerObj = req
  .keys()
  .filter(key => key !== "./index.js")
  .reduce((obj, key) => ({ ...obj, [key.match(/[^\.\/]+/)[0]]: req(key) }), {});

const rootReducer = combineReducers(combinedReducerObj);

const createStore = () =>
  reduxCreateStore(
    rootReducer,
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

export default createStore;
