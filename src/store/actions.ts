import { LAYOUTCLASS, SET_GAME_BACKGROUND } from "./actionTypes";

export const setLayoutClass = (payload: string) => ({
  type: LAYOUTCLASS,
  payload,
});


export const setGameBackground = (payload: boolean) => ({
  type: SET_GAME_BACKGROUND,
  payload,
});