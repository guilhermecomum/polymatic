import React, { useEffect, useContext, useRef } from "react";
import * as Tone from "tone";

function Sandbox() {
  const synth = new Tone.Synth();
  synth.toDestination();

  const pattern = new Tone.Pattern(
    function (time, note) {
      synth.triggerAttackRelease(note, 0.25);
    },
    ["C4", "", "C4", "", "C4", "", ""]
  );

  pattern.start(0);

  return (
    <div className="App">
      <div className="wrapper">
        <button onClick={() => Tone.Transport.start()}>Start</button>
        <button onClick={() => Tone.Transport.stop()}>Stop</button>
      </div>
    </div>
  );
}

export default Sandbox;
