import { combineReducers, createStore as reduxCreateStore } from "redux";
import mindTheGerrymanderedReducer, {
  DEFAULT_STATE as mtggState
} from "./mind-the-gerrymandered-gap";

const reducerObj = {
  "mind-the-gerrymandered-gap": mindTheGerrymanderedReducer
};

const preloadedState = {
  "mind-the-gerrymandered-gap": mtggState
};

const rootReducer = combineReducers(reducerObj);
const storeArgs = [rootReducer, preloadedState];

if (typeof window !== "undefined" && window.__REDUX_DEVTOOLS_EXTENSION__) {
  storeArgs.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const createStore = () => reduxCreateStore(...storeArgs);

export default createStore;
