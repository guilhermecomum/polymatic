import React, { useState } from "react";
import Beet from "./lib/beet";
import hit from "./samples/hit2.wav";
import Layer from "./Layer";
import "./App.css";

function App() {
  const [pattern, setPattern] = useState("1000101000101000");
  const [tempo, setTempo] = useState(120);
  const [guias, setGuias] = useState([]);

  window.AudioContext = window.AudioContext || window.webkitAudioContext;
  const context = new AudioContext();
  const beet = new Beet({
    context: context
  });

  const addLayer = () => {
    const sequence = beet.pattern(pattern);
    const guia = { layer: beet.layer(sequence, drum) };
    guia.layer.tempo = 120;
    beet.add(guia.layer).start();

    setGuias([
      ...guias,
      {
        sequence: pattern,
        tempo: tempo,
        layer: guia.layer
      }
    ]);
  };

  // const buildClavis = () => {
  //   const tempo = 120;
  //   const clavis = new Clavis(canvasRef.current, pattern, tempo);
  //   clavis.draw();
  // };

  function drum(time, step) {
    var source = context.createBufferSource();
    beet.utils.load(beet.context, hit, function(buffer) {
      source.buffer = buffer;
      source.connect(context.destination);
      source.start(time);
    });
  }

  // const synth1 = (time, step) => {
  //   var osc = context.createOscillator();
  //   var gain = context.createGain();
  //   osc.connect(gain);
  //   gain.connect(context.destination);
  //   osc.frequency.value = 277;
  //   beet.utils.envelope(gain.gain, time, {
  //     start: 0,
  //     peake: 0.5,
  //     attack: 0.02,
  //     decay: 0.1,
  //     sustain: 0.1,
  //     release: 0.2
  //   });
  //   osc.start(time);
  //   osc.stop(time + 0.5);
  // };
  console.log("Layers: ", guias);

  return (
    <div className="App">
      <input placeholder="padrão" onChange={e => setPattern(e.target.value)} />
      <input placeholder="tempo" onChange={e => setTempo(e.target.value)} />
      <button onClick={() => addLayer()}>Adicinar </button>
      {guias.map((layer, index) => (
        <Layer key={index} layer={layer} />
      ))}
    </div>
  );
}

export default App;
