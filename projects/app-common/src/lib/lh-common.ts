import {CustomApiResponse, UsedState} from "../../../app-api/src/lib/api";

export const UserStateParser: (value?: string | number | null) => UsedState
  = (value?: string | number | null) => {
  if (value === undefined || value === null || value === 'null' || value === "0" || value === 0) {
    return UsedState.NUMBER_0;
  }
  if (value === "1" || value === 1) {
    return UsedState.NUMBER_1;
  }
  if (value === "-1" || value === -1) {
    return UsedState.NUMBER_MINUS_1;
  }
  return UsedState.NUMBER_0;
};
