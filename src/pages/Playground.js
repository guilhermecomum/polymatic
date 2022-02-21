import React, { useEffect, useContext, useRef } from "react";
import { store } from "../store";
import Circle from "../lib/circle";
import Layer from "../components/Circle";

function Playground() {
  const { state, dispatch } = useContext(store);

  useEffect(() => {
    const circle = new Circle(state.piano);
    dispatch({ type: "circle.add", circle });
  }, []);

  return (
    <div className="App">
      <div className="circle-wrapper">
        {state.circle && <Layer circle={state.circle} />}
      </div>
    </div>
  );
}

export default Playground;
