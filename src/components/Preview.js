import React, { useEffect, useRef, useContext } from "react";
import shortid from "shortid";
import Clavis from "../lib/clavis";
import { store } from "../store";

export default function Preview() {
  const clavis = new Clavis();
  const canvasRef = useRef();
  const { state } = useContext(store);

  useEffect(() => {
    if (canvasRef.current) {
      clavis.configure(canvasRef.current, state.previewPattern, 120);
      clavis.draw();
    }
  }, [state.previewPattern, clavis]);

  if (!state.previewPattern || state.previewPattern.length === 0) {
    return null;
  }

  const isIntersect = (point, circle) => {
    var dx = circle.x - point.x;
    var dy = circle.y - point.y;
    var radius = circle.radius;
    return dx * dx + dy * dy < radius * radius;
    // return (
    //   Math.sqrt((point.x - circle.x) ** 2 + (point.y - circle.y) ** 2) <
    //   circle.radius
    // );
  };

  // const handleClick = (event) => {
  //   console.log("event", event.nativeEvent.offsetX, event.nativeEvent.offsetY);
  //   const point = {
  //     x: event.clientX,
  //     y: event.clientY,
  //   };

  //   clavis.patternDots.forEach((circle) => {
  //     const dot = { x: parseInt(circle[0]), y: parseInt(circle[1]), radius: 8 };
  //     if (isIntersect(point, dot)) {
  //       console.log("denrto");
  //     }
  //   });
  // };

  const handleClick = (event) => {
    event.stopPropagation();
    console.log("event", event.nativeEvent);
    console.table(event.nativeEvent.offsetX - event.clientX);
    const ctx = clavis.context;

    clavis.dotsOn.forEach((circle) => {
      if (
        ctx.isPointInPath(
          circle,
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        )
      ) {
        ctx.fillStyle = "green";
        console.log("dentro");
        ctx.fill(circle);
      } else {
        ctx.fillStyle = "red";
        ctx.fill(circle);
      }
    });
  };

  return (
    <div className="layer">
      <canvas
        id={shortid.generate()}
        ref={canvasRef}
        width={200}
        height={200}
        onMouseMove={handleClick}
      />
      <p className="Preview">Pré-visualização</p>
    </div>
  );
}
