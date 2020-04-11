import React, { useEffect, useRef } from "react";
import shortid from "shortid";

export default function Preview({ preview, sequence, clavis }) {
  const canvasRef = useRef();

  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, 120);
    clavis.draw();
  });

  return (
    <div className="layer">
      <canvas
        id={shortid.generate()}
        ref={canvasRef}
        width={640}
        height={425}
      />
      <p className="Preview">Pré-visualização</p>
    </div>
  );
}
