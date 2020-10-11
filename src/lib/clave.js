import Clavis from "./clavis";
import Pattern from "./pattern";
import shortid from "shortid";
import * as Tone from "tone";

class Clave {
  constructor(baseTempo, sequence, tempo, polymetric, heart) {
    this.id = shortid.generate();
    this.baseTempo = baseTempo;
    this.pattern = new Pattern(sequence);
    this.tempo = tempo;
    this.volume = 1.0;
    this.polymetric = polymetric;
    this.clavis = new Clavis();
    this.size = this.pattern.sequence.length;

    if (this.polymetric) {
      let firstSteps = this.baseTempo.length;

      let newSteps = this.size;
      if (newSteps !== firstSteps) {
        if (firstSteps > newSteps) {
          let ratio = firstSteps / newSteps;
          this.tempo = (this.tempo * ratio).toFixed(2);
        } else {
          let ratio = newSteps / firstSteps;
          this.tempo = (this.tempo / ratio).toFixed(2);
        }
      }
    }

    this.indexArray = (count) => {
      const indices = [];
      for (let i = 0; i < count; i++) {
        indices.push(i);
      }
      return indices;
    };

    this.tick = (time, value) => {
      Tone.Draw.schedule(() => {
        this.clavis.setCurrentStep(value);
      }, time);
      if (this.pattern.sequence[value] === "1") {
        heart.player(0).start(time, 0, "16t");
      }
    };

    const seq = new Tone.Sequence(
      this.tick,
      this.indexArray(this.size),
      `${this.size}n`
    ).start(0);
    Tone.Transport.start();
  }

  setVolume(volume) {
    this.volume = volume;
  }

  pattern(pulses, steps) {
    return new Pattern(pulses, steps);
  }

  shift(value) {
    this.pattern = this.pattern.shift(value);
    this.clavis.draw();
  }

  remove() {
    this.clavis.pause();
  }

  start() {
    this.clavis.play();
  }

  pause() {
    this.clavis.pause();
  }

  stop() {
    this.clavis.pause();
  }
}

export default Clave;
