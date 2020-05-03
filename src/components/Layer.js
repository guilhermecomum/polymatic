import React, { useEffect, useRef, useState, useContext } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup } from "react-bootstrap";
import { store } from "../store";

export default function Layer({ clave }) {
  const canvasRef = useRef();
  const [volume, setVolume] = useState(100);
  const { sequence, tempo, clavis, channel, instrument } = clave;
  const { dispatch } = useContext(store);

  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, tempo);
    clave.start();
  });

  const handleStop = () => {
    clave.stop();
  };

  const handleStart = () => {
    clave.start();
  };

  const handleRemove = () => {
    clave.remove();
    dispatch({ type: "claves.remove", id: clave.id });
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
        <li>instrumento: {instrument}</li>
      </ul>

      <div className="controls">
        <ButtonGroup aria-label="Basic example">
          <Button onClick={() => handleStart()}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button onClick={() => handleStop()}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
          <Button onClick={() => handleRemove()}>
            <FontAwesomeIcon icon={faTrash} />
          </Button>
        </ButtonGroup>
      </div>

      <div className="mt-2 volume">
        <span className="mr-2">Vol.</span>
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
