import React, { createContext, useReducer } from "react";
import { ACTION, reducer } from "./reducer";
import { initialState } from "./state";
import { INITIALSTATE } from "./actionTypes";

interface STORESTATUS {
  globalState: INITIALSTATE;
  dispatch: React.Dispatch<ACTION>;
}

export const StoreContext = createContext({} as STORESTATUS);

const StoreProvider = (props: any) => {
  const [globalState, dispatch] = useReducer(reducer, initialState);

  const value = {
    globalState,
    dispatch,
  };

  return (
    <StoreContext.Provider value={value}>
      {props.children}
    </StoreContext.Provider>
  );
};

export default StoreProvider;
