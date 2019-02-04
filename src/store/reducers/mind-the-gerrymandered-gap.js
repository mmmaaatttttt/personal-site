import * as t from "../actions/actionTypes";

export const DEFAULT_STATE = {
  districtCounts: null
};

export default function mindTheGerrymanderedReducer(
  state = DEFAULT_STATE,
  action
) {
  switch (action.type) {
    case t.SET_FINISHED_DISTRICT_COUNTS:
      return {
        ...state,
        districtCounts: action.districtCounts
      };
    case t.UNSET_FINISHED_DISTRICT_COUNTS:
      return {
        ...state,
        ...DEFAULT_STATE
      };
    default:
      return state;
  }
}
