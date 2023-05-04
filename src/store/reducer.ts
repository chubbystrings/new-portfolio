import {
  LAYOUTCLASS, INITIALSTATE
} from "./actionTypes";


export interface ACTION {
  [propType: string]: any;
}

export const reducer = (state: INITIALSTATE, action: ACTION) => {
  switch (action.type) {
    case LAYOUTCLASS:
      return {
        ...state,
        layoutClass: action.payload
      };
    default:
      return state;
  }
};
