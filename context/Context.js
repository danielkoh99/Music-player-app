import React, { createContext, useContext, useReducer } from 'react';

export const AppContext = createContext();

export const Context = ({ reducer, initialState, children }) => (
  <AppContext.Provider value={useReducer(reducer, initialState)}>
    {children}
  </AppContext.Provider>
);

export const useGlobalValue = () => useContext(AppContext);
