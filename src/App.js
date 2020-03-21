import React, { useState } from "react";
import Beet from "./lib/beet";
import Clavis from "./lib/clavis";
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
  const [sample, setSample] = useState("drum1");

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const beet = new Beet({
    context: context,
    tempo: tempo
  });

  const addLayer = () => {
    const sequence = beet.pattern(pattern);
    const clavis = new Clavis();
    const guia = { layer: beet.layer(sequence, clavis, callback) };
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

  function callback(time, step) {
    console.log("Sample: ", instruments[sample]);
    const source = context.createBufferSource();
    beet.load(beet.context, instruments[sample], function(buffer) {
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(time);
    });
  }

  // function synth(time, step) {
  //   console.log("Step: ", step);
  //   var osc = context.createOscillator();
  //   var gain = context.createGain();
  //   osc.connect(gain);
  //   gain.connect(context.destination);
  //   osc.frequency.value = 277;
  //   beet.envelope(gain.gain, time, {
  //     start: 0,
  //     peake: 0.5,
  //     attack: 0.02,
  //     decay: 0.1,
  //     sustain: 0.1,
  //     release: 0.2
  //   });
  //   osc.start(time);
  //   osc.stop(time + 0.5);
  // }

  const headerProps = {
    layers,
    pattern,
    setPattern,
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
      </div>
    </div>
  );
}

export default App;
