import React, { useState } from "react";
import Beet from "./lib/beet";
import Clavis from "./lib/clavis";
import hit from "./samples/hit2.wav";
import shortid from "shortid";
import Layer from "./Layer";
import Header from "./Header";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [pattern, setPattern] = useState("1000101000101000");
  const [tempo, setTempo] = useState(120);
  const [layers, setLayers] = useState([]);

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const beet = new Beet({
    context: context,
    tempo: tempo
  });

  const addLayer = () => {
    const sequence = beet.pattern(pattern);
    const clavis = new Clavis();
    const guia = { layer: beet.layer(sequence, clavis, drum) };
    guia.layer.tempo = tempo;
    beet.add(guia.layer);
    beet.start();
    setLayers([
      ...layers,
      {
        id: shortid.generate(),
        sequence: pattern,
        tempo: tempo,
        layer: guia.layer,
        clavis: clavis
      }
    ]);
  };

  const removeLayer = guia => {
    beet.remove(guia.layer);
    guia.clavis.pause();
    setLayers(layers.filter(layer => layer.id !== guia.id));
  };

  function drum(time, step) {
    const source = context.createBufferSource();
    beet.load(beet.context, hit, function(buffer) {
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(time);
    });
  }

  const headerProps = {
    layers,
    pattern,
    setPattern,
    beet,
    tempo,
    setTempo,
    addLayer
  };

  return (
    <div className="App">
      <Header {...headerProps} />
      <div className="wrapper">
        {layers.map(layer => (
          <Layer key={layer.id} guia={layer} removeLayer={removeLayer} />
        ))}
      </div>
    </div>
  );
}

export default App;
