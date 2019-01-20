import { combineReducers, createStore as reduxCreateStore } from "redux";
import mindTheGerrymanderedReducer from "./mind-the-gerrymandered-gap";

const rootReducer = combineReducers(mindTheGerrymanderedReducer);

const createStore = () =>
  reduxCreateStore(
    rootReducer,
    typeof window !== 'undefined' && window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  );

export default createStore;
