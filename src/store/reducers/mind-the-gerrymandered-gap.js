import * as t from "../actions/actionTypes";

const DEFAULT_STATE = {
  districts: null
};

export default function mindTheGerrymanderedReducer(
  state = DEFAULT_STATE,
  action
) {
  switch (action.type) {
    case t.SET_FINISHED_DISTRICT_COUNTS:
      return {
        ...state,
        districts: action.districts
      };
    case t.UNSET_FINISHED_DISTRICT_COUNTS:
      return {
        ...state,
        districts: null
      };
    default:
      return state;
  }
}
