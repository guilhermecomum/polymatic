import React, { useEffect, useRef, useState, useContext } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop, faTrash } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup } from "react-bootstrap";
import { store } from "../store";

export default function Clave({ clave }) {
  const canvasRef = useRef();
  const tempoRef = useRef();

  const {
    pattern: { sequence },
    context,
    clavis,
    instrument,
    bpm,
    activeStep,
  } = clave;
  const [shift, setShift] = useState(0);
  const [volume, setVolume] = useState(100);
  const [tempo, setTempo] = useState(bpm);
  const { dispatch } = useContext(store);
  const { state } = useContext(store);
  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, tempo);
    clavis.play();
    if (state.isPlaying) clave.start();
  }, [state.isPlaying, clave, clavis, sequence, tempo]);

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

  const handleVolume = (value) => {
    const newVolume = remap(value, 0, 100, -80, 3);
    setVolume(value);
    clave.setVolume(newVolume);
  };

  const handleRotate = (value) => {
    setShift(value);
    clave.shift(value);
  };

  return (
    <div className="layer">
      <div className="guia">
        <canvas
          id={shortid.generate()}
          ref={canvasRef}
          width={640}
          height={425}
        />
        <div className="tempo" ref={tempoRef}>
          <input
            className="tempoInput"
            onChange={(e) => setTempo(e.target.value)}
            onBlur={() => clave.setBpm(tempo)}
            type="text"
            value={tempo}
          />
          <p className="bpm">BPM</p>
        </div>
      </div>
      <div className="mt-2 volume">
        <span className="mr-2">Rotação</span>
        <RangeSlider
          value={shift}
          min={1}
          max={sequence.join("").length}
          onChange={(e) => handleRotate(Number(e.target.value))}
          tooltip="off"
        />
      </div>
      <ul>
        <li>
          padrão:
          <span className="sequence">
            {sequence.map((step, index) => (
              <span
                className={index === clave.activeStep ? "active" : ""}
                key={index}
              >
                {step}
              </span>
            ))}
          </span>
        </li>

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
          tooltipLabel={(currentValue) => `${currentValue}%`}
          onChange={(e) => handleVolume(Number(e.target.value))}
        />
      </div>
    </div>
  );
}
