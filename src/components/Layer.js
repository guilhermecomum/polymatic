import React, { useEffect, useRef, useState } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";

export default function Layer({ guia, removeLayer }) {
  const canvasRef = useRef();
  const [volume, setVolume] = useState(100);
  const { sequence, tempo, layer, clavis, channel } = guia;

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

  function remap(value, low1, high1, low2, high2) {
    return low2 + ((high2 - low2) * (value - low1)) / (high1 - low1);
  }

  const handleVolume = value => {
    const newVolume = remap(value, 0, 100, 0.0, 1.0);
    setVolume(value);
    channel.setVolume(newVolume);
  };

  return (
    <div className="layer">
      <canvas
        id={shortid.generate()}
        ref={canvasRef}
        width={640}
        height={425}
      />
      <ul>
        <li>sequence: {sequence}</li>
        <li>tempo: {tempo}</li>
      </ul>
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
      <div className="mt-2">
        <RangeSlider
          value={volume}
          min={0}
          max={100}
          tooltipLabel={currentValue => `${currentValue}%`}
          onChange={e => handleVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
