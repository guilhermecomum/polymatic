import React, { createContext, useReducer } from "react";

const initialState = {
  // type: String
  // This is the pattern shown by the preview
  previewPattern: "",
  previewVisibility: false,
  // type: Map<String,Clave>
  // This is the list of claves shown by the main screen
  polymetric: false,
  claves: [],
  isPlaying: false
};

const store = createContext(initialState);

const createReducer = () => {
  return (state, action) => {
    switch (action.type) {
      case "previewPattern.update":
        return {
          ...state,
          previewPattern: action.pattern
        };
      case "preview.visibility":
        return {
          ...state,
          previewVisibility: action.visible
        };
      case "claves.add":
        return { ...state, claves: [...state.claves, action.clave] };
      case "claves.remove":
        return {
          ...state,
          claves: state.claves.filter(clave => clave.id !== action.id)
        };
      case "claves.removeAll":
        return {
          ...state,
          claves: [],
          polymetric: false
        };
      case "toggle.polymetric":
        return {
          ...state,
          polymetric: !state.polymetric
        };
      case "start.all":
        return { ...state, isPlaying: true };
      case "stop.all":
        return { ...state, isPlaying: false };
      default:
        throw new Error(`Cêsásiessionibuspassnasavassi?`);
    }
  };
};

const Provider = ({ children }) => {
  const { Provider } = store;
  const memoizedReducer = React.useCallback(createReducer(), []);
  const [state, dispatch] = useReducer(memoizedReducer, initialState);
  return <Provider value={{ state, dispatch }}>{children}</Provider>;
};

const Consumer = store.Consumer;

export { store, Provider, Consumer };
