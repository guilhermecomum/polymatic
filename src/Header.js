import React, { useState } from "react";
import shortid from "shortid";
import instruments from "./instruments";
import presets from "./presets";
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

function Header({
  layers,
  beet,
  pattern,
  setPattern,
  patternError,
  sequence,
  setPreview,
  handleStoreUpdate
}) {
  const [sample, setSample] = useState("agogo1");
  const [tempo, setTempo] = useState(120);

  const handleNewClave = () => {
    const newClave = {
      name: shortid.generate(),
      instruments: [{ sequence: sequence, tempo: tempo, sample: sample }]
    };
    handleStoreUpdate(newClave);
  };

  const handlePreset = value => {
    handleStoreUpdate(presets[value]);
  };

  const start = () => {
    for (const guia of layers) {
      guia.layer.start();
      guia.clavis.play();
    }
  };

  const stop = () => {
    for (const guia of layers) {
      guia.layer.stop();
      guia.clavis.pause();
    }
  };

  return (
    <div className="header">
      <div>
        <h1 className="header-logo">
          Polymatic <small>v3.1.1</small>
        </h1>
      </div>
      <div className="header-controls">
        <ButtonGroup aria-label="Basic example">
          <Button variant="secondary" onClick={() => start()}>
            <FontAwesomeIcon icon={faPlay} />
          </Button>
          <Button variant="secondary" onClick={() => stop()}>
            <FontAwesomeIcon icon={faStop} />
          </Button>
        </ButtonGroup>
      </div>
      <div className="header-form">
        <InputGroup>
          <InputGroup.Prepend>
            <InputGroup.Text id="basic-addon3">Padrão</InputGroup.Text>
          </InputGroup.Prepend>
          <FormControl
            placeholder="1010101 ou 3,4"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
            isInvalid={pattern.length > 0 && patternError}
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
          {Object.keys(instruments).map((instrument, index) => (
            <option key={index} value={instrument}>
              {instrument}
            </option>
          ))}
        </Form.Control>

        <Button
          className="ml-2"
          onClick={() => handleNewClave()}
          disabled={patternError}
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
export default Header;
