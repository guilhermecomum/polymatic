import React, { useEffect, useRef } from "react";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Layer({ guia, removeLayer, preview }) {
  const canvasRef = useRef();
  const { sequence, tempo, layer, clavis } = guia;

  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, tempo);
    clavis.play();
  });

  const handleStop = () => {
    layer.stop();
    clavis.pause();
  };

  const handleStart = () => {
    layer.start();
    clavis.play();
  };

  return (
    <div className="layer">
      <canvas
        id={shortid.generate()}
        ref={canvasRef}
        width={640}
        height={425}
      />
      {preview && <p className="Preview">Pré-visualização</p>}
      {removeLayer && (
        <div className="controls">
          <button onClick={() => handleStart()}>
            <FontAwesomeIcon icon={faPlay} />
          </button>
          <button onClick={() => handleStop()}>
            <FontAwesomeIcon icon={faStop} />
          </button>
          <button onClick={() => removeLayer(guia)}>
            <FontAwesomeIcon icon={faTrash} />
          </button>
        </div>
      )}
    </div>
  );
}
