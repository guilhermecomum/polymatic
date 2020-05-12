import React, { useState, useContext, useRef } from "react";
import shortid from "shortid";
import er from "euclidean-rhythms";
import instrumentsList from "../instruments";
import presets from "../presets";
import Clave from "../lib/clave";
import AlertModal from "./AlertModal";
import { useHistory } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faStop,
  faTimes,
  faShareAlt
} from "@fortawesome/free-solid-svg-icons";
import {
  Button,
  ButtonGroup,
  FormControl,
  InputGroup,
  Form,
  Dropdown
} from "react-bootstrap";

import { store } from "../store";

function Toolbar() {
  const history = useHistory();
  const [patternError, setPatternError] = useState(false);
  const [sample, setSample] = useState("agogo1");
  const [tempo, setTempo] = useState(120);
  const { dispatch } = useContext(store);
  const {
    state: {
      claves,
      instruments,
      context,
      previewPattern,
      polymetric,
      previewVisibility
    }
  } = useContext(store);
  const [modalShow, setModalShow] = useState(false);
  const hasClaves = claves.length > 0 ? true : false;
  const patternInput = useRef(null);
  let baseTempo = "";

  if (claves.length > 0) {
    baseTempo = claves[0].pattern.sequence.join("");
  }

  const handleNewClave = () => {
    const clave = new Clave(
      context,
      baseTempo,
      previewPattern,
      tempo,
      { name: sample, sample: instruments[sample] },
      polymetric
    );
    dispatch({ type: "claves.add", id: shortid.generate(), clave });
    dispatch({ type: "previewPattern.update", pattern: previewPattern });
    dispatch({ type: "preview.visibility", visible: false });
    dispatch({ type: "start.all" });
  };

  const handlePreset = value => {
    presets[value].instruments.forEach(preset => {
      const { sequence, tempo, sample } = preset;
      const clave = new Clave(context, baseTempo, sequence, tempo, {
        name: sample,
        sample: instruments[sample]
      });
      dispatch({ type: "claves.add", id: shortid.generate(), clave });
    });
    dispatch({ type: "start.all" });
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
      dispatch({ type: "previewPattern.update", pattern: newPattern });
      setPatternError(false);
    } else if (isBinary.test(value)) {
      dispatch({ type: "previewPattern.update", pattern: value });
      setPatternError(false);
    } else {
      setPatternError(true);
    }
    if (value === "") {
      dispatch({ type: "previewPattern.update", pattern: value });
      setPatternError(false);
    }

    if (!previewVisibility) {
      dispatch({ type: "preview.visibility", visible: true });
    }
  };

  const start = () => {
    for (const clave of claves) {
      clave.start();
    }
  };

  const stop = () => {
    for (const clave of claves) {
      clave.stop();
    }
    dispatch({ type: "stop.all", isPlaying: true });
  };

  const removeAll = () => {
    stop();
    dispatch({ type: "claves.removeAll" });
    setModalShow(false);
  };

  const share = () => {
    stop();
    dispatch({ type: "claves.removeAll" });

    let shareLink = claves.map(clave => {
      return {
        sequence: clave.pattern.sequence.join(""),
        tempo: clave.tempo,
        sample: clave.instrument
      };
    });

    history.push(`/guias?guias=${JSON.stringify(shareLink)}`);
  };

  return (
    <div className="toolbar">
      <AlertModal
        show={modalShow}
        onHide={() => setModalShow(false)}
        onConfirm={() => removeAll()}
      />
      <div className="toolbar-controls">
        <ButtonGroup aria-label="Basic example">
          <Button onClick={() => start()}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button onClick={() => stop()}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
          <Button onClick={() => setModalShow(true)} disabled={!hasClaves}>
            <FontAwesomeIcon icon={faTimes} />
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
          onChange={() => dispatch({ type: "toggle.polymetric" })}
          disabled={!hasClaves}
        />

        <Button
          className="ml-2"
          onClick={() => handleNewClave()}
          disabled={patternError || previewPattern.length === 0}
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

        <Button onClick={() => share()}>
          <FontAwesomeIcon icon={faShareAlt} />
        </Button>
      </div>
    </div>
  );
}
export default Toolbar;
