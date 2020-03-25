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
  const [layers, setLayers] = useState([]);
  const [preview, setPreview] = useState(true);
  const [pattern, setPattern] = useState("1000101000101000");
  const [store, updateStore] = useState([]);

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const beet = new Beet({
    context: context,
    tempo: 120
  });

  const handleLayer = (pattern, tempo, sample) => {
    setPreview(false);
    const sequence = beet.pattern(pattern);
    const clavis = new Clavis();
    const channel = new Channel();
    channel.configure(context, beet, instruments[sample]);
    const guia = { layer: beet.layer(sequence, clavis, channel.callbackOn) };
    guia.layer.tempo = tempo;
    beet.add(guia.layer);
    addLayer(pattern, tempo, guia.layer, clavis, channel);
  };

  const handleStoreUpdate = clave => {
    clave.instruments.map(instrument => {
      const { pattern, tempo, sample } = instrument;
      updateStore([...store, { pattern, tempo, sample }]);
      handleLayer(pattern, tempo, sample);
    });
    beet.start();
  };

  const addLayer = (pattern, tempo, layer, clavis, channel) => {
    setLayers(layers =>
      layers.concat({
        id: shortid.generate(),
        sequence: pattern,
        tempo: tempo,
        layer: layer,
        clavis: clavis,
        channel: channel
      })
    );
  };

  const removeLayer = guia => {
    beet.remove(guia.layer);
    guia.clavis.pause();
    setLayers(layers.filter(layer => layer.id !== guia.id));
  };

  const headerProps = {
    layers,
    beet,
    pattern,
    setPattern,
    setPreview,
    handleStoreUpdate
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
            guia={{ sequence: pattern, clavis: new Clavis(), tempo: 120 }}
            preview
          />
        )}
      </div>
    </div>
  );
}

export default App;
