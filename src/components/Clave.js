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
    clavis,
    instrument,
    bpm,
    activeStep,
  } = clave;

  const [shift, setShift] = useState(0);
  const [volume, setVolume] = useState(100);
  const [tempo, setTempo] = useState(bpm);
  const [editingTempo, setEditingTempo] = useState(false);
  const { dispatch } = useContext(store);
  const { state } = useContext(store);

  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, tempo);
    clavis.play();
    if (state.isPlaying) clave.start();
  }, [state.isPlaying, clave, clavis, sequence, tempo, bpm]);

  useEffect(() => {
    if (tempoRef.current) {
      tempoRef.current.focus();
    }
  }, [editingTempo]);

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

  const handleVolume = (value) => {
    setVolume(value);
    if (value === 0) {
      clave.setVolume(-1000);
    } else {
      clave.setVolume(value * 0.3 - 24);
    }
    dispatch({ type: "claves.edit", id: clave.id, clave });
  };

  const handleRotate = (value) => {
    setShift(value);
    clave.shift(value);
    dispatch({ type: "claves.edit", id: clave.id, clave });
  };

  const handleTempo = (value) => {
    clave.setBpm(value);
    dispatch({ type: "claves.edit", id: clave.id, clave });
    setEditingTempo(false);
  };

  const handleEditTempo = () => {
    setEditingTempo(true);
    setTempo(bpm);
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
        <div className="tempo">
          <div>
            {editingTempo ? (
              <input
                ref={tempoRef}
                pattern="[0-9]*"
                className="tempoInput"
                onChange={(e) =>
                  setTempo(Number(e.target.value.replace(/\D/, "")))
                }
                onBlur={(e) =>
                  handleTempo(Number(e.target.value.replace(/\D/, "")))
                }
                type="text"
                value={tempo}
              />
            ) : (
              <p className="tempoInput" onClick={() => handleEditTempo()}>
                {bpm}
              </p>
            )}

            <p className="bpm">BPM</p>
          </div>
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
                className={index === activeStep ? "active" : ""}
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
