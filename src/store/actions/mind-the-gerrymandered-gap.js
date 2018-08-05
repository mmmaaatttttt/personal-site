import * as t from "./actionTypes";

export function setDistrictCounts(districtCounts) {
  return { type: t.SET_FINISHED_DISTRICT_COUNTS, districtCounts };
}

export function unsetDistrictCounts() {
  return { type: t.UNSET_FINISHED_DISTRICT_COUNTS };
}
