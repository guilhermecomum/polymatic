import React, { useEffect, useRef, useState, useContext } from "react";
import RangeSlider from "react-bootstrap-range-slider";
import "react-bootstrap-range-slider/dist/react-bootstrap-range-slider.css";
import shortid from "shortid";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup } from "react-bootstrap";
import { store } from "../store";

export default function Circle({ circle }) {
  const canvasRef = useRef();
  const tempoRef = useRef();
  const {
    pattern: { sequence },
    clavis,
    bpm,
  } = circle;

  const [pattern, setPattern] = useState(sequence);
  const [shift, setShift] = useState(0);
  const [tempo, setTempo] = useState(bpm);
  const [editingTempo, setEditingTempo] = useState(false);
  const { dispatch } = useContext(store);
  const { state } = useContext(store);

  useEffect(() => {
    clavis.configure(canvasRef.current, sequence, tempo);
    clavis.draw();
    if (state.isPlaying) circle.start();
  }, [state.isPlaying, circle, clavis, sequence, tempo, bpm, pattern]);

  useEffect(() => {
    if (tempoRef.current) {
      tempoRef.current.focus();
    }
  }, [editingTempo]);

  const handleStop = () => {
    circle.stop();
  };

  const handleStart = () => {
    circle.start();
  };

  const handleRotate = (value) => {
    setShift(value);
    circle.shift(value);
    dispatch({ type: "circle.edit", id: circle.id, circle });
  };

  const handleTempo = (value) => {
    console.log("value", value);
    circle.setBpm(value);
    dispatch({ type: "circle.edit", circle });
    setEditingTempo(false);
  };

  const handleEditTempo = () => {
    setEditingTempo(true);
    setTempo(bpm);
  };

  const handleClick = (event) => {
    event.stopPropagation();
    const ctx = clavis.context;

    clavis.patternNotes.forEach((circ, index) => {
      if (
        ctx.isPointInPath(
          circ,
          event.nativeEvent.offsetX,
          event.nativeEvent.offsetY
        )
      ) {
        ctx.fillStyle = "green";
        //clavis.addDot(index);
        ctx.lineWidth = 4;
        ctx.strokeStyle = "red";
        ctx.stroke(circ);
        pattern[index] = pattern[index] === "1" ? "0" : "1";
        setPattern(pattern);
        circle.updatePattern(pattern.join(""));
        dispatch({ type: "circle.edit", circle });
      } else {
        ctx.strokeStyle = "white";
        ctx.stroke(circ);
      }
    });
  };

  return (
    <div className="layer">
      <div className="guia">
        <canvas
          id={shortid.generate()}
          ref={canvasRef}
          width={700}
          height={700}
          onClick={handleClick}
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

      <div className="controls">
        <ButtonGroup aria-label="Basic example">
          <Button onClick={() => handleStart()}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button onClick={() => handleStop()}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
}
