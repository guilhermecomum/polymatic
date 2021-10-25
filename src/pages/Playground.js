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

  // const handleClick = (event) => {
  //   event.stopPropagation();
  //   const ctx = clavis.context;

  //   clavis.notesOn.forEach((circle, index) => {
  //     if (
  //       ctx.isPointInPath(
  //         circle,
  //         event.nativeEvent.offsetX,
  //         event.nativeEvent.offsetY
  //       )
  //     ) {
  //       //ctx.fillStyle = "green";
  //       clavis.addDot(index);
  //       console.log("dentro", index);
  //       ctx.strokeStyle = "red";
  //       ctx.stroke(circle);
  //     } else {
  //       ctx.strokeStyle = "white";
  //       ctx.stroke(circle);
  //     }
  //   });
  // };

  return (
    <div className="App">
      <div className="circle-wrapper">
        {state.circle && <Layer circle={state.circle} />}
      </div>
    </div>
  );
}

export default Playground;
