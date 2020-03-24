import React, { useState } from "react";
import Beet from "./lib/beet";
import Clavis from "./lib/clavis";
import Channel from "./lib/channel";
import instruments from "./instruments";
import shortid from "shortid";
import Layer from "./Layer";
import Header from "./Header";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

function App() {
  const [pattern, setPattern] = useState("1000101000101000");
  const [tempo, setTempo] = useState(120);
  const [layers, setLayers] = useState([]);
  const [sample, setSample] = useState("agogo1");
  const [preview, setPreview] = useState(true);

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const beet = new Beet({
    context: context,
    tempo: tempo
  });

  const handlePattern = value => {
    setPreview(true);
    setPattern(value);
  };

  const addLayer = () => {
    setPreview(false);
    const sequence = beet.pattern(pattern);
    const clavis = new Clavis();
    const channel = new Channel();
    channel.configure(context, beet, instruments[sample]);
    const guia = { layer: beet.layer(sequence, clavis, channel.callbackOn) };
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
        clavis: clavis,
        channel: channel
      }
    ]);
  };

  const removeLayer = guia => {
    beet.remove(guia.layer);
    guia.clavis.pause();
    setLayers(layers.filter(layer => layer.id !== guia.id));
  };

  const headerProps = {
    layers,
    pattern,
    handlePattern,
    setSample,
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
        {preview && pattern.length > 1 && (
          <Layer
            guia={{ sequence: pattern, clavis: new Clavis(), tempo }}
            preview
          />
        )}
      </div>
    </div>
  );
}

export default App;
