import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlay, faStop } from "@fortawesome/free-solid-svg-icons";
import { Button, ButtonGroup, FormControl, InputGroup } from "react-bootstrap";

function Header({
  layers,
  pattern,
  setPattern,
  beet,
  tempo,
  setTempo,
  addLayer
}) {
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
          Polymatic <small>v3</small>
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
            placeholder="padrão"
            value={pattern}
            onChange={e => setPattern(e.target.value)}
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
        <Button onClick={() => addLayer()}>Adicionar</Button>
      </div>
    </div>
  );
}
export default Header;
