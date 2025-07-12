import { LAYOUTCLASS, INITIALSTATE, SET_GAME_BACKGROUND } from "./actionTypes";

export interface ACTION {
  [propType: string]: any;
}

export const reducer = (state: INITIALSTATE, action: ACTION) => {
  switch (action.type) {
    case LAYOUTCLASS:
      return {
        ...state,
        layoutClass: action.payload,
      };
    case SET_GAME_BACKGROUND:
      return {
        ...state,
        setGameBackground: action.payload,
      };
    default:
      return state;
  }
};
