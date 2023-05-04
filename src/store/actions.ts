import { LAYOUTCLASS } from "./actionTypes";

export const setLayoutClass = (payload: string) => ({
  type: LAYOUTCLASS,
  payload,
});
