import React, { useEffect } from "react";
import Clavis from "./lib/clavis";

export default function Layer({ layer }) {
  const canvasRef = React.useRef(null);
  const { sequence, tempo } = layer;
  console.log("Props: ", layer);
  useEffect(() => {
    const clavis = new Clavis(canvasRef.current, sequence, tempo);
    clavis.play();
  }, []);

  return (
    <div>
      <canvas ref={canvasRef} width={640} height={425} />
      <div className="controls">
        <i id="play" className="fas fa-play icon"></i>
        <i className="fas fa-stop icon"></i>
        <i className="fas fa-trash icon"></i>
      </div>
    </div>
  );
}
