import Clavis from "./circis";
import Pattern from "./pattern";
import shortid from "shortid";
import * as Tone from "tone";

class Circle {
  constructor(piano) {
    console.log("new Circle");
    this.id = shortid.generate();
    this.pattern = new Pattern("100010010000");
    this.clavis = new Clavis();
    this.size = this.pattern.sequence.length;
    this.piano = piano;
    this.bpm = 120;
    this.circleNotes = [
      "C1",
      "C#1",
      "D1",
      "D#1",
      "E1",
      "F1",
      "F#1",
      "G1",
      "G#1",
      "A1",
      "A#1",
      "B1",
    ];

    Tone.Transport.bpm.value = this.bpm;

    this.indexArray = (count) => {
      const indices = [];
      for (let i = 0; i < count; i++) {
        indices.push(i);
      }
      return indices;
    };

    this.tick = (time, value) => {
      if (this.pattern.sequence[value] === "1") {
        this.piano.triggerAttackRelease(this.circleNotes[value], 0.25);
      }
      Tone.Draw.schedule(() => {
        this.clavis.setCurrentStep(value);
        this.clavis.draw();
      }, time);
    };

    this.seq = new Tone.Sequence({
      callback: this.tick,
      events: this.indexArray(this.size),
      subdivision: `${this.size}n`,
    }).start(0);
  }

  shift(value) {
    this.pattern = this.pattern.shift(value);
  }

  setBpm(bpm) {
    this.bpm = bpm;
    const now = Tone.Transport.now();
    Tone.Transport.bpm.setValueAtTime(this.bpm, now);
  }

  updatePattern(pattern) {
    this.pattern = new Pattern(pattern);
    this.size = this.pattern.sequence.length;
    this.clavis.draw();
  }

  start() {
    console.log("start");
    Tone.start();
    Tone.Transport.start();
    this.seq.start();
  }

  stop() {
    Tone.Transport.stop();
    this.seq.stop();
  }
}

export default Circle;
