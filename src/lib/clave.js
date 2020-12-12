import Clavis from "./clavis";
import Pattern from "./pattern";
import shortid from "shortid";
import * as Tone from "tone";

class Clave {
  constructor(
    sequence,
    bpm,
    instrument,
    sample,
    polymetric = false,
    prevSequence
  ) {
    this.id = shortid.generate();
    this.prevSequence = prevSequence;
    this.pattern = new Pattern(sequence);
    this.bpm = bpm;
    this.volume = 0;
    this.polymetric = polymetric;
    this.clavis = new Clavis();
    this.size = this.pattern.sequence.length;
    this.instrument = instrument;
    this.sample = sample;
    this.activeStep = null;
    this.context = new Tone.Context();
    this.channel = new Tone.Channel({
      volume: this.volume,
      pan: 0,
      context: this.context,
    });

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
          this.bpm = (this.bpm * ratio).toFixed(2);
        } else {
          let ratio = newSteps / prevSteps;
          this.bpm = (this.bpm / ratio).toFixed(2);
        }
      }
    }

    this.context.transport.bpm.value = this.bpm;

    this.indexArray = (count) => {
      const indices = [];
      for (let i = 0; i < count; i++) {
        indices.push(i);
      }
      return indices;
    };

    this.tick = (time, value) => {
      if (this.pattern.sequence[value] === "1") {
        this.player.start(time).chain(this.channel, this.context.destination);
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

  setActivestep(ref) {
    this.activeStep = ref;
  }

  setBpm(bpm) {
    this.bpm = bpm;
    const now = this.context.transport.now();
    this.context.transport.bpm.setValueAtTime(this.bpm, now);
  }

  remove() {
    this.clavis.pause();
    this.seq.dispose();
    this.context.dispose();
    this.channel.dispose();
  }

  start() {
    this.context.transport.start();
    this.seq.start();
    this.clavis.play();
  }

  stop() {
    this.context.transport.stop();
    this.clavis.pause();
    this.seq.stop();
  }
}

export default Clave;
