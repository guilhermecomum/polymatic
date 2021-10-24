import React, { useEffect, useContext, useRef } from "react";
import shortid from "shortid";
import { store } from "../store";
import { useLocation } from "react-router-dom";
import Clavis from "../lib/clavis";

function Playground() {
  const { state, dispatch } = useContext(store);
  const clavis = new Clavis();
  const canvasRef = useRef();

  useEffect(() => {
    if (canvasRef.current) {
      clavis.configure(canvasRef.current, "10101010101", 120);
      clavis.draw();
      clavis.play();
    }
  }, [clavis]);

  const handleClick = (event) => {
    event.stopPropagation();
    const ctx = clavis.context;

    clavis.notesOn.forEach((circle, index) => {
      if (
        ctx.isPointInPath(
          circle,
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        )
      ) {
        //ctx.fillStyle = "green";
        clavis.addDot(index);
        console.log("dentro", index);
        ctx.strokeStyle = "red";
        ctx.stroke(circle);
      } else {
        ctx.strokeStyle = "white";
        ctx.stroke(circle);
      }
    });
  };
  return (
    <div className="App">
      <div className="wrapper">
        <canvas
          id={shortid.generate()}
          ref={canvasRef}
          width={500}
          height={500}
          //onMouseMove={handleClick}
          onClick={handleClick}
        />
      </div>
    </div>
  );
}

export default Playground;
