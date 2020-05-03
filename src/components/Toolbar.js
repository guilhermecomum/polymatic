import React, { useState, useContext, useRef } from "react";
import shortid from "shortid";
import er from "euclidean-rhythms";
import instrumentsList from "../instruments";
import presets from "../presets";
import Clave from "../lib/clave";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputGroup,
  Form,
  Dropdown
} from "react-bootstrap";

import { store } from "../store";

function Toolbar({ context, instruments }) {
  const [patternError, setPatternError] = useState(false);
  const [sample, setSample] = useState("agogo1");
  const [tempo, setTempo] = useState(120);
  const [polymetric, setPolymetric] = useState(false);
  const { dispatch } = useContext(store);
  const { state } = useContext(store);
  const patternInput = useRef(null);
  let baseTempo = "";

  if (state.claves.length > 0) {
    baseTempo = state.claves[0].sequence;
  }

  const handleNewClave = () => {
    const clave = new Clave(
      context,
      baseTempo,
      state.preview,
      tempo,
      instruments[sample],
      polymetric
    );
    dispatch({ type: "claves.add", id: shortid.generate(), clave });
    dispatch({ type: "preview.update", pattern: "" });
    patternInput.current.value = "";
  };

  const handlePreset = value => {
    presets[value].instruments.forEach(preset => {
      const { sequence, tempo, sample } = preset;
      const clave = new Clave(
        context,
        baseTempo,
        sequence,
        tempo,
        instruments[sample]
      );
      dispatch({ type: "claves.add", id: shortid.generate(), clave });
    });
  };

  const handlePattern = value => {
    const isEuclidian = new RegExp("^(\\d+),(\\d+)$");
    const isBinary = new RegExp("^[0-1]{1,}$");
    if (isEuclidian.test(value)) {
      const [pulse, steps] = value
        .split(",")
        .map(number => parseInt(number))
        .sort((a, b) => a - b);
      const newPattern = er.getPattern(pulse, steps).join("");
      dispatch({ type: "preview.update", pattern: newPattern });
      setPatternError(false);
    } else if (isBinary.test(value)) {
      dispatch({ type: "preview.update", pattern: value });
      setPatternError(false);
    } else {
      setPatternError(true);
    }
    if (value === "") {
      dispatch({ type: "preview.update", pattern: value });
      setPatternError(false);
    }
  };

  const start = () => {
    for (const clave of state.claves) {
      clave.start();
    }
  };

  const stop = () => {
    for (const clave of state.claves) {
      clave.stop();
    }
  };

  return (
    <div className="toolbar">
      <div className="toolbar-controls">
        <ButtonGroup aria-label="Basic example">
          <Button variant="secondary" onClick={() => start()}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button variant="secondary" onClick={() => stop()}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
        </ButtonGroup>
      </div>
      <div className="toolbar-form">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon3">Padrão</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="1010101 ou 3,4"
            ref={patternInput}
            onChange={e => handlePattern(e.target.value)}
            isInvalid={patternError}
          />
        </InputGroup>
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon3">Tempo</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="tempo"
            value={tempo}
            onChange={e => setTempo(e.target.value)}
          />
        </InputGroup>
        <Form.Control as="select" onChange={e => setSample(e.target.value)}>
          <option>Instrumentos</option>
          {Object.keys(instrumentsList).map((instrument, index) => (
            <option key={index} value={instrument}>
              {instrument}
            </option>
          ))}
        </Form.Control>

        <Form.Check
          inline
          className="ml-2 polymetric"
          type="checkbox"
          label="Polimetria"
          checked={polymetric}
          onChange={() => setPolymetric(!polymetric)}
          disabled={state.claves.length === 0}
        />

        <Button
          className="ml-2"
          onClick={() => handleNewClave()}
          disabled={patternError || state.preview.length === 0}
        >
          Adicionar
        </Button>

        <Dropdown className="ml-2">
          <Dropdown.Toggle variant="info" id="dropdown-basic">
            presets
          </Dropdown.Toggle>
          <Dropdown.Menu>
            {Object.keys(presets).map((preset, index) => (
              <Dropdown.Item key={index} onClick={() => handlePreset(preset)}>
                {presets[preset].name}
              </Dropdown.Item>
            ))}
          </Dropdown.Menu>
        </Dropdown>
      </div>
    </div>
  );
}
export default Toolbar;
