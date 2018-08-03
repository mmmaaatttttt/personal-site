import * as t from "./actionTypes";

export function setDistrictCounts(districts) {
  return { type: t.SET_FINISHED_DISTRICT_COUNTS, districts };
}

export function unsetDistrictCounts(districts) {
  return { type: t.UNSET_FINISHED_DISTRICT_COUNTS };
}
