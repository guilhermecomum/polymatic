import Clavis from "./clavis";
import Pattern from "./pattern";
import shortid from "shortid";
import * as Tone from "tone";

class Clave {
  constructor(
    sequence,
    tempo,
    instrument,
    sample,
    polymetric = false,
    prevSequence
  ) {
    this.id = shortid.generate();
    this.prevSequence = prevSequence;
    this.pattern = new Pattern(sequence);
    this.tempo = tempo;
    this.volume = 3;
    this.polymetric = polymetric;
    this.clavis = new Clavis();
    this.size = this.pattern.sequence.length;
    this.instrument = instrument;
    this.sample = sample;
    this.context = new Tone.Context();
    this.channel = new Tone.Channel({
      volume: this.volume,
      pan: 0,
      context: this.context,
    });
    this.context.transport.bpm.value = this.tempo;
    this.player = new Tone.Player({
      url: this.sample,
      context: this.context,
    });

    if (this.polymetric) {
      let prevSteps = this.prevSequence.length;

      let newSteps = this.size;
      if (newSteps !== prevSteps) {
        if (prevSteps > newSteps) {
          let ratio = prevSteps / newSteps;
          this.tempo = (this.tempo * ratio).toFixed(2);
        } else {
          let ratio = newSteps / prevSteps;
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
      if (this.pattern.sequence[value] === "1") {
        this.player
          .sync()
          .start(time)
          .chain(this.channel, this.context.destination);
      }
      this.context.draw.schedule(() => {
        this.clavis.setCurrentStep(value);
      }, time);
    };

    this.seq = new Tone.Sequence({
      context: this.context,
      callback: this.tick,
      events: this.indexArray(this.size),
      subdivision: `${this.size}n`,
    }).start(0);
    Tone.start();
    this.context.transport.start();
  }

  setVolume(volume) {
    this.volume = volume;
    this.channel.set({ volume });
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
    this.seq.dispose();
    this.context.dispose();
    this.channel.dispose();
  }

  start() {
    this.seq.start();
    this.clavis.play();
  }

  pause() {
    this.clavis.pause();
  }

  stop() {
    this.seq.stop();
    this.clavis.pause();
  }
}

export default Clave;
